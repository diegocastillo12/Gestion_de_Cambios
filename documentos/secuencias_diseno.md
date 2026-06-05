# Documento de Diseño de Software (SAD) - Diagramas de Secuencia de Diseño

En la fase de diseño (SAD - Software Architecture Document), los **Diagramas de Secuencia de Diseño** detallan los componentes técnicos reales de la arquitectura de software. A diferencia de los diagramas conceptuales de análisis, estos diagramas muestran enrutadores HTTP, controladores, servicios auxiliares de encriptación y validación, modelos de acceso a datos (ORM/ActiveRecord), sentencias SQL y cambios en el estado de la base de datos física.

A continuación, se presentan **4 diagramas de secuencia técnicos** correspondientes a los flujos clave del backend de GestioCambios.

---

## 1. Flujo de Autenticación de Usuario (Login)

Representa la verificación técnica de credenciales contra la base de datos MySQL, el hashing seguro mediante `bcrypt` y el establecimiento de la sesión.

### Código PlantUML

```plantuml
@startuml Seq_Diseno_Login

autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Usuario (Navegador)" as actor
boundary "Ruta POST /login" as route
control "authController.login" as ctrl
entity "UserModel" as model
database "MySQL (tabla usuarios)" as db
control "bcrypt" as crypt

actor -> route : Envía credenciales (correo, password)
route -> ctrl : invoca controlador
ctrl -> model : findByCorreo(correo)
model -> db : SELECT * FROM usuarios WHERE correo = ?
db --> model : retorna datos de usuario (id, nombre, rol, password_hash)
model --> ctrl : retorna objeto u
alt usuario no encontrado
  ctrl --> actor : render("login", { error: "Correo o contraseña incorrectos" })
else usuario encontrado
  ctrl -> crypt : compare(password, u.password_hash)
  crypt --> ctrl : retorna resultado (true/false)
  alt contraseña incorrecta
    ctrl --> actor : render("login", { error: "Correo o contraseña incorrectos" })
  else contraseña correcta
    ctrl -> ctrl : req.session.user = { id, nombre, correo, rol }
    ctrl --> actor : HTTP 302 Redirect to "/"
  end
end

@enduml
```

---

## 2. Creación de Solicitud de Cambio (Ticket SCM)

Muestra la lógica de concurrencia para generar un `ticket_id` único sin colisiones, la inserción física en MySQL, y la creación automática del registro inicial de auditoría.

### Código PlantUML

```plantuml
@startuml Seq_Diseno_Crear_Ticket

autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Solicitante (Navegador)" as actor
boundary "Ruta POST /tickets/crear" as route
control "changeController.crearTicket" as ctrl
entity "TicketModel" as model
database "MySQL (solicitudes_cambio)" as db
database "MySQL (historial_estados)" as db_hist

actor -> route : Envía formulario (titulo, descripcion, justificacion_tecnica, tipo, prioridad, estimacionHoras, id_proyecto)
route -> ctrl : req.session.user, invoca controlador
ctrl -> model : countAll()
model -> db : SELECT COUNT(*) AS cnt FROM solicitudes_cambio
db --> model : retorna cantidad de registros
model --> ctrl : retorna count
loop hasta insertar con ticket_id único (attempts < 10)
  ctrl -> ctrl : Generar ticket_id (TK-SC + count + 1 + attempts)
  ctrl -> model : create(ticketData)
  model -> db : INSERT INTO solicitudes_cambio (id_proyecto, ticket_id, titulo, ...)
  alt inserción exitosa
    db --> model : OK (insertId)
    model --> ctrl : retorna resultado exitoso
  else error ER_DUP_ENTRY (concurrencia)
    db --> model : Error de llave duplicada
    model --> ctrl : arroja error / attempts++
  end
end
ctrl -> model : findById(ticket_id)
model -> db : SELECT * FROM solicitudes_cambio WHERE ticket_id = ?
db --> model : retorna ticket creado
model --> ctrl : retorna newTicket (id_sc)
ctrl -> model : addHistorial({ idSc, estadoAnterior: null, estadoNuevo: 'Solicitado', comentario: 'Ticket creado.' })
model -> db_hist : INSERT INTO historial_estados (id_sc, estado_anterior, estado_nuevo, usuario_nombre, usuario_rol, comentario)
db_hist --> model : OK
model --> ctrl : retorna historial registrado
ctrl --> actor : HTTP 302 Redirect to "/tickets/TK-SCxxx"

@enduml
```

---

## 3. Registro de Evidencia de Código (Asociación de Rama Git)

Representa el flujo de integración técnica en el cual un desarrollador asocia su rama de desarrollo y PR de GitHub. Involucra la validación de transiciones en `WorkflowService` y la sincronización con el cronograma.

### Código PlantUML

```plantuml
@startuml Seq_Diseno_Evidencia_Git

autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Desarrollador (Navegador)" as actor
boundary "Ruta POST /tickets/:id/estado" as route
control "changeController.cambiarEstado" as ctrl
entity "TicketModel" as model
control "WorkflowService" as service
entity "ProyectoModel" as proj_model
entity "CronogramaModel" as cron_model
database "MySQL (evidencias_git)" as db_git
database "MySQL (historial_estados)" as db_hist

actor -> route : Envía actualización (nuevoEstado: "En Pruebas", rama, mergeRequest, comentario)
route -> ctrl : invoca controlador
ctrl -> model : findById(ticketId)
model --> ctrl : retorna ticket
ctrl -> proj_model : getEquipo(id_proyecto) / getClientes(id_proyecto)
proj_model --> ctrl : retorna equipo y clientes
ctrl -> ctrl : Determinar rolEfectivo del usuario en proyecto
ctrl -> service : isValidTransition(ticket.estado, nuevoEstado, rolEfectivo)
service --> ctrl : retorna esValido (true)
ctrl -> model : updateEstado(ticket.id_sc, nuevoEstado)
model -> db_git : UPDATE solicitudes_cambio SET estado_actual = ? WHERE id_sc = ?
db_git --> model : OK
ctrl -> model : addHistorial({ idSc, estadoAnterior, estadoNuevo, comentario, ... })
model -> db_hist : INSERT INTO historial_estados (...)
db_hist --> model : OK
ctrl -> model : saveEvidenciaGit({ idSc, nombreRama, urlPullRequest, comentarioTecnico })
model -> db_git : INSERT INTO evidencias_git (...) ON DUPLICATE KEY UPDATE ...
db_git --> model : OK
ctrl -> cron_model : syncAvanceConTicket(id_sc, nuevoEstado, userId, idProyecto)
cron_model --> ctrl : actualiza porcentaje de actividad
ctrl --> actor : HTTP 200 JSON { success: true, ok: true, nuevoEstado }

@enduml
```

---

## 4. Registro de Pruebas y Cierre de Control de Calidad (QA/UAT)

Detalla cómo el rol Tester asienta las pruebas funcionales en la base de datos a través del controlador de negocio, persistiendo los datos de QA y actualizando el workflow hacia un estado validado.

### Código PlantUML

```plantuml
@startuml Seq_Diseno_Control_Calidad

autonumber
skinparam defaultFontName Arial
skinparam defaultFontSize 12

actor "Tester (Navegador)" as actor
boundary "Ruta POST /tickets/:id/estado" as route
control "changeController.cambiarEstado" as ctrl
entity "TicketModel" as model
control "WorkflowService" as service
entity "CronogramaModel" as cron_model
database "MySQL (control_calidad)" as db_qa
database "MySQL (historial_estados)" as db_hist

actor -> route : Envía actualización (nuevoEstado: "Aprobado", qaAprobado: "true", qaNotes: "Pruebas OK")
route -> ctrl : invoca controlador
ctrl -> model : findById(ticketId)
model --> ctrl : retorna ticket
ctrl -> service : isValidTransition(ticket.estado, nuevoEstado, rolEfectivo)
service --> ctrl : retorna esValido (true)
ctrl -> model : updateEstado(ticket.id_sc, nuevoEstado)
model --> ctrl : OK
ctrl -> model : addHistorial({ idSc, estadoAnterior, estadoNuevo, comentario: qaNotes, ... })
model -> db_hist : INSERT INTO historial_estados (...)
db_hist --> model : OK
ctrl -> model : saveControlCalidad({ idSc, qaEstado: 'Aprobado', qaObservaciones: qaNotes, ... })
model -> db_qa : INSERT INTO control_calidad (...) ON DUPLICATE KEY UPDATE ...
db_qa --> model : OK
ctrl -> cron_model : syncAvanceConTicket(id_sc, nuevoEstado, userId, idProyecto)
cron_model --> ctrl : actualiza porcentaje de actividad
ctrl --> actor : HTTP 200 JSON { success: true, ok: true, nuevoEstado }

@enduml
```
