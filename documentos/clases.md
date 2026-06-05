# Modelo de Dominio (Diagrama de Clases Conceptual) - GestioCambios

El Modelo de Dominio es un diagrama de clases conceptual que representa las entidades del mundo real en el espacio del problema de GestioCambios, detallando sus atributos en lenguaje de negocio y sus relaciones, sin incluir métodos, clases de diseño de software (como controladores, enrutadores o modelos ORM) o componentes de infraestructura técnica.

---

## 1. Guía de Lectura para el Cliente

Para facilitar la comprensión del diagrama sin necesidad de conocimientos técnicos de UML, tenga en cuenta las siguientes pautas:

* **Clases (Cajas):** Representan los conceptos o "cosas" importantes del negocio (ej. Proyecto, Usuario, Solicitud de Cambio). Cada caja contiene características de ese concepto (atributos).
* **Tipos de Datos Conceptuales:** Para evitar tecnicismos de programación, los atributos utilizan tipos de datos de negocio:
  * **Texto:** Nombres, descripciones, estados o comentarios.
  * **Número:** Identificadores únicos, contadores u ordenaciones.
  * **Fecha / Fecha y Hora:** Momentos en el tiempo en que ocurren los eventos.
  * **Porcentaje:** Valores proporcionales (ej. avance de tareas).
* **Líneas de Relación (Conexiones):** Indican cómo se conectan dos conceptos en el mundo real (ej. un Proyecto *contiene* Actividades).
* **Multiplicidades (Números en los extremos de las líneas):**
  * **"1"**: Exactamente uno.
  * **"0..1"**: Opcional (puede tener uno o ninguno).
  * **"many" o "*"**: Varios o muchos (desde cero hasta muchos).
  * *Ejemplo:* Una Solicitud de Cambio pertenece a **1** Proyecto, mientras que un Proyecto puede tener **many** (muchas) Solicitudes de Cambio.

---

## 2. Diagrama en PlantUML

```plantuml
@startuml GestioCambios_Modelo_Dominio

' CONFIGURACION VISUAL SIN COLORES PERSONALIZADOS
skinparam defaultFontName Arial
skinparam defaultFontSize 12

class Proyecto {
  + id_proyecto : Número
  + nombre : Texto
  + descripcion : Texto
  + estado : Texto
  + fecha_inicio : Fecha
  + fecha_fin : Fecha
}

class Metodologia {
  + id_metodologia : Número
  + nombre : Texto
  + descripcion : Texto
}

class Etapa {
  + id_etapa : Número
  + nombre : Texto
  + orden : Número
}

class Fase {
  + id_fase : Número
  + nombre : Texto
  + orden : Número
}

class EntregableECM {
  + id_ecm : Número
  + nombre : Texto
  + tipo : Texto
}

class Usuario {
  + id_usuario : Número
  + nombre_completo : Texto
  + correo : Texto
  + rol_global : Texto
}

class MiembroEquipo {
  + rol_en_proyecto : Texto
}

class Actividad {
  + id_actividad : Número
  + nombre : Texto
  + descripcion : Texto
  + fecha_inicio : Fecha
  + fecha_fin : Fecha
  + porcentaje_avance : Porcentaje
  + estado : Texto
}

class SolicitudCambio {
  + ticket_id : Texto
  + titulo : Texto
  + descripcion : Texto
  + justificacion : Texto
  + tipo : Texto
  + prioridad : Texto
  + impacto : Texto
  + riesgo : Texto
  + estado_actual : Texto
  + version_afectada : Texto
  + fecha_creacion : Fecha
}

class HistorialEstado {
  + id_historial : Número
  + estado_anterior : Texto
  + estado_nuevo : Texto
  + fecha_hora : Fecha y Hora
  + comentario : Texto
  + usuario_nombre : Texto
  + usuario_rol : Texto
}

class EvidenciaGit {
  + id_evidencia : Número
  + nombre_rama : Texto
  + url_pull_request : Texto
  + comentario_tecnico : Texto
}

class ControlCalidad {
  + id_calidad : Número
  + total_pruebas : Número
  + casos_fallidos : Número
  + qa_estado : Texto
  + notas_tecnicas : Texto
  + fecha_ejecucion : Fecha y Hora
}

' Relaciones y Multiplicidades
Proyecto "1" *-- "many" Actividad : contiene
Proyecto "many" o-- "many" Usuario : asigna
(Proyecto, Usuario) .. MiembroEquipo

Proyecto "many" --> "1" Metodologia : utiliza
Metodologia "1" *-- "many" Etapa : estructurada en
Etapa "1" *-- "many" Fase : dividida en
Fase "1" *-- "many" EntregableECM : define

Actividad "many" --> "1" Fase : pertenece a
Actividad "many" --> "0..1" EntregableECM : entrega
Actividad "many" --> "0..1" SolicitudCambio : vincula a entregable
Actividad "many" --> "0..1" Usuario : asignada a (responsable)

SolicitudCambio "many" --> "1" Proyecto : pertenece a
SolicitudCambio "many" --> "1" Usuario : creada por (Solicitante)
SolicitudCambio "many" --> "0..1" Usuario : asignada a (Desarrollador)
SolicitudCambio "many" --> "0..1" Usuario : asignada a (Tester)

SolicitudCambio "1" *-- "many" HistorialEstado : genera
SolicitudCambio "1" -- "0..1" EvidenciaGit : tiene
SolicitudCambio "1" -- "0..1" ControlCalidad : tiene

@enduml
```

---

## 3. Descripcion de las Clases Conceptuales

* **Proyecto:** Representa el esfuerzo temporal con fecha de inicio y fin para implementar una metodologia de control de configuracion.
* **Metodologia:** El marco metodologico de gestion de software (Scrum/RUP) que define las fases y los entregables esperados del proyecto.
* **Etapa, Fase y EntregableECM:** Elementos jerarquicos que estructuran la metodologia. El Elemento de Configuracion (ECM) representa el tipo de entregable a generar (ej. codigo, documento, diagrama).
* **Usuario y MiembroEquipo:** Representa los actores registrados. Un usuario tiene un rol global, pero adquiere un rol especifico (MiembroEquipo) y privilegios cuando es asignado a un proyecto.
* **Actividad:** Tarea especifica del cronograma del proyecto, asociada a una fase de la metodologia, con fechas y un miembro responsable asignado.
* **SolicitudCambio (Ticket):** La solicitud formal de modificacion realizada por un cliente, la cual atraviesa el workflow SCM.
* **HistorialEstado:** Registro de auditoria inalterable que detalla cada cambio de estado del ticket, el actor responsable, la fecha/hora y la justificacion.
* **EvidenciaGit:** Informacion de trazabilidad del repositorio (rama y Pull/Merge Request) agregada por el desarrollador asignado al ticket.
* **ControlCalidad:** Informe de resultados del plan de pruebas tecnicas ejecutado y registrado por el Tester responsable del control de calidad.

