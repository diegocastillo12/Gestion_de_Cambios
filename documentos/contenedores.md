# Diagrama de Contenedores del Sistema - GestioCambios

El **Diagrama de Contenedores** (Modelo C4 - Nivel 2) detalla la arquitectura lógica de alto nivel de GestioCambios. Muestra los límites del sistema divididos en sus contenedores de ejecución (aplicación cliente, servidor de aplicación web y almacenamiento de base de datos), las tecnologías empleadas en cada uno, los protocolos de comunicación y su integración con sistemas externos.

---

## 1. Diagrama en PlantUML

```plantuml
@startuml GestioCambios_Contenedores
skinparam defaultFontName Arial
skinparam defaultFontSize 12
skinparam actorStyle awesome

' 1. ACTORES
actor "Solicitante" as Sol
actor "Desarrollador" as Dev
actor "Tester" as Test
actor "Administrador / Director" as Admin

' 2. LIMITE DEL SISTEMA GESTIOCAMBIOS
package "Sistema GestioCambios [Límite del Sistema]" {
    
    rectangle "Navegador Web [Contenedor: Cliente Web]\nTecnología: HTML5, CSS, Vanilla JS\nPresenta las interfaces de usuario dinámicas para el dashboard, administración de proyectos, cronogramas y tickets." as Front
    
    rectangle "Servidor Web y API [Contenedor: Node.js, Express]\nTecnología: JavaScript, Express.js\nProcesa solicitudes HTTP, maneja sesiones de usuarios locales, evalúa reglas del workflow SCM e interactúa con la BD." as Back
    
    database "Base de Datos [Contenedor: MySQL]\nTecnología: MySQL 8\nAlmacena de forma segura usuarios, metodologías estructuradas, tickets de cambio, bitácoras de auditoría y reportes de QA." as DB
}

' 3. SISTEMAS EXTERNOS
rectangle "GitHub / GitLab [Servicio Externo]\nTecnología: HTTPS\nPlataforma externa para control de versiones donde se encuentran el código y las solicitudes de integración (Pull Requests)." as Git

' --- RELACIONES DE COMUNICACION ---

' Actores con el Navegador
Sol --> Front : "Monitorea tickets y proyectos"
Dev --> Front : "Registra ramas Git y reportes"
Test --> Front : "Registra evidencias de QA"
Admin --> Front : "Administra proyectos, personal y metodologías"

' Comunicación entre Contenedores Internos
Front --> Back : "1. Envía peticiones HTTP / REST API\n[Protocolo: HTTP/HTTPS - Puerto 3000]"
Back --> DB : "2. Realiza consultas SQL parametrizadas\n[Protocolo: TCP/IP - Puerto 3306]"

' Relación con el exterior
Back --> Git : "3. Vincula y asocia Pull Requests de código\n[Protocolo: HTTPS / REST]"

@enduml
```

---

## 2. Especificación Técnica de los Contenedores

* **Navegador Web (Cliente Web):**
  * **Tecnologías:** HTML5, CSS3, Javascript Vanilla (`sidebar.js`, etc.).
  * **Descripción:** Es la aplicación front-end que corre en el navegador del cliente. Proporciona la interfaz interactiva. Realiza llamadas asíncronas (AJAX) para el envío de evidencias y cambios de estado del ticket.
* **Servidor Web y API (Back-end):**
  * **Tecnologías:** Node.js, Express.js, bcryptjs, express-session.
  * **Descripción:** Es la aplicación de servidor en tiempo de ejecución. Sirve páginas pre-renderizadas con el motor EJS, procesa la autenticación local segura, administra las sesiones de usuario y expone una API REST. Ejecuta el core del workflow SCM (`WorkflowService`).
* **Base de Datos (Persistencia):**
  * **Tecnologías:** MySQL 8.
  * **Descripción:** Almacena de forma persistente y relacional toda la información estructurada del sistema.
* **GitHub / GitLab (Servicio Git Externo):**
  * **Tecnologías:** HTTPS API.
  * **Descripción:** Servidor externo de versionamiento. El backend almacena las URLs lógicas para garantizar la trazabilidad de los commits vinculados a un ticket SCM.
