# Diagrama de Componentes - GestioCambios

El **Diagrama de Componentes** (Modelo C4 - Nivel 3) detalla la organización lógica de los módulos de software en tiempo de ejecución, sus interfaces de comunicación y la distribución de responsabilidades entre el frontend, el backend y la capa de almacenamiento en el servidor físico.

---

## 1. Diagrama en PlantUML

```plantuml
@startuml GestioCambios_Componentes
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam componentStyle uml2

' 1. CLIENT PRESENTATION LAYER (Navegador)
package "Navegador Cliente [Presentación]" as P_Presentation {
  component [EJS Render Engine (HTML/CSS)] as EJS_UI
  component [styles.css] as CSS_Static
  component [sidebar.js (AJAX Client)] as JS_Client
}

' 2. WEB SERVICES & API LAYER (Express / Node.js)
package "Express Application Server [Node.js Backend]" as P_Backend {
  
  interface "HTTP / HTTPS Port 3000" as Port_3000
  interface "REST API Port 3000" as Port_API
  
  ' Enrutamiento
  component [webRoutes.js] as Router_Web
  component [apiRoutes.js] as Router_API
  
  ' Controladores
  component [authController.js] as Auth_Ctrl
  component [changeController.js] as Change_Ctrl
  component [proyectoController.js] as Proj_Ctrl
  component [adminController.js] as Admin_Ctrl
  
  ' Servicios del Dominio
  component [WorkflowService.js] as Workflow_Svc
  
  ' Modelos de Datos (DAO)
  component [UserModel.js] as Model_User
  component [TicketModel.js] as Model_Ticket
  component [ProyectoModel.js] as Model_Proj
  component [CronogramaModel.js] as Model_Crono
  component [ReporteModel.js] as Model_Rep
  component [MetodologiaModel.js] as Model_Met
  
  ' Conector de Base de Datos
  component [db.js (Pool Helper)] as db_conn
}

' 3. DATABASE SERVER LAYER (MySQL)
package "Database Server [MySQL 8]" as P_Database {
  interface "MySQL Connection Pool Port 3306" as Port_3306
  component [MySQL Engine] as DB_Engine
}

' 4. EXTERNAL LAYER (SaaS)
component [GitHub / GitLab SaaS] as Git_Svc

' --- RELACIONES Y FLUJOS DE COMUNICACIÓN EN TIEMPO DE EJECUCIÓN ---

' Interfaz de cliente a enrutadores
EJS_UI --> Port_3000 : "Carga y navegación web"
JS_Client --> Port_API : "Llamadas asíncronas AJAX"

Port_3000 -- Router_Web
Port_API -- Router_API

' Despacho de rutas a controladores
Router_Web --> Auth_Ctrl : "Despacha"
Router_Web --> Change_Ctrl : "Despacha"
Router_Web --> Proj_Ctrl : "Despacha"
Router_Web --> Admin_Ctrl : "Despacha"

Router_API --> Change_Ctrl : "Despacha llamadas API"
Router_API --> Proj_Ctrl : "Despacha llamadas API"
Router_API --> Admin_Ctrl : "Despacha llamadas API"

' Controladores a Servicios y Modelos
Change_Ctrl --> Workflow_Svc : "Valida transiciones"
Change_Ctrl --> Model_Ticket : "CRUD de Solicitud de Cambio"
Change_Ctrl --> Model_Proj : "Consulta equipo y miembros"
Change_Ctrl --> Model_Crono : "Sincroniza actividades vinculadas"

Auth_Ctrl --> Model_User : "Consulta credenciales locales"

Proj_Ctrl --> Model_Proj : "Consulta proyectos asignados"
Proj_Ctrl --> Model_Crono : "CRUD de actividades"
Proj_Ctrl --> Model_Rep : "Consulta y crea reportes"

Admin_Ctrl --> Model_User : "CRUD de cuentas"
Admin_Ctrl --> Model_Proj : "Crea proyectos y asignaciones"
Admin_Ctrl --> Model_Met : "CRUD de estructuras de entregables"

' Modelos a la Base de Datos
Model_User --> db_conn : "Envía SQL parametrizado"
Model_Ticket --> db_conn : "Envía SQL parametrizado"
Model_Proj --> db_conn : "Envía SQL parametrizado"
Model_Crono --> db_conn : "Envía SQL parametrizado"
Model_Rep --> db_conn : "Envía SQL parametrizado"
Model_Met --> db_conn : "Envía SQL parametrizado"

db_conn --> Port_3306 : "Petición pool de conexiones"
Port_3306 -- DB_Engine

' Frontend con el exterior
JS_Client ..> Git_Svc : "Vincula URLs de Pull Requests"

@enduml
```

---

## 2. Especificación de Componentes e Interfaces

### Capa de Cliente (Presentación)
* **`EJS Render Engine (HTML/CSS)`:** Motor de plantillas que procesa y muestra la maquetación dinámica.
* **`styles.css`:** Contiene las reglas CSS globales de la interfaz del sistema.
* **`sidebar.js`:** Lógica de scripting cliente que maneja eventos asíncronos (AJAX) para transmitir actualizaciones en formato JSON de estados, asignaciones, Git y control de calidad.

### Capa del Servidor de Aplicación (Backend)
* **`webRoutes.js` y `apiRoutes.js`:** Enrutadores que dirigen las llamadas URL a las operaciones de controladores correspondientes.
* **Controladores (`authController`, `changeController`, `proyectoController` y `adminController`):** Orquestan el procesamiento de datos, validan perfiles de sesión y devuelven respuestas.
* **`WorkflowService.js`:** Servicio centralizado que evalúa la validez de los cambios de estado en base a la máquina de estados.
* **Capa de Modelos DAO (`UserModel`, `TicketModel`, `ProyectoModel`, `CronogramaModel`, `ReporteModel` y `MetodologiaModel`):** Abstraen el acceso a la base de datos implementando las funciones asíncronas de lectura y escritura.
* **`db.js`:** Utilidad pool que automatiza la conexión y desconexión con el socket relacional MySQL.

### Capa de Persistencia y Terceros
* **`MySQL Engine` (Puerto 3306):** Motor de base de datos relacional encargado de la consistencia e integridad de las tablas del sistema.
* **`GitHub / GitLab SaaS`:** Servidor externo de versionamiento referenciado lógicamente mediante enlaces URL en las solicitudes de cambio.
