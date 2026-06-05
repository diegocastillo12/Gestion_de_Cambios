# Modelo Lógico - Diagramas de Colaboración de Objetos (Análisis)

El **Modelo Lógico de Análisis de Objetos** representa cómo interactúan las instancias del sistema mediante el envío de mensajes (métodos o flujos) para cumplir con un escenario específico de negocio de GestioCambios.

Cada objeto se representa mediante un **nodo circular (interfaz/objeto)** y se detallan sus atributos en notas y sus mensajes sobre las líneas de comunicación. Estos diagramas están adaptados 100% a la lógica de negocio y arquitectura funcional de nuestro sistema GestioCambios en fase de análisis.

Se presentan **4 diagramas de colaboración de objetos** correspondientes a los casos de uso principales.

---

## 1. Escenario 1: Autenticación de Usuario (Login)

Representa el flujo del sistema donde un usuario ingresa sus credenciales locales (correo y contraseña), las cuales son validadas contra el modelo de datos de la base de datos usando bcrypt para iniciar su sesión y redirigir según su rol.

### Código PlantUML

```plantuml
@startuml Colaboracion_Autenticacion

skinparam defaultFontName Arial
skinparam defaultFontSize 12

' Nodos en formato circular
circle Usuario_Actor
circle VistaLogin
circle AuthController
circle UserModel

' Flujo de mensajes de nuestro sistema
Usuario_Actor --> VistaLogin : solicita login / ingresa credenciales
VistaLogin --> AuthController : login(correo, password)
AuthController --> UserModel : findByCorreo(correo)
UserModel --> AuthController : retorna datos del usuario y password_hash
AuthController --> AuthController : verificarHashPassword(password, password_hash)
AuthController --> VistaLogin : establece req.session.user y redirige a "/"

' Nota de atributos reales de UserModel
note right of UserModel
  id = 15
  nombre = "Diego Castillo"
  correo = "diego@virtual.upt.pe"
  rol = "Administrador"
  password_hash = "$2a$10$xyz..."
end note

@enduml
```

---

## 2. Escenario 2: Registro de Solicitud de Cambio (Creación de Ticket)

Representa el flujo en el cual el Solicitante crea un ticket formal de cambio con sus atributos de negocio (título, descripción, justificación técnica, impacto, tipo de cambio y estimación de horas hombre).

### Código PlantUML

```plantuml
@startuml Colaboracion_Registro_Ticket

skinparam defaultFontName Arial
skinparam defaultFontSize 12

' Nodos circulares
circle Solicitante
circle VistaCrearTicket
circle ChangeController
circle TicketModel

' Flujo de mensajes
Solicitante --> VistaCrearTicket : llenarFormularioTicket()
VistaCrearTicket --> ChangeController : registrarTicket(ticketData)
ChangeController --> TicketModel : countAll() [para correlativo]
ChangeController --> TicketModel : create(ticketData)
TicketModel --> ChangeController : retorna confirmación e id_sc
ChangeController --> VistaCrearTicket : redirige confirmación

' Nota de atributos de negocio para la entidad Solicitud de Cambio
note right of TicketModel
  id_sc = 42
  ticket_id = "SC-045"
  titulo = "Agregar Filtro Exportacion Excel"
  descripcion = "Permitir exportar reportes en formato xlsx"
  justificacion_tecnica = "Requerido por auditoría"
  tipo_cambio = "Mejora"
  impacto = "Alta"
  estado_actual = "Solicitado"
  horas_hombre_estimadas = 16
  id_solicitante = 10
end note

@enduml
```

---

## 3. Escenario 3: Integración de Código (Registro de Evidencia Git)

Representa la colaboración donde el Desarrollador asignado registra la rama de código y la URL del Pull Request de GitHub una vez terminado el desarrollo, cambiando el estado del ticket a "En Pruebas".

### Código PlantUML

```plantuml
@startuml Colaboracion_Evidencia_Git

skinparam defaultFontName Arial
skinparam defaultFontSize 12

' Nodos circulares
circle Desarrollador
circle VistaEvidenciaGit
circle ChangeController
circle TicketModel

' Flujo de mensajes
Desarrollador --> VistaEvidenciaGit : ingresarDatosGit()
VistaEvidenciaGit --> ChangeController : registrarEvidenciaGit(gitData)
ChangeController --> TicketModel : saveEvidenciaGit(gitData)
ChangeController --> TicketModel : updateEstado(idSc, "En Pruebas")
ChangeController --> TicketModel : addHistorial(histData)
TicketModel --> ChangeController : confirma guardado exitoso
ChangeController --> VistaEvidenciaGit : muestra estado actualizado

' Nota de atributos de EvidenciaGit asociados
note right of TicketModel
  id_sc = 42
  nombre_rama = "feature/SC-045-export-excel"
  url_pull_request = "github.com/empresa/crm/pull/412"
  comentario_tecnico = "Implementado con modulo exceljs"
end note

@enduml
```

---

## 4. Escenario 4: Evaluación de Calidad (Pruebas QA)

Representa el flujo de control de calidad donde el Tester registra el resultado del plan de pruebas (aprobado o rechazado) y observaciones, registrando la transición de estados en el historial.

### Código PlantUML

```plantuml
@startuml Colaboracion_Control_Calidad

skinparam defaultFontName Arial
skinparam defaultFontSize 12

' Nodos circulares
circle Tester
circle VistaPruebasQA
circle ChangeController
circle TicketModel

' Flujo de mensajes
Tester --> VistaPruebasQA : ingresarResultadoQA()
VistaPruebasQA --> ChangeController : registrarResultadoQA(qaData)
ChangeController --> TicketModel : saveControlCalidad(qaData)
ChangeController --> TicketModel : updateEstado(idSc, "Aprobado")
ChangeController --> TicketModel : addHistorial(histData)
TicketModel --> ChangeController : confirma guardado de auditoría
ChangeController --> VistaPruebasQA : muestra ticket como verificado

' Nota de atributos para ControlCalidad
note right of TicketModel
  id_sc = 42
  qa_estado = "Aprobado"
  qa_observaciones = "Pruebas de estrés y funcionales exitosas"
  qa_evidencia_url = "https://drive.google.com/test-SC-045"
  uat_estado = "Pendiente"
end note

@enduml
```
