# Diagramas de Secuencia del Sistema (Fase de Analisis) - GestioCambios

Este documento presenta los Diagramas de Secuencia del Sistema (SSD) detallados para cada uno de los casos de uso criticos del ciclo de vida de control de cambios, utilizando el patron conceptual **BCE (Boundary-Control-Entity / Frontera-Control-Entidad)**. 

Al separar cada accion en su propio diagrama, el cliente puede visualizar la participacion exacta de cada actor (Usuario, Solicitante, Director, Lider Tecnico, CCB, Gestor, Desarrollador y Tester) y la interfaz especifica involucrada.

---

## 1. Iniciar Sesion (UC-001)
* **Actor:** Usuario General (todos los roles)
* **Interfaz:** Interfaz de Autenticacion
* **Proceso:** Validacion y autorizacion de sesion global.

```plantuml
@startuml SSD_BCE_01_Iniciar_Sesion
autonumber

actor "Usuario" as Actor
boundary "Interfaz de Autenticacion" as Boundary
control "Gestor de Seguridad" as Control
entity "Almacen de Usuarios" as Entity

Actor -> Boundary : Solicita ingresar al sistema
Boundary --> Actor : Presenta formulario de credenciales y panel de demostracion
Actor -> Boundary : Ingresa correo y contrasena y confirma
Boundary -> Control : Validar credenciales (correo, contrasena)
activate Control

Control -> Entity : Buscar usuario por correo (correo)
activate Entity
Entity --> Control : Retorna datos de usuario (hash de clave y rol global)
deactivate Entity

Control -> Control : Compara contrasena con hash de seguridad

alt Credenciales Validas
  Control --> Boundary : Confirmacion de autenticacion exitosa
  Boundary --> Actor : Inicia sesion activa y redirige al panel correspondiente segun rol
else Credenciales Invalidas
  Control --> Boundary : Retorna error de autenticacion
  deactivate Control
  Boundary --> Actor : Muestra mensaje de credenciales incorrectas en pantalla
end
@enduml
```

---

## 2. Registrar Solicitud de Cambio (UC-010)
* **Actor:** Solicitante
* **Interfaz:** Interfaz de Formulario de Ticket
* **Proceso:** Creacion inicial de la peticion en el sistema.

```plantuml
@startuml SSD_BCE_02_Registrar_Solicitud
autonumber

actor "Solicitante" as Actor
boundary "Interfaz de Formulario de Ticket" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Completa campos del cambio (titulo, descripcion, justificacion, tipo, prioridad) y confirma
activate Boundary
Boundary -> Control : Registrar solicitud (datos)
activate Control

Control -> EntityTickets : Obtener correlativo de solicitudes ()
activate EntityTickets
EntityTickets --> Control : Retorna conteo de solicitudes
deactivate EntityTickets

Control -> Control : Genera ID correlativo (TK-SC00X)

Control -> EntityTickets : Crear registro de ticket (ID, datos, estado="Solicitado")
activate EntityTickets
EntityTickets --> Control : Confirmacion de registro
deactivate EntityTickets

Control -> EntityAudit : Registrar transicion inicial (ID, estado_nuevo="Solicitado")
activate EntityAudit
EntityAudit --> Control : Confirmacion de registro
deactivate EntityAudit

Control --> Boundary : Retorna registro de ticket exitoso
deactivate Control
Boundary --> Actor : Redirige y muestra la interfaz de detalle del ticket creado
deactivate Boundary
@enduml
```

---

## 3. Realizar Analisis de Impacto (UC-011)
* **Actor:** Lider Tecnico
* **Interfaz:** Interfaz de Analisis de Ticket
* **Proceso:** Estimacion de esfuerzo y evaluacion tecnica del cambio.

```plantuml
@startuml SSD_BCE_03_Analisis_Impacto
autonumber

actor "Lider Tecnico" as Actor
boundary "Interfaz de Analisis de Ticket" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Abre ticket En Analisis e ingresa horas estimadas, impacto, riesgo y version
activate Boundary
Boundary -> Control : Registrar analisis (id, horas, impacto, riesgo, version, comentario)
activate Control

Control -> EntityTickets : Guardar datos de analisis (id, horas, impacto, riesgo, version)
activate EntityTickets
EntityTickets --> Control : Confirmacion de actualizacion
deactivate EntityTickets

Control -> EntityTickets : Actualizar estado de ticket (id, estado="Pendiente de Aprobacion")
activate EntityTickets
EntityTickets --> Control : Confirmacion de actualizacion
deactivate EntityTickets

Control -> EntityAudit : Registrar auditoria (id, estado_anterior="En Analisis", estado_nuevo="Pendiente de Aprobacion")
activate EntityAudit
EntityAudit --> Control : Confirmacion de registro
deactivate EntityAudit

Control --> Boundary : Confirmacion de analisis procesado
deactivate Control
Boundary --> Actor : Recarga y muestra el ticket en estado Pendiente de Aprobacion
deactivate Boundary
@enduml
```

---

## 4. Aprobar o Rechazar Solicitud (UC-012)
* **Actor:** Director / CCB
* **Interfaz:** Interfaz de Aprobacion de Ticket
* **Proceso:** Resolucion y autorizacion formal del cambio analizado.

```plantuml
@startuml SSD_BCE_04_Aprobacion_Solicitud
autonumber

actor "Director / CCB" as Actor
boundary "Interfaz de Aprobacion de Ticket" as Boundary
control "Gestor de Cambios SCM" as Control
control "Motor de Flujo SCM" as Workflow
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Ingresa comentario justificativo y presiona Aprobar (o Rechazar)
activate Boundary
Boundary -> Control : Procesar decision (id, decision, comentario)
activate Control

Control -> Workflow : Validar permiso (estado_actual="Pendiente de Aprobacion", nuevo_estado, rol)
activate Workflow
Workflow --> Control : Transicion valida
deactivate Workflow

Control -> EntityTickets : Actualizar estado (id, nuevo_estado="Aprobado" o "Rechazado")
activate EntityTickets
EntityTickets --> Control : Confirmacion
deactivate EntityTickets

Control -> EntityAudit : Registrar auditoria (id, anterior="Pendiente de Aprobacion", nuevo_estado, comentario)
activate EntityAudit
EntityAudit --> Control : Confirmacion
deactivate EntityAudit

Control --> Boundary : Confirmacion de resolucion
deactivate Control
Boundary --> Actor : Muestra el estado actualizado en pantalla
deactivate Boundary
@enduml
```

---

## 5. Asignar Desarrollador y Tester (UC-013)
* **Actor:** Gestor de Configuracion
* **Interfaz:** Interfaz de Asignacion de Ticket
* **Proceso:** Designacion de personal tecnico para la solucion.

```plantuml
@startuml SSD_BCE_05_Asignar_Recursos
autonumber

actor "Gestor de Configuracion" as Actor
boundary "Interfaz de Asignacion de Ticket" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Selecciona Desarrollador, Tester y presiona Iniciar Desarrollo
activate Boundary
Boundary -> Control : Registrar asignacion (id, desarrollador_id, tester_id, comentario)
activate Control

Control -> EntityTickets : Asignar responsables (id, desarrollador_id, tester_id)
activate EntityTickets
EntityTickets --> Control : Confirmacion
deactivate EntityTickets

Control -> EntityTickets : Actualizar estado (id, estado="En Desarrollo")
activate EntityTickets
EntityTickets --> Control : Confirmacion
deactivate EntityTickets

Control -> EntityAudit : Registrar auditoria (id, anterior="Aprobado", nuevo="En Desarrollo")
activate EntityAudit
EntityAudit --> Control : Confirmacion
deactivate EntityAudit

Control --> Boundary : Confirmacion de inicio de desarrollo
deactivate Control
Boundary --> Actor : Recarga y muestra el ticket en estado En Desarrollo
deactivate Boundary
@enduml
```

---

## 6. Registrar Evidencias Git (UC-014)
* **Actor:** Desarrollador Asignado
* **Interfaz:** Interfaz de Evidencias Git
* **Proceso:** Registro de la rama y Pull/Merge Request de la solucion.

```plantuml
@startuml SSD_BCE_06_Evidencias_Git
autonumber

actor "Desarrollador Asignado" as Actor
boundary "Interfaz de Evidencias Git" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Evidencias" as EntityEvidence
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Escribe nombre de rama Git, URL de Pull Request, notas y confirma
activate Boundary
Boundary -> Control : Enviar a pruebas QA (id, rama, pull_request, comentario)
activate Control

Control -> EntityEvidence : Guardar evidencia Git (id, rama, pull_request, comentario)
activate EntityEvidence
EntityEvidence --> Control : Confirmacion
deactivate EntityEvidence

Control -> EntityTickets : Actualizar estado (id, estado="En Pruebas QA")
activate EntityTickets
EntityTickets --> Control : Confirmacion
deactivate EntityTickets

Control -> EntityAudit : Registrar auditoria (id, anterior="En Desarrollo", nuevo="En Pruebas QA")
activate EntityAudit
EntityAudit --> Control : Confirmacion
deactivate EntityAudit

Control --> Boundary : Evidencia Git registrada con exito
deactivate Control
Boundary --> Actor : Muestra ticket actualizado en estado En Pruebas QA
deactivate Boundary
@enduml
```

---

## 7. Registrar Pruebas QA (UC-015)
* **Actor:** Equipo QA / Tester
* **Interfaz:** Interfaz de Registro QA
* **Proceso:** Carga de resultados de ejecucion del plan de pruebas.

```plantuml
@startuml SSD_BCE_07_Registro_QA
autonumber

actor "Equipo QA / Tester" as Actor
boundary "Interfaz de Registro QA" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Evidencias" as EntityEvidence
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Escribe pruebas ejecutadas, falladas, notas, selecciona Aprobado (o Rechazado) y confirma
activate Boundary
Boundary -> Control : Registrar resultado QA (id, total_tests, fallidos, resultado, notas)
activate Control

Control -> EntityEvidence : Guardar reporte QA (id, total_tests, fallidos, resultado, notas)
activate EntityEvidence
EntityEvidence --> Control : Confirmacion
deactivate EntityEvidence

alt QA Aprobado
  Control -> EntityTickets : Actualizar estado (id, estado="En Pruebas UAT")
  activate EntityTickets
  EntityTickets --> Control : Confirmacion
  deactivate EntityTickets
  Control -> EntityAudit : Registrar auditoria (id, anterior="En Pruebas QA", nuevo="En Pruebas UAT")
  activate EntityAudit
  EntityAudit --> Control : Confirmacion
  deactivate EntityAudit
else QA Rechazado
  Control -> EntityTickets : Actualizar estado (id, estado="En Desarrollo")
  activate EntityTickets
  EntityTickets --> Control : Confirmacion
  deactivate EntityTickets
  Control -> EntityAudit : Registrar auditoria (id, anterior="En Pruebas QA", nuevo="En Desarrollo", notas)
  activate EntityAudit
  EntityAudit --> Control : Confirmacion
  deactivate EntityAudit
end

Control --> Boundary : Resultado QA registrado con exito
deactivate Control
Boundary --> Actor : Muestra el estado actualizado en pantalla
deactivate Boundary
@enduml
```

---

## 8. Validar en ambiente UAT (UC-016)
* **Actor:** Solicitante
* **Interfaz:** Interfaz de Conformidad UAT
* **Proceso:** Prueba de aceptacion del usuario final.

```plantuml
@startuml SSD_BCE_08_Conformidad_UAT
autonumber

actor "Solicitante" as Actor
boundary "Interfaz de Conformidad UAT" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Escribe comentarios y presiona Dar Conformidad (o Rechazar)
activate Boundary
Boundary -> Control : Procesar conformidad UAT (id, decision, comentarios)
activate Control

alt Cliente Conforme
  Control -> EntityTickets : Actualizar estado (id, estado="Listo para Integracion")
  activate EntityTickets
  EntityTickets --> Control : Confirmacion
  deactivate EntityTickets
  Control -> EntityAudit : Registrar auditoria (id, anterior="En Pruebas UAT", nuevo="Listo para Integracion")
  activate EntityAudit
  EntityAudit --> Control : Confirmacion
  deactivate EntityAudit
else Cliente No Conforme
  Control -> EntityTickets : Actualizar estado (id, estado="En Desarrollo")
  activate EntityTickets
  EntityTickets --> Control : Confirmacion
  deactivate EntityTickets
  Control -> EntityAudit : Registrar auditoria (id, anterior="En Pruebas UAT", nuevo="En Desarrollo", comentarios)
  activate EntityAudit
  EntityAudit --> Control : Confirmacion
  deactivate EntityAudit
end

Control --> Boundary : Conformidad procesada con exito
deactivate Control
Boundary --> Actor : Muestra el estado actualizado en pantalla
deactivate Boundary
@enduml
```

---

## 9. Integrar y Liberar Cambio (UC-017)
* **Actor:** Gestor de Configuracion
* **Interfaz:** Interfaz de Liberacion de Ticket
* **Proceso:** Merge en produccion, etiquetado de version y cierre del flujo.

```plantuml
@startuml SSD_BCE_09_Liberacion_Ticket
autonumber

actor "Gestor de Configuracion" as Actor
boundary "Interfaz de Liberacion de Ticket" as Boundary
control "Gestor de Cambios SCM" as Control
entity "Almacen de Tickets" as EntityTickets
entity "Almacen de Evidencias" as EntityEvidence
entity "Almacen de Auditoria" as EntityAudit

Actor -> Boundary : Ingresa tag de version, comentarios de release y presiona Liberar y Cerrar
activate Boundary
Boundary -> Control : Registrar liberacion (id, tag_version, release_notes)
activate Control

Control -> EntityEvidence : Guardar datos de release (id, tag_version, release_notes)
activate EntityEvidence
EntityEvidence --> Control : Confirmacion
deactivate EntityEvidence

Control -> EntityTickets : Actualizar estado (id, estado="Liberado")
activate EntityTickets
EntityTickets --> Control : Confirmacion
deactivate EntityTickets

Control -> EntityAudit : Registrar auditoria (id, anterior="Listo para Integracion", nuevo="Liberado")
activate EntityAudit
EntityAudit --> Control : Confirmacion
deactivate EntityAudit

Control --> Boundary : Solicitud liberada y cerrada exitosamente
deactivate Control
Boundary --> Actor : Muestra ticket cerrado en estado Liberado
deactivate Boundary
@enduml
```
