const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageBreak, LevelFormat, VerticalAlign
} = require('docx');
const fs = require('fs');

// ── Colores corporativos ──────────────────────────────────────────────────────
const C = {
  azulOscuro:  "1A2B4A",
  azulMedio:   "1E3A5F",
  azulClaro:   "2E5F8A",
  verdeUC:     "1B5E20",
  grisClaro:   "F2F4F7",
  grisHeader:  "D6DCE4",
  blanco:      "FFFFFF",
  negro:       "1A1A1A",
  naranja:     "C45911",
  rojo:        "C0392B",
  verde:       "27AE60",
};

// ── Helpers de celda ─────────────────────────────────────────────────────────
function cell(text, w, opts = {}) {
  const {
    bold = false, bg = C.blanco, color = C.negro,
    align = AlignmentType.LEFT, size = 20, italic = false,
    vAlign = VerticalAlign.CENTER
  } = opts;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: vAlign,
    borders: { top: border, bottom: border, left: border, right: border },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, size, font: "Arial", italics: italic })]
    })]
  });
}

function headerCell(text, w) {
  return cell(text, w, { bold: true, bg: C.azulOscuro, color: C.blanco, size: 20 });
}

function subHeaderCell(text, w) {
  return cell(text, w, { bold: true, bg: C.azulMedio, color: C.blanco, size: 20 });
}

function labelCell(text, w) {
  return cell(text, w, { bold: true, bg: C.grisHeader, color: C.azulOscuro, size: 20 });
}

function multiLineCell(lines, w, opts = {}) {
  const {
    bold = false, bg = C.blanco, color = C.negro,
    size = 20
  } = opts;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: { top: border, bottom: border, left: border, right: border },
    children: lines.map(l => new Paragraph({
      children: [new TextRun({ text: l.startsWith('• ') ? l : '• ' + l, bold, color, size, font: "Arial" })]
    }))
  });
}

// ── Tabla de especificación ───────────────────────────────────────────────────
function tablaEspecificacion(uc) {
  const TW = 9360;
  const L = 2200, R = TW - L;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };

  const rows = [
    new TableRow({ children: [
      new TableCell({
        columnSpan: 2,
        width: { size: TW, type: WidthType.DXA },
        shading: { fill: C.azulOscuro, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 200, right: 200 },
        borders: { top: border, bottom: border, left: border, right: border },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "ESPECIFICACIÓN DE CASO DE USO", bold: true, color: C.blanco, size: 24, font: "Arial" })]
        })]
      })
    ]}),
    new TableRow({ children: [labelCell("Id Caso de Uso", L), cell(uc.id, R)] }),
    new TableRow({ children: [labelCell("Nombre", L), cell(uc.nombre, R, { bold: true })] }),
    new TableRow({ children: [labelCell("Tipo", L), cell(uc.tipo, R)] }),
    new TableRow({ children: [labelCell("Requisito ID (RF)", L), cell(uc.rf, R)] }),
    new TableRow({ children: [labelCell("Versión", L), cell("1.0", R)] }),
    new TableRow({ children: [labelCell("Autor", L), cell("Diego Castillo / Sergio Colque", R)] }),
    new TableRow({ children: [labelCell("Actores", L), cell(uc.actores, R)] }),
    new TableRow({ children: [labelCell("Interacción", L), cell(uc.interaccion, R)] }),
    new TableRow({ children: [labelCell("Referencias", L), cell("Documentación GestioCambios G04 — UPT 2026", R)] }),
    new TableRow({ children: [labelCell("Reglas de Negocio", L), multiLineCell(uc.reglas, R)] }),
  ];

  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [L, R], rows });
}

// ── Tabla de descripción ─────────────────────────────────────────────────────
function tablaDescripcion(texto) {
  const TW = 9360;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
    rows: [
      new TableRow({ children: [
        new TableCell({
          width: { size: TW, type: WidthType.DXA },
          shading: { fill: C.azulOscuro, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 200, right: 200 },
          borders: { top: border, bottom: border, left: border, right: border },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "DESCRIPCIÓN", bold: true, color: C.blanco, size: 24, font: "Arial" })] })]
        })
      ]}),
      new TableRow({ children: [
        new TableCell({
          width: { size: TW, type: WidthType.DXA },
          shading: { fill: C.blanco, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          borders: { top: border, bottom: border, left: border, right: border },
          children: [new Paragraph({ children: [new TextRun({ text: texto, size: 20, font: "Arial" })] })]
        })
      ]}),
    ]
  });
}

// ── Tabla condiciones ────────────────────────────────────────────────────────
function tablaCondiciones(pre, post) {
  const TW = 9360;
  const L = 2200, R = TW - L;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [L, R],
    rows: [
      new TableRow({ children: [
        new TableCell({
          columnSpan: 2,
          width: { size: TW, type: WidthType.DXA },
          shading: { fill: C.azulOscuro, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 200, right: 200 },
          borders: { top: border, bottom: border, left: border, right: border },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CONDICIONES", bold: true, color: C.blanco, size: 24, font: "Arial" })] })]
        })
      ]}),
      new TableRow({ children: [
        labelCell("Precondiciones", L),
        multiLineCell(pre, R)
      ]}),
      new TableRow({ children: [
        labelCell("Postcondiciones", L),
        multiLineCell(post, R)
      ]}),
    ]
  });
}

// ── Tabla flujo normal ───────────────────────────────────────────────────────
function tablaFlujoNormal(pasos) {
  const TW = 9360;
  const C1 = 600, C2 = 4380, C3 = 4380;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };

  const rows = [
    new TableRow({ children: [
      new TableCell({
        columnSpan: 3, width: { size: TW, type: WidthType.DXA },
        shading: { fill: C.azulOscuro, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 200, right: 200 },
        borders: { top: border, bottom: border, left: border, right: border },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "FLUJO NORMAL DE EVENTOS", bold: true, color: C.blanco, size: 24, font: "Arial" })] })]
      })
    ]}),
    new TableRow({ children: [
      headerCell("Paso", C1),
      headerCell("Usuario", C2),
      headerCell("Sistema", C3),
    ]}),
    ...pasos.map((p, i) => new TableRow({
      children: [
        cell(String(i + 1), C1, { align: AlignmentType.CENTER, bold: true, bg: C.grisClaro }),
        cell(p.usuario || "", C2),
        cell(p.sistema || "", C3),
      ]
    }))
  ];

  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [C1, C2, C3], rows });
}

// ── Tabla flujos de excepción ────────────────────────────────────────────────
function tablaExcepciones(excepciones) {
  const TW = 9360;
  const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };

  const rows = [
    new TableRow({ children: [
      new TableCell({
        columnSpan: 2, width: { size: TW, type: WidthType.DXA },
        shading: { fill: C.azulOscuro, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 200, right: 200 },
        borders: { top: border, bottom: border, left: border, right: border },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "FLUJOS DE EXCEPCIÓN", bold: true, color: C.blanco, size: 24, font: "Arial" })] })]
      })
    ]})
  ];

  for (const exc of excepciones) {
    rows.push(new TableRow({ children: [
      new TableCell({
        columnSpan: 2, width: { size: TW, type: WidthType.DXA },
        shading: { fill: C.azulMedio, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        borders: { top: border, bottom: border, left: border, right: border },
        children: [new Paragraph({ children: [new TextRun({ text: exc.titulo, bold: true, color: C.blanco, size: 20, font: "Arial" })] })]
      })
    ]}));
    for (const paso of exc.pasos) {
      rows.push(new TableRow({ children: [
        cell(paso.id, 1200, { bold: true, bg: C.grisClaro }),
        cell(paso.desc, TW - 1200),
      ]}));
    }
  }

  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [1200, 8160], rows });
}

// ── Separador entre UCs ──────────────────────────────────────────────────────
function separador() {
  return new Paragraph({
    children: [new PageBreak()]
  });
}

function tituloUC(id, nombre) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [new TextRun({ text: `CASO DE USO ${id}`, bold: true, size: 32, font: "Arial", color: C.azulOscuro })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: nombre, bold: true, size: 28, font: "Arial", color: C.azulClaro })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [new TextRun({ text: "Sistema GestioCambios — Universidad Privada de Tacna", size: 20, font: "Arial", color: C.naranja, italics: true })]
    }),
  ];
}

function espaciado() {
  return new Paragraph({ spacing: { before: 160, after: 160 }, children: [new TextRun("")] });
}

// ════════════════════════════════════════════════════════════════════════════
// DATOS DE LOS 19 CASOS DE USO
// ════════════════════════════════════════════════════════════════════════════

const casos = [
  {
    id: "UC-001", nombre: "Iniciar Sesión", tipo: "Obligatorio", rf: "RF-01",
    actores: "Usuario General (todos los roles)",
    interaccion: "Acceso al sistema / Autenticación",
    reglas: [
      "RN-01: El correo debe estar registrado en la base de datos del sistema.",
      "RN-02: La contraseña se verifica contra el hash bcrypt almacenado.",
      "RN-03: La sesión dura 8 horas; al expirar el usuario es redirigido al login.",
      "RN-04: Si las credenciales son incorrectas el sistema muestra mensaje de error sin revelar cuál campo falló.",
    ],
    descripcion: "El usuario accede a la pantalla de autenticación del sistema GestioCambios. La interfaz muestra el logotipo de la aplicación (ícono de engranaje verde con el texto 'GestioCambios' en blanco y el subtítulo 'SISTEMA SCM · GRUPO G04'), un campo de texto con label 'Correo Electrónico' (placeholder 'ej. sergio@upt.pe'), un campo de contraseña con label 'Contraseña' (los caracteres se ocultan con puntos), y un botón verde grande con ícono de candado que dice 'Ingresar al Sistema'. Debajo existe un panel titulado 'Credenciales de demostración (contraseña: 123)' con ocho botones de acceso rápido organizados en dos columnas: '1. Solicitante — docente@upt.pe', '2. Director — director@upt.pe', '3. Gestor SCM — sergio@upt.pe', '4. Líder Técnico — diego@upt.pe', '5. Comité CCB — ccb@upt.pe', '6. Desarrollador — gregory@upt.pe', '7. Tester / QA — cesar@upt.pe' y '8. Administrador — admin@upt.pe'. Al hacer clic en cualquiera de esos botones, el sistema rellena automáticamente el campo de correo con la credencial correspondiente. El usuario luego hace clic en 'Ingresar al Sistema' y, si las credenciales son válidas, el sistema inicia sesión, crea la cookie de sesión y redirige al panel correspondiente según el rol del usuario.",
    pre: [
      "El sistema debe estar en línea y la base de datos accesible.",
      "El usuario debe tener una cuenta registrada en la tabla de usuarios.",
    ],
    post: [
      "El usuario queda autenticado con una sesión activa de 8 horas.",
      "El usuario es redirigido al Dashboard o panel correspondiente según su rol.",
      "La sesión queda registrada en el servidor mediante express-session.",
    ],
    flujo: [
      { usuario: "El usuario ingresa a la URL del sistema GestioCambios desde su navegador.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra la pantalla de login con el logotipo, el campo 'Correo Electrónico' (placeholder 'ej. sergio@upt.pe'), el campo 'Contraseña' con caracteres ocultos, el botón verde 'Ingresar al Sistema' y el panel de credenciales de demostración con los 8 botones de acceso rápido." },
      { usuario: "El usuario escribe su correo electrónico en el campo 'Correo Electrónico' o hace clic en uno de los 8 botones de acceso rápido del panel de demostración.", sistema: "" },
      { usuario: "", sistema: "Si el usuario hizo clic en un botón de acceso rápido, el sistema rellena automáticamente el campo 'Correo Electrónico' con el correo correspondiente al rol seleccionado." },
      { usuario: "El usuario escribe su contraseña en el campo 'Contraseña'.", sistema: "" },
      { usuario: "El usuario hace clic en el botón verde 'Ingresar al Sistema'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida que ambos campos no estén vacíos y envía el formulario al servidor mediante POST /auth/login." },
      { usuario: "", sistema: "El servidor verifica que el correo existe en la base de datos y compara la contraseña ingresada contra el hash bcrypt almacenado." },
      { usuario: "", sistema: "El sistema crea la sesión del usuario (express-session), almacena el ID, nombre, correo y rol en el objeto de sesión, y redirige al usuario al panel correspondiente: Administrador → /admin, resto de roles → /dashboard." },
    ],
    excepciones: [
      {
        titulo: "E001 — Credenciales incorrectas",
        pasos: [
          { id: "E001-1", desc: "El servidor no encuentra el correo en la base de datos o la contraseña no coincide con el hash bcrypt." },
          { id: "E001-2", desc: "El sistema muestra el mensaje de error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' en la pantalla de login sin indicar cuál campo es incorrecto." },
          { id: "E001-3", desc: "El flujo regresa al paso 3 del flujo normal, donde el usuario puede intentar nuevamente." },
        ]
      },
      {
        titulo: "E002 — Campos vacíos",
        pasos: [
          { id: "E002-1", desc: "El usuario hace clic en 'Ingresar al Sistema' sin completar uno o ambos campos." },
          { id: "E002-2", desc: "El navegador activa la validación HTML5 nativa indicando el campo requerido que falta." },
          { id: "E002-3", desc: "El sistema no envía el formulario al servidor. El flujo regresa al paso 3." },
        ]
      },
      {
        titulo: "E003 — Base de datos no disponible",
        pasos: [
          { id: "E003-1", desc: "El servidor no puede establecer conexión con MariaDB al intentar validar las credenciales." },
          { id: "E003-2", desc: "El sistema muestra la pantalla de error 500 con el mensaje 'Error interno del servidor. Intente más tarde.'" },
          { id: "E003-3", desc: "El usuario puede intentar nuevamente recargando la página." },
        ]
      },
    ]
  },
  {
    id: "UC-002", nombre: "Visualizar Dashboard", tipo: "Obligatorio", rf: "RF-09",
    actores: "Usuario General (todos los roles)",
    interaccion: "Panel principal personalizado por rol",
    reglas: [
      "RN-05: El dashboard muestra información filtrada según el rol del usuario autenticado.",
      "RN-06: La bandeja 'Mi Bandeja de Tareas' solo muestra tickets donde el usuario tiene acción pendiente según su rol.",
      "RN-07: Las métricas globales (Total Tickets, En Progreso, En QA/Pruebas, Liberados, Rechazados, Pendientes) son de solo lectura.",
    ],
    descripcion: "Cada rol del sistema tiene un Dashboard personalizado al que accede tras iniciar sesión. Todos comparten la misma estructura base: en la barra superior aparece el nombre del usuario autenticado y su rol resaltado en color (ej. 'Director' en verde, 'Administrador' en azul). En el sidebar izquierdo se muestra el avatar del usuario (iniciales en círculo de color), su nombre completo y rol; debajo aparecen los ítems de menú propios de cada rol. En la parte central superior hay 6 tarjetas de métricas con contadores: 'TOTAL DE TICKETS' (blanco), 'EN PROGRESO' (amarillo), 'EN QA / PRUEBAS' (rosado), 'LIBERADOS' (verde), 'RECHAZADOS' (rojo) y 'PENDIENTES' (morado). Bajo las métricas aparece el widget 'Mi Bandeja de Tareas' con un badge que indica la cantidad de tareas pendientes; cada ítem de la bandeja muestra el título del ticket, su ID (ej. TK-SC018), el estado actual y la prioridad (Menor / Mayor / Pendiente) en un badge de color a la derecha. A la derecha de la bandeja se muestra el gráfico de dona 'Distribución por Estado' con barras de colores por cada estado del workflow. En la parte inferior se muestra una tabla 'Tickets Recientes' con columnas: ID, TÍTULO, ESTADO, PRIORIDAD, TIPO y ACTUALIZADO. El Administrador tiene un dashboard diferente con gráfico de barras 'Avance por Proyecto', gráfico de dona 'Estados de las Solicitudes', tabla 'Proyectos — Avance' con botón 'Ver todos →' y tabla 'Usuarios del Sistema' con botón 'Gestionar →'.",
    pre: [
      "El usuario debe haber iniciado sesión correctamente.",
      "La sesión del usuario debe estar activa (no expirada).",
    ],
    post: [
      "El usuario visualiza su panel personalizado con métricas y bandeja de tareas actualizadas.",
      "El usuario puede navegar a cualquier sección habilitada para su rol desde el sidebar.",
    ],
    flujo: [
      { usuario: "El usuario inicia sesión exitosamente (UC-001).", sistema: "" },
      { usuario: "", sistema: "El sistema redirige al usuario a su dashboard correspondiente: /admin para el Administrador, /dashboard para el resto de roles." },
      { usuario: "", sistema: "El sistema consulta la base de datos y calcula las 6 métricas globales: Total Tickets, En Progreso, En QA/Pruebas, Liberados, Rechazados y Pendientes, y las renderiza en las tarjetas superiores." },
      { usuario: "", sistema: "El sistema ejecuta la lógica de WorkflowService para construir la 'Bandeja de Tareas' personalizada: solo incluye tickets donde el rol del usuario tiene una acción pendiente en el estado actual del ticket." },
      { usuario: "", sistema: "El sistema renderiza el gráfico de dona 'Distribución por Estado' con los contadores por cada uno de los 9 estados posibles del workflow." },
      { usuario: "", sistema: "El sistema renderiza la tabla 'Tickets Recientes' con los últimos tickets registrados en el sistema, mostrando ID, Título, Estado (badge de color), Prioridad, Tipo y fecha de actualización." },
      { usuario: "El usuario visualiza su dashboard, revisa las métricas, la bandeja de tareas pendientes y los tickets recientes.", sistema: "" },
      { usuario: "El usuario hace clic en cualquier ítem de la 'Bandeja de Tareas' para ir directamente al detalle del ticket.", sistema: "" },
      { usuario: "", sistema: "El sistema redirige al usuario a la vista de detalle del ticket seleccionado (UC-004)." },
    ],
    excepciones: [
      {
        titulo: "E001 — Sesión expirada",
        pasos: [
          { id: "E001-1", desc: "La sesión del usuario ha expirado (más de 8 horas de inactividad) al intentar acceder al dashboard." },
          { id: "E001-2", desc: "El middleware requireAuth detecta que no hay sesión activa y redirige al usuario a /login." },
        ]
      },
      {
        titulo: "E002 — Sin tareas pendientes (CCB)",
        pasos: [
          { id: "E002-1", desc: "El rol CCB no tiene tickets en estado 'Pendiente de Aprobación' asignados a su bandeja." },
          { id: "E002-2", desc: "El sistema muestra en la bandeja el mensaje 'Sin tareas pendientes para tu rol' con el badge '0 pendientes'." },
        ]
      },
    ]
  },
  {
    id: "UC-003", nombre: "Consultar Tickets", tipo: "Obligatorio", rf: "RF-10",
    actores: "Usuario General (todos los roles)",
    interaccion: "Listado y filtrado de solicitudes de cambio",
    reglas: [
      "RN-08: Todos los usuarios autenticados pueden consultar el listado completo de tickets del sistema.",
      "RN-09: Los filtros se aplican en el servidor; la búsqueda es case-insensitive.",
      "RN-10: Cada fila del listado es clickeable y lleva al detalle del ticket (UC-004).",
    ],
    descripcion: "La vista 'Todos los Tickets' (accesible desde el sidebar de cualquier rol mediante el ítem 'Todos los Tickets') presenta una tabla paginada con todas las solicitudes de cambio del sistema. En la parte superior de la vista hay controles de filtrado: un campo de búsqueda de texto libre, un selector desplegable de estado (Todos / Solicitado / En Análisis / Pendiente de Aprobación / Aprobado / En Desarrollo / En Pruebas QA / En Pruebas UAT / Listo para Integración / Liberado / Rechazado), un selector de tipo de cambio (Correctivo / Evolutivo / Adaptativo / Perfectivo) y un selector de prioridad (Menor / Mayor / Pendiente). La tabla tiene las columnas: ID (código TK-SCxxx), TÍTULO, ESTADO (badge de color correspondiente al estado), PRIORIDAD, TIPO y ACTUALIZADO (fecha). En el sidebar, ciertos roles tienen secciones de filtros rápidos por estado bajo la etiqueta 'MI BANDEJA': ítems como 'Solicitados', 'En Análisis', 'Para Aprobación', 'En Desarrollo', 'En Pruebas QA' que filtran automáticamente la lista al estado correspondiente.",
    pre: [
      "El usuario debe haber iniciado sesión correctamente.",
      "Deben existir tickets registrados en el sistema.",
    ],
    post: [
      "El usuario visualiza el listado de tickets filtrado según los criterios seleccionados.",
      "El usuario puede hacer clic en cualquier ticket para ver su detalle.",
    ],
    flujo: [
      { usuario: "El usuario hace clic en 'Todos los Tickets' en el sidebar o en un ítem de filtro rápido de 'MI BANDEJA'.", sistema: "" },
      { usuario: "", sistema: "El sistema realiza una consulta GET /tickets a la base de datos con los filtros aplicados (por defecto sin filtro) y renderiza la vista de listado." },
      { usuario: "", sistema: "El sistema muestra la tabla con las columnas ID, TÍTULO, ESTADO (badge de color), PRIORIDAD, TIPO y ACTUALIZADO con todos los tickets disponibles." },
      { usuario: "Opcionalmente el usuario escribe texto en el campo de búsqueda, selecciona un estado en el desplegable, o selecciona tipo/prioridad.", sistema: "" },
      { usuario: "", sistema: "El sistema aplica los filtros en el servidor y vuelve a renderizar la tabla mostrando únicamente los tickets que coinciden con todos los criterios seleccionados." },
      { usuario: "El usuario hace clic en una fila de la tabla para ver el detalle de un ticket.", sistema: "" },
      { usuario: "", sistema: "El sistema redirige al usuario a la vista de detalle del ticket seleccionado (UC-004)." },
    ],
    excepciones: [
      {
        titulo: "E001 — Sin resultados para los filtros aplicados",
        pasos: [
          { id: "E001-1", desc: "La combinación de filtros seleccionada no arroja ningún ticket en la base de datos." },
          { id: "E001-2", desc: "El sistema muestra la tabla vacía con el mensaje 'No se encontraron tickets con los filtros aplicados.' y el botón 'Limpiar filtros'." },
        ]
      },
    ]
  },
  {
    id: "UC-004", nombre: "Visualizar Detalle de Ticket", tipo: "Obligatorio", rf: "RF-08",
    actores: "Usuario General (todos los roles)",
    interaccion: "Vista completa del ciclo de vida de una solicitud de cambio",
    reglas: [
      "RN-11: El detalle del ticket es de solo lectura para roles que no tienen acción en el estado actual.",
      "RN-12: El stepper de ciclo de vida muestra visualmente el estado actual resaltado (paso activo en verde, pasos completados en azul, pasos futuros en gris).",
      "RN-13: El historial de estados es inmutable; solo el sistema puede agregar entradas.",
    ],
    descripcion: "La vista de detalle del ticket (accesible desde /tickets/:id) muestra la información completa de una solicitud de cambio. En la parte superior hay un breadcrumb '← Tickets / TK-SCxxx' que permite volver al listado. Inmediatamente debajo aparece el stepper de ciclo de vida con 9 pasos numerados: '1. Solicitado', '2. En Análisis', '3. Pendiente de Aprobación', '4. Aprobado', '5. En Desarrollo', '6. En Pruebas QA', '7. En Pruebas UAT', '8. Listo para Integración', '9. Liberado'. El paso activo está resaltado en verde con el número en círculo verde y el label en negrita; los pasos anteriores aparecen en azul, los futuros en gris. En la sección central izquierda 'Información del Cambio' se muestra: el badge del tipo de cambio (Adaptativo / Correctivo / Evolutivo / Perfectivo) en la esquina superior derecha, el título del ticket en grande y negrita, la descripción, y cuatro campos en fila: '⚡ Impacto' (Menor/Mayor/—), '⚠ Riesgo' (texto o —), '⏱ Estimación' (ej. 5 horas), '🔴 Creado' (fecha), '🔷 Actualizado' (fecha). Debajo está la sección 'Historial del Ciclo de Vida' con un badge indicando el número de eventos; cada evento muestra: un punto de color, el nombre del estado, el ícono y nombre del usuario responsable, la fecha y hora, y el comentario registrado (ej. 'Ticket creado.'). En la columna derecha aparece el panel 'Personas' con las etiquetas 'Solicitante' (nombre del usuario que creó el ticket) y 'Desarrollador Asignado' (nombre o 'Sin asignar'). Debajo hay un panel con el ícono de candado 🔒 que muestra el mensaje 'Tu rol (NombreRol) no puede ejecutar acciones en el estado actual.' cuando el rol del usuario no tiene transición disponible, o los botones de acción correspondientes cuando sí la tiene. En el panel 'Metadatos' se muestran: Estado (badge de color), Prioridad, Tipo, Estimación e Historial (número de eventos).",
    pre: [
      "El usuario debe haber iniciado sesión.",
      "El ticket referenciado por el ID debe existir en la base de datos.",
    ],
    post: [
      "El usuario visualiza toda la información del ticket incluyendo historial y metadatos.",
      "Si el rol del usuario tiene acción disponible, puede ejecutar la transición de estado.",
    ],
    flujo: [
      { usuario: "El usuario hace clic en un ticket desde el listado (UC-003), desde la bandeja del dashboard (UC-002) o accede directamente a la URL /tickets/:ticket_id.", sistema: "" },
      { usuario: "", sistema: "El sistema realiza la consulta SQL con la BASE_QUERY (JOINs a usuarios y proyectos) para obtener todos los datos del ticket e invoca WorkflowService para determinar las acciones disponibles para el rol del usuario autenticado." },
      { usuario: "", sistema: "El sistema renderiza el breadcrumb '← Tickets / TK-SCxxx', el stepper de 9 pasos con el estado actual resaltado, la sección 'Información del Cambio' con título, descripción, impacto, riesgo, estimación y fechas." },
      { usuario: "", sistema: "El sistema renderiza la sección 'Historial del Ciclo de Vida' con todos los eventos registrados en historial_estados, mostrando estado, usuario responsable, fecha/hora y comentario de cada transición." },
      { usuario: "", sistema: "El sistema renderiza el panel derecho 'Personas' con el nombre del Solicitante y del Desarrollador Asignado (o 'Sin asignar'), el panel de acciones (botones de transición o mensaje de candado 🔒) y el panel 'Metadatos' con Estado, Prioridad, Tipo, Estimación e Historial." },
      { usuario: "El usuario revisa la información completa del ticket.", sistema: "" },
      { usuario: "Si el usuario tiene una acción disponible, hace clic en el botón de transición correspondiente.", sistema: "" },
    ],
    excepciones: [
      {
        titulo: "E001 — Ticket no encontrado",
        pasos: [
          { id: "E001-1", desc: "El ID de ticket en la URL no corresponde a ningún registro en la base de datos." },
          { id: "E001-2", desc: "El sistema muestra la pantalla de error 404 con el mensaje 'Ticket no encontrado'." },
        ]
      },
    ]
  },
  {
    id: "UC-005", nombre: "Gestionar Usuarios (CRUD)", tipo: "Obligatorio", rf: "RF-02",
    actores: "Administrador",
    interaccion: "Panel Admin → Usuarios",
    reglas: [
      "RN-14: Solo el Administrador puede crear, editar y eliminar usuarios.",
      "RN-15: No pueden existir dos usuarios con el mismo correo electrónico.",
      "RN-16: La contraseña se hashea con bcrypt antes de almacenarse; nunca se guarda en texto plano.",
      "RN-17: No se puede eliminar un usuario que sea el único Administrador del sistema.",
    ],
    descripcion: "La vista 'Gestión de Usuarios' (accesible desde el sidebar del Administrador en el ítem 'Usuarios') muestra en la parte superior 4 tarjetas de métricas: 'TOTAL USUARIOS' (número en blanco), 'ADMINISTRADORES' (número en azul), 'DIRECTORES' (número en verde), 'DESARROLLADORES' (número en amarillo). En la esquina superior derecha hay un botón verde '+ Nuevo Usuario' y el badge de rol 'Administrador'. Debajo hay una sección 'Usuarios del Sistema' con un campo de búsqueda 'Buscar usuarios...' y una tabla con columnas: USUARIO (avatar circular con iniciales + nombre completo + ID), CORREO, ROL (badge de color) y ACCIONES (ícono de lápiz para editar + ícono de papelera para eliminar). Al hacer clic en '+ Nuevo Usuario' se abre un modal/formulario con campos: Nombre completo, Correo electrónico, Contraseña, y selector de Rol global. Al hacer clic en el lápiz de un usuario se abre el mismo formulario pre-llenado con los datos del usuario para editar. Al hacer clic en la papelera aparece una confirmación antes de eliminar.",
    pre: [
      "El usuario autenticado debe tener rol Administrador.",
      "La sesión del Administrador debe estar activa.",
    ],
    post: [
      "El nuevo usuario queda registrado en la tabla 'usuarios' con contraseña hasheada.",
      "Los cambios se reflejan inmediatamente en la tabla de la vista.",
      "El usuario eliminado pierde acceso al sistema.",
    ],
    flujo: [
      { usuario: "El Administrador hace clic en 'Usuarios' en el sidebar del panel de administración.", sistema: "" },
      { usuario: "", sistema: "El sistema realiza GET /admin/usuarios y renderiza la vista con las métricas de usuarios y la tabla completa de usuarios registrados." },
      { usuario: "El Administrador visualiza las tarjetas de métricas y la tabla con todos los usuarios, sus correos, roles y botones de acción.", sistema: "" },
      { usuario: "Para crear un usuario: el Administrador hace clic en el botón verde '+ Nuevo Usuario' en la esquina superior derecha.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario de creación con los campos: Nombre completo, Correo electrónico, Contraseña y selector desplegable de Rol global." },
      { usuario: "El Administrador completa todos los campos del formulario y hace clic en 'Guardar'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida que el correo no esté duplicado, hashea la contraseña con bcrypt, inserta el registro en la tabla 'usuarios' y actualiza la tabla en la vista con el nuevo usuario." },
      { usuario: "Para editar un usuario: el Administrador hace clic en el ícono de lápiz en la fila del usuario a modificar.", sistema: "" },
      { usuario: "", sistema: "El sistema pre-carga el formulario de edición con los datos actuales del usuario (nombre, correo, rol). El campo contraseña aparece vacío." },
      { usuario: "El Administrador modifica los campos deseados y hace clic en 'Guardar'.", sistema: "" },
      { usuario: "", sistema: "El sistema actualiza el registro vía PUT /api/usuarios/:id y refleja los cambios en la tabla." },
      { usuario: "Para eliminar un usuario: el Administrador hace clic en el ícono de papelera en la fila del usuario a eliminar.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra un diálogo de confirmación. Si el Administrador confirma, ejecuta DELETE /api/usuarios/:id y elimina el registro de la tabla." },
    ],
    excepciones: [
      {
        titulo: "E001 — Correo duplicado al crear/editar",
        pasos: [
          { id: "E001-1", desc: "El Administrador intenta guardar un usuario con un correo que ya existe en la base de datos." },
          { id: "E001-2", desc: "El sistema muestra el mensaje de error: 'El correo electrónico ya está registrado en el sistema.'" },
          { id: "E001-3", desc: "El formulario permanece abierto para que el Administrador corrija el correo." },
        ]
      },
      {
        titulo: "E002 — Intento de eliminar el único Administrador",
        pasos: [
          { id: "E002-1", desc: "El Administrador intenta eliminar al único usuario con rol Administrador." },
          { id: "E002-2", desc: "El sistema muestra el error: 'No se puede eliminar el único administrador del sistema.'" },
        ]
      },
    ]
  },
  {
    id: "UC-006", nombre: "Gestionar Metodologías (CRUD)", tipo: "Obligatorio", rf: "RF-02",
    actores: "Administrador",
    interaccion: "Panel Admin → Metodologías",
    reglas: [
      "RN-18: Solo el Administrador puede crear, editar y eliminar metodologías, etapas, fases y ECMs.",
      "RN-19: Una metodología no puede eliminarse si está asignada a un proyecto activo.",
      "RN-20: Cada ECM tiene un tipo: Documento, Diagrama, Código, Prueba u Otro.",
    ],
    descripcion: "La vista 'Metodologías de Trabajo' (accesible desde el sidebar del Administrador en el ítem 'Metodologías') muestra en la parte superior 3 tarjetas de métricas: 'METODOLOGÍAS' (cantidad total), 'TOTAL ETAPAS' y 'TOTAL FASES'. En la esquina superior derecha hay un botón '+ Nueva Metodología' y el badge 'Administrador'. El cuerpo de la vista presenta un acordeón visual jerárquico con las metodologías cargadas en el sistema. Para RUP se muestra el título 'RUP (Rational Unified Process)' con su descripción, los badges '4 etapas' y '4 fases', y los botones 'Editar', '+ Etapa' y eliminar. Las etapas (Iniciación, Elaboración, Construcción, Transición) se muestran numeradas con su cantidad de fases y los botones '+ Fase', editar, eliminar y desplegar. Al expandir una etapa se ven sus fases con su cantidad de ECM y el botón '+ ECM'. Al expandir una fase se ven sus ECMs como chips de colores mostrando el nombre y tipo. El botón '×' en cada chip ECM permite eliminarlo directamente.",
    pre: [
      "El usuario autenticado debe tener rol Administrador.",
    ],
    post: [
      "Los cambios en la jerarquía metodología/etapa/fase/ECM quedan persistidos en la base de datos.",
      "Los proyectos que usen la metodología reflejan los cambios en su tab 'Metodología'.",
    ],
    flujo: [
      { usuario: "El Administrador hace clic en 'Metodologías' en el sidebar.", sistema: "" },
      { usuario: "", sistema: "El sistema realiza GET /admin/metodologias y renderiza el árbol completo de metodologías con todas sus etapas, fases y ECMs en forma de acordeón." },
      { usuario: "El Administrador visualiza las tarjetas de métricas y el árbol de metodologías.", sistema: "" },
      { usuario: "Para crear una metodología: hace clic en '+ Nueva Metodología'.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra un formulario con campos Nombre y Descripción de la metodología." },
      { usuario: "Para agregar una etapa: hace clic en '+ Etapa' en la metodología deseada.", sistema: "" },
      { usuario: "", sistema: "El sistema agrega la nueva etapa a la metodología mediante POST /api/etapas y actualiza el acordeón." },
      { usuario: "Para agregar una fase: expande la etapa y hace clic en '+ Fase'.", sistema: "" },
      { usuario: "", sistema: "El sistema agrega la nueva fase a la etapa y actualiza el acordeón." },
      { usuario: "Para agregar un ECM: expande la fase y hace clic en '+ ECM'.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra un formulario con campos Nombre del ECM y selector de Tipo, guarda el ECM y lo muestra como chip en la fase." },
      { usuario: "Para eliminar un ECM: hace clic en el botón '×' del chip del ECM.", sistema: "" },
      { usuario: "", sistema: "El sistema elimina el ECM de la base de datos y lo quita del acordeón." },
    ],
    excepciones: [
      {
        titulo: "E001 — Eliminar metodología asignada a proyecto activo",
        pasos: [
          { id: "E001-1", desc: "El Administrador intenta eliminar una metodología que está asignada a uno o más proyectos activos." },
          { id: "E001-2", desc: "El sistema muestra el error: 'No se puede eliminar la metodología porque está asignada a proyectos activos.'" },
        ]
      },
    ]
  },
  {
    id: "UC-007", nombre: "Gestionar Proyectos (CRUD)", tipo: "Obligatorio", rf: "RF-02",
    actores: "Administrador",
    interaccion: "Panel Admin → Proyectos",
    reglas: [
      "RN-21: Solo el Administrador puede crear, editar y eliminar proyectos.",
      "RN-22: Un proyecto tiene los estados: Activo, Cerrado, Pausado.",
      "RN-23: Un proyecto debe tener asignada una metodología al crearse.",
      "RN-24: No se puede eliminar un proyecto que tenga tickets asociados.",
    ],
    descripcion: "La vista 'Gestión de Proyectos' (accesible desde el sidebar del Administrador en el ítem 'Proyectos') muestra en la parte superior 4 tarjetas de métricas: 'TOTAL PROYECTOS', 'ACTIVOS', 'CERRADOS' y 'PAUSADOS'. En la esquina superior derecha hay un botón verde '+ Nuevo Proyecto'. Debajo hay una barra de filtros con: campo 'Buscar proyecto...' (texto libre), desplegable 'Todos los estados' (Activo/Cerrado/Pausado), desplegable 'Todas las metodologías' (RUP/Scrum/etc.), botón 'Filtrar' y botón 'Limpiar'. Los proyectos se muestran en tarjetas en grilla horizontal. Cada card muestra: nombre del proyecto en negrita, badge de estado, ID y metodología, descripción breve, fechas de inicio y fin, y tres botones de acción: 'Configurar' (lleva a la vista de configuración del proyecto con 6 tabs), editar y eliminar. Al hacer clic en '+ Nuevo Proyecto' o en el lápiz se abre el formulario con campos: Nombre del proyecto, Descripción, selector de Metodología, selector de Estado, Fecha inicio y Fecha fin.",
    pre: [
      "El usuario autenticado debe tener rol Administrador.",
      "Deben existir metodologías registradas para asignar al proyecto.",
    ],
    post: [
      "El nuevo proyecto queda registrado en la tabla 'proyectos' y visible en el listado.",
      "El proyecto eliminado deja de aparecer en la cartera de sus miembros y clientes.",
    ],
    flujo: [
      { usuario: "El Administrador hace clic en 'Proyectos' en el sidebar.", sistema: "" },
      { usuario: "", sistema: "El sistema carga la vista de Gestión de Proyectos con las métricas, la barra de filtros y las tarjetas de todos los proyectos." },
      { usuario: "El Administrador visualiza las tarjetas de proyectos con su estado, metodología, fechas y botones de acción.", sistema: "" },
      { usuario: "Para crear un proyecto: hace clic en '+ Nuevo Proyecto'.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario con: campo 'Nombre del proyecto' (obligatorio), 'Descripción', selector 'Metodología', selector 'Estado', 'Fecha inicio' y 'Fecha fin'. Botones 'Cancelar' y 'Guardar'." },
      { usuario: "El Administrador completa el formulario y hace clic en 'Guardar'.", sistema: "" },
      { usuario: "", sistema: "El sistema ejecuta POST /api/proyectos, inserta el registro y muestra la nueva tarjeta de proyecto en el listado." },
      { usuario: "Para editar un proyecto: hace clic en el ícono de lápiz en la tarjeta del proyecto.", sistema: "" },
      { usuario: "", sistema: "El sistema pre-carga el formulario de edición con los datos actuales del proyecto." },
      { usuario: "El Administrador modifica los campos y hace clic en 'Guardar'.", sistema: "" },
      { usuario: "", sistema: "El sistema ejecuta PUT /api/proyectos/:id y actualiza la tarjeta en el listado." },
      { usuario: "Para eliminar un proyecto: hace clic en el ícono de papelera.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra confirmación. Si se confirma, ejecuta DELETE /api/proyectos/:id." },
      { usuario: "Para configurar un proyecto: hace clic en 'Configurar'.", sistema: "" },
      { usuario: "", sistema: "El sistema redirige a la vista de configuración del proyecto con 6 tabs: Información General, Equipo, Cronograma, Tickets, Metodología y Ranking." },
    ],
    excepciones: [
      {
        titulo: "E001 — Eliminar proyecto con tickets asociados",
        pasos: [
          { id: "E001-1", desc: "El Administrador intenta eliminar un proyecto que tiene tickets de cambio registrados." },
          { id: "E001-2", desc: "El sistema muestra el error: 'No se puede eliminar el proyecto porque tiene solicitudes de cambio asociadas.'" },
        ]
      },
    ]
  },
  {
    id: "UC-008", nombre: "Configurar Equipo y Clientes del Proyecto", tipo: "Obligatorio", rf: "RF-02",
    actores: "Administrador",
    interaccion: "Panel Admin → Proyectos → Configurar → Tab Equipo",
    reglas: [
      "RN-25: Un usuario puede tener un rol diferente en cada proyecto.",
      "RN-26: El rol en el proyecto determina las acciones que puede ejecutar sobre los tickets de ese proyecto.",
      "RN-27: Un mismo usuario no puede tener dos roles distintos en el mismo proyecto simultáneamente.",
    ],
    descripcion: "La vista de configuración del proyecto muestra en la parte superior 5 tarjetas de métricas: 'AVANCE GLOBAL', 'ACTIVIDADES', 'COMPLETADAS', 'EN PROGRESO' y 'BLOQUEADAS'. Debajo hay 6 tabs. En el tab 'Equipo' se muestra la tabla del equipo técnico del proyecto con columnas: avatar, nombre, rol en el proyecto y botón de eliminar. Hay un botón '+ Agregar Miembro' que abre un formulario con selector de usuario y selector de rol en el proyecto. También hay una sección para 'Clientes / Solicitantes' con la misma estructura y el botón '+ Agregar Cliente'. En la esquina superior derecha hay botones para volver y editar.",
    pre: [
      "El proyecto debe existir en el sistema.",
      "El usuario autenticado debe tener rol Administrador.",
      "Deben existir usuarios registrados para agregar al equipo.",
    ],
    post: [
      "Los miembros agregados al equipo tienen acceso al proyecto con su rol asignado.",
      "Los clientes/solicitantes pueden ver el proyecto en su 'Mi Cartera' y crear tickets para él.",
    ],
    flujo: [
      { usuario: "El Administrador hace clic en 'Configurar' en la tarjeta del proyecto.", sistema: "" },
      { usuario: "", sistema: "El sistema carga la vista de configuración con las 5 tarjetas de métricas y los 6 tabs." },
      { usuario: "El Administrador hace clic en el tab 'Equipo'.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra la tabla del equipo actual del proyecto y la sección de Clientes/Solicitantes." },
      { usuario: "Para agregar un miembro: el Administrador hace clic en '+ Agregar Miembro'.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario con selector de usuario y selector de rol en el proyecto." },
      { usuario: "El Administrador selecciona el usuario y su rol en el proyecto, y hace clic en 'Guardar'.", sistema: "" },
      { usuario: "", sistema: "El sistema ejecuta POST /api/proyectos/:id/equipo, inserta el registro y actualiza la tabla de equipo en la vista." },
      { usuario: "Para agregar un cliente: hace clic en '+ Agregar Cliente' en la sección inferior.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario con selector de cliente." },
      { usuario: "El Administrador selecciona el cliente y hace clic en 'Guardar'.", sistema: "" },
      { usuario: "", sistema: "El sistema ejecuta POST /api/proyectos/:id/clientes, asocia el cliente al proyecto y lo agrega a la tabla." },
      { usuario: "Para remover un miembro o cliente: hace clic en la papelera en la fila correspondiente y confirma.", sistema: "" },
      { usuario: "", sistema: "El sistema elimina la asociación y actualiza la tabla." },
    ],
    excepciones: [
      {
        titulo: "E001 — Agregar miembro duplicado",
        pasos: [
          { id: "E001-1", desc: "El Administrador intenta agregar a un usuario que ya forma parte del equipo del proyecto." },
          { id: "E001-2", desc: "El sistema muestra el error: 'El usuario ya forma parte del equipo de este proyecto.'" },
        ]
      },
    ]
  },
  {
    id: "UC-009", nombre: "Construir Cronograma (CRUD Actividades)", tipo: "Obligatorio", rf: "RF-14",
    actores: "Administrador",
    interaccion: "Panel Admin → Proyectos → Configurar → Tab Cronograma",
    reglas: [
      "RN-28: Solo el Administrador puede definir actividades en el cronograma base.",
      "RN-29: Cada actividad debe asociarse obligatoriamente a una fase de la metodología elegida.",
      "RN-30: Se puede asociar un entregable (ECM) de la fase y un responsable del equipo.",
    ],
    descripcion: "En el tab 'Cronograma' de la configuración del proyecto, el Administrador gestiona el listado de actividades del proyecto. Muestra una tabla con columnas: Actividad (Nombre y descripción), Fase, Inicio, Fin, Avance (barra de progreso), Estado, Entregable (ECM), Responsable y Acciones (editar/eliminar). En la esquina superior hay un botón '+ Nueva Actividad' que abre un modal con campos: Nombre, Descripción, selector de Fase, selector de Responsable, selector de Entregable (ECMs correspondientes a la fase elegida), Fecha de inicio, Fecha de fin y Estado inicial (por defecto 'Pendiente').",
    pre: [
      "El proyecto debe estar registrado y tener metodología asignada.",
      "El Administrador debe tener sesión activa.",
    ],
    post: [
      "La actividad queda guardada en la base de datos y se recalcula el avance global del proyecto.",
    ],
    flujo: [
      { usuario: "El Administrador hace clic en el tab 'Cronograma' en la configuración del proyecto.", sistema: "" },
      { usuario: "", sistema: "El sistema renderiza la tabla de actividades del proyecto ordenadas por fase." },
      { usuario: "El Administrador hace clic en '+ Nueva Actividad' en la esquina superior derecha.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el modal con los campos requeridos." },
      { usuario: "El Administrador completa el nombre, selecciona la fase, el miembro del equipo responsable, el ECM a entregar, las fechas y guarda.", sistema: "" },
      { usuario: "", sistema: "El sistema ejecuta POST /api/admin/proyectos/:id/cronograma, guarda la actividad y actualiza la tabla." },
      { usuario: "Para editar/eliminar: hace clic en los botones de acción respectivos en la fila de la actividad y completa la edición o confirma la eliminación.", sistema: "" },
      { usuario: "", sistema: "El sistema actualiza o elimina el registro mediante peticiones PUT/DELETE." },
    ],
    excepciones: [
      {
        titulo: "E001 — Rango de fechas inválido",
        pasos: [
          { id: "E001-1", desc: "El Administrador ingresa una fecha de fin anterior a la fecha de inicio." },
          { id: "E001-2", desc: "El sistema muestra el mensaje de error: 'La fecha de inicio no puede ser posterior a la fecha de fin.'" },
        ]
      },
    ]
  },
  {
    id: "UC-010", nombre: "Registrar Solicitud de Cambio", tipo: "Obligatorio", rf: "RF-03",
    actores: "Solicitante, Director, Gestor, Líder Técnico",
    interaccion: "Formulario de nueva solicitud",
    reglas: [
      "RN-31: El ticket nace con estado 'Solicitado'.",
      "RN-32: Se autogenera un código correlativo único (ej. TK-SC019).",
      "RN-33: Los campos título, descripción, tipo y prioridad son obligatorios.",
    ],
    descripcion: "La vista 'Nueva Solicitud' (accesible desde el sidebar en 'Nueva Solicitud' o en el botón del dashboard para roles con permisos) muestra un formulario estructurado. Contiene un campo 'Título del Cambio', una caja de texto 'Descripción detallada', una caja de 'Justificación técnica', selectores para 'Tipo de Cambio' y 'Prioridad', y un selector de 'Proyecto' (desplegable que muestra los proyectos en los que participa el usuario). Al hacer clic en 'Registrar Solicitud', el sistema valida e inserta el ticket.",
    pre: [
      "El usuario debe tener permisos en el proyecto para crear solicitudes.",
    ],
    post: [
      "La solicitud de cambio se guarda con estado 'Solicitado' y se genera una notificación para el administrador.",
    ],
    flujo: [
      { usuario: "El usuario hace clic en 'Nueva Solicitud' en el sidebar.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario de creación del ticket." },
      { usuario: "El usuario ingresa el título, descripción, justifica el cambio, elige el tipo, la prioridad, selecciona el proyecto de destino y hace clic en 'Registrar Solicitud'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida los campos en el servidor, realiza el INSERT en 'solicitudes_cambio' generando el ID correlativo, crea el primer historial de estado y redirige al detalle del nuevo ticket." },
    ],
    excepciones: [
      {
        titulo: "E001 — Proyecto no seleccionado",
        pasos: [
          { id: "E001-1", desc: "El usuario intenta registrar la solicitud sin elegir un proyecto del listado." },
          { id: "E001-2", desc: "El sistema valida que no se ha seleccionado proyecto y muestra un toast de advertencia." },
        ]
      },
    ]
  },
  {
    id: "UC-011", nombre: "Realizar Análisis de Impacto", tipo: "Obligatorio", rf: "RF-06",
    actores: "Líder Técnico, Gestor de Configuración",
    interaccion: "Bandeja de Tickets → Detalle de Ticket → Panel de Análisis",
    reglas: [
      "RN-34: Solo se puede realizar el análisis si el ticket está en estado 'En Análisis'.",
      "RN-35: Se deben especificar las horas estimadas, la versión propuesta, el impacto y riesgo.",
    ],
    descripcion: "El Líder Técnico accede al detalle de un ticket en estado 'En Análisis'. El panel de acciones de la derecha le muestra el formulario 'Realizar Análisis de Impacto'. El formulario tiene campos: 'Estimación de Horas' (numérico), 'Versión Afectada/Propuesta' (ej. v1.1.0), selectores de 'Impacto' (Menor/Mayor) y 'Riesgo' (Bajo/Medio/Alto), una caja de texto 'Comentario justificativo' y el botón de acción 'Enviar a Aprobación'.",
    pre: [
      "El ticket debe estar en estado 'En Análisis'.",
      "El usuario debe ser el Líder Técnico o Gestor del proyecto.",
    ],
    post: [
      "El ticket guarda el análisis técnico y se actualiza al estado 'Pendiente de Aprobación'.",
    ],
    flujo: [
      { usuario: "El Líder Técnico ingresa al detalle del ticket que se encuentra 'En Análisis'.", sistema: "" },
      { usuario: "", sistema: "El sistema renderiza el formulario de análisis en la columna derecha." },
      { usuario: "El Líder Técnico completa las horas, la versión, el impacto, el riesgo, escribe su justificación técnica y hace clic en 'Enviar a Aprobación'.", sistema: "" },
      { usuario: "", sistema: "El sistema procesa la solicitud mediante PUT /api/tickets/:id/estado, guarda el análisis de impacto, registra el evento en el historial de estados y cambia el estado del ticket a 'Pendiente de Aprobación'." },
    ],
    excepciones: [
      {
        titulo: "E001 — Datos de análisis incompletos",
        pasos: [
          { id: "E001-1", desc: "El usuario envía el análisis con el campo de horas vacío o menor a cero." },
          { id: "E001-2", desc: "El sistema muestra un toast de error indicando que los datos de estimación son requeridos." },
        ]
      },
    ]
  },
  {
    id: "UC-012", nombre: "Aprobar o Rechazar Solicitud", tipo: "Obligatorio", rf: "RF-04",
    actores: "Director, Comité de Control (CCB)",
    interaccion: "Detalle de Ticket → Panel de Decisiones",
    reglas: [
      "RN-36: El ticket debe estar en estado 'Pendiente de Aprobación'.",
      "RN-37: La aprobación requiere un comentario de justificación.",
    ],
    descripcion: "El Director o los miembros del CCB acceden a un ticket 'Pendiente de Aprobación'. En la columna derecha visualizan las opciones de aprobación. El panel muestra dos botones: 'Aprobar Cambio' (verde) y 'Rechazar Cambio' (rojo), junto a una caja de texto obligatoria para ingresar el comentario de la decisión.",
    pre: [
      "El ticket debe estar en 'Pendiente de Aprobación' y contener el análisis de impacto registrado.",
      "El usuario debe pertenecer al rol Director o CCB del proyecto.",
    ],
    post: [
      "El ticket cambia su estado a 'Aprobado' o 'Rechazado' según la opción elegida, guardando el acta/comentario de la decisión.",
    ],
    flujo: [
      { usuario: "El Director accede al detalle del ticket pendiente de aprobación.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario de decisión de aprobación/rechazo en el panel de acciones." },
      { usuario: "El Director ingresa el comentario con el sustento de la aprobación/rechazo y hace clic en 'Aprobar Cambio' (o 'Rechazar Cambio').", sistema: "" },
      { usuario: "", sistema: "El sistema valida la transición en WorkflowService, actualiza el estado del ticket a 'Aprobado' (o 'Rechazado'), añade el registro al historial de auditoría y recarga la página mostrando el nuevo estado." },
    ],
    excepciones: [
      {
        titulo: "E001 — Comentario obligatorio ausente",
        pasos: [
          { id: "E001-1", desc: "El usuario presiona Aprobar o Rechazar sin escribir un comentario de justificación." },
          { id: "E001-2", desc: "El sistema bloquea la transacción mostrando un mensaje toast indicando que el comentario es requerido." },
        ]
      },
    ]
  },
  {
    id: "UC-013", nombre: "Asignar Desarrollador y Tester", tipo: "Obligatorio", rf: "RF-05",
    actores: "Gestor de Configuración",
    interaccion: "Detalle del Ticket → Formulario de Asignación",
    reglas: [
      "RN-38: Solo se asigna personal técnico a tickets en estado 'Aprobado'.",
      "RN-39: Se debe seleccionar un Desarrollador y un Tester activos en el equipo del proyecto.",
    ],
    descripcion: "El Gestor de Configuración accede a un ticket en estado 'Aprobado'. En la columna derecha de acciones se habilita el formulario 'Asignación de Recursos'. Contiene un selector desplegable 'Seleccionar Desarrollador Asignado' (que lista los desarrolladores asignados al proyecto), un selector 'Seleccionar Tester' (que lista los testers asignados al proyecto), un campo de comentarios y el botón verde 'Iniciar Desarrollo'.",
    pre: [
      "El ticket debe estar en estado 'Aprobado'.",
      "El usuario debe ser el Gestor de Configuración del proyecto.",
    ],
    post: [
      "El ticket es asignado a los recursos técnicos seleccionados y transiciona al estado 'En Desarrollo'.",
    ],
    flujo: [
      { usuario: "El Gestor de Configuración abre el ticket aprobado.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra los selectores de Desarrollador y Tester del equipo del proyecto." },
      { usuario: "El Gestor elige un Desarrollador, un Tester de la lista desplegable, escribe indicaciones y hace clic en 'Iniciar Desarrollo'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida la existencia de los recursos, asocia sus IDs al ticket en la base de datos, registra el cambio de estado en el historial de auditoría y mueve el ticket a 'En Desarrollo'." },
    ],
    excepciones: [
      {
        titulo: "E001 — Recursos no seleccionados",
        pasos: [
          { id: "E001-1", desc: "El Gestor hace clic en Iniciar Desarrollo dejando los campos de asignación en blanco." },
          { id: "E001-2", desc: "El sistema muestra un mensaje de alerta solicitando la asignación obligatoria de ambos roles." },
        ]
      },
    ]
  },
  {
    id: "UC-014", nombre: "Registrar Evidencias Git", tipo: "Obligatorio", rf: "RF-06",
    actores: "Desarrollador Asignado",
    interaccion: "Detalle del Ticket → Registro de Trabajo Git",
    reglas: [
      "RN-40: El ticket debe estar en 'En Desarrollo'.",
      "RN-41: Solo el Desarrollador asignado al ticket puede registrar el avance y las evidencias.",
      "RN-42: Es obligatorio proveer el nombre de la rama Git y la URL del Pull/Merge Request.",
    ],
    descripcion: "El Desarrollador Asignado ingresa al detalle de su ticket asignado en estado 'En Desarrollo'. En la parte derecha tiene el formulario 'Registrar Evidencia de Código'. Contiene campos de texto para: 'Nombre de la Rama Git' (ej. feature/TK-SC018), 'URL del Pull / Merge Request' (ej. https://github.com/.../pull/15), una caja de 'Comentario Técnico' de la solución y el botón 'Enviar a Pruebas QA'.",
    pre: [
      "El ticket debe estar en 'En Desarrollo'.",
      "El usuario en sesión debe coincidir con el desarrollador asignado al ticket.",
    ],
    post: [
      "Se almacenan las referencias de Git en la tabla 'evidencia_git' y el ticket pasa a 'En Pruebas QA'.",
    ],
    flujo: [
      { usuario: "El Desarrollador ingresa al detalle de su ticket asignado en desarrollo.", sistema: "" },
      { usuario: "", sistema: "El sistema renderiza los campos para registrar las evidencias de Git." },
      { usuario: "El Desarrollador escribe el nombre de la rama de desarrollo, introduce la URL del Pull Request, describe la solución técnica y hace clic en 'Enviar a Pruebas QA'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida el formato de la URL del Pull Request, inserta la información de evidencias Git, guarda el cambio de estado en el historial de transiciones y actualiza el ticket a 'En Pruebas QA'." },
    ],
    excepciones: [
      {
        titulo: "E001 — Campos vacíos en evidencias",
        pasos: [
          { id: "E001-1", desc: "El desarrollador intenta promover el estado a pruebas omitiendo la rama o la URL del Pull Request." },
          { id: "E001-2", desc: "El sistema cancela el envío mostrando un toast indicando que las evidencias Git son obligatorias." },
        ]
      },
    ]
  },
  {
    id: "UC-015", nombre: "Registrar Pruebas QA", tipo: "Obligatorio", rf: "RF-07",
    actores: "Equipo QA / Tester",
    interaccion: "Detalle del Ticket → Formulario de Registro de Pruebas",
    reglas: [
      "RN-43: El ticket debe encontrarse en 'En Pruebas QA'.",
      "RN-44: Solo el Tester asignado al ticket puede registrar el resultado del plan de pruebas.",
    ],
    descripcion: "El Tester asignado abre el ticket 'En Pruebas QA'. En la barra derecha visualiza el panel 'Plan y Ejecución de Pruebas'. El formulario tiene los siguientes campos: 'Total Pruebas Ejecutadas' (numérico), 'Casos Fallidos' (numérico), 'Notas Técnicas de Calidad' y el selector de decisión 'Resultado QA' (Aprobado / Rechazado), junto con el botón 'Enviar Resultados'.",
    pre: [
      "El ticket debe estar en 'En Pruebas QA'.",
      "El usuario debe ser el Tester asignado al ticket.",
    ],
    post: [
      "Se guardan los resultados de la prueba. Si es aprobado, pasa a 'En Pruebas UAT'; si es rechazado, regresa a 'En Desarrollo'.",
    ],
    flujo: [
      { usuario: "El Tester ingresa al detalle de su ticket asignado en pruebas QA.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el formulario de registro de control de calidad." },
      { usuario: "El Tester escribe el total de pruebas corridas, el número de fallas encontradas, detalla las observaciones en las notas de calidad, selecciona el resultado (Aprobado o Rechazado) y hace clic en 'Enviar Resultados'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida los números, guarda el registro de control de calidad en la base de datos y promueve el ticket según la decisión: si aprobó, a 'En Pruebas UAT'; si rechazó, regresa el ticket a 'En Desarrollo' para correcciones." },
    ],
    excepciones: [
      {
        titulo: "E001 — Inconsistencia en conteo de pruebas",
        pasos: [
          { id: "E001-1", desc: "El Tester ingresa un número de casos fallidos mayor al total de pruebas ejecutadas." },
          { id: "E001-2", desc: "El sistema rechaza la operación e indica que el número de fallas no puede superar el total de casos." },
        ]
      },
    ]
  },
  {
    id: "UC-016", nombre: "Validar en ambiente UAT", tipo: "Obligatorio", rf: "RF-08",
    actores: "Solicitante",
    interaccion: "Detalle del Ticket → Panel de Conformidad Cliente",
    reglas: [
      "RN-45: El ticket debe estar en estado 'En Pruebas UAT'.",
      "RN-46: El Solicitante (dueño del requerimiento) debe validar el cambio y otorgar conformidad.",
    ],
    descripcion: "El Solicitante que creó originalmente la solicitud de cambio accede al ticket en estado 'En Pruebas UAT'. En el panel lateral derecho ve las opciones de conformidad del cliente: botón verde 'Dar Conformidad (Listo para Integración)' y botón rojo 'Rechazar Conformidad (Retornar a Desarrollo)', con una caja para comentarios.",
    pre: [
      "El ticket debe encontrarse en 'En Pruebas UAT'.",
      "El usuario en sesión debe ser el Solicitante (dueño) de dicho ticket.",
    ],
    post: [
      "Si el cliente da conformidad, el ticket pasa a 'Listo para Integración'. Si rechaza, retorna a 'En Desarrollo'.",
    ],
    flujo: [
      { usuario: "El Solicitante ingresa al detalle de su ticket en ambiente de pruebas de usuario.", sistema: "" },
      { usuario: "", sistema: "El sistema renderiza los botones de conformidad del cliente y la caja de comentarios." },
      { usuario: "El Solicitante prueba la funcionalidad, escribe un comentario descriptivo y presiona 'Dar Conformidad' (o 'Rechazar Conformidad').", sistema: "" },
      { usuario: "", sistema: "El sistema valida la identidad del solicitante, registra la conformidad o retorno, actualiza el historial de auditoría y mueve el ticket a 'Listo para Integración' (o regresa a 'En Desarrollo' en caso de rechazo)." },
    ],
    excepciones: [
      {
        titulo: "E001 — Usuario no autorizado para UAT",
        pasos: [
          { id: "E001-1", desc: "Un usuario que pertenece al equipo de desarrollo intenta dar conformidad UAT en lugar del solicitante." },
          { id: "E001-2", desc: "El sistema bloquea la acción mostrando el panel con candado e indicando que el rol no está autorizado para validar." },
        ]
      },
    ]
  },
  {
    id: "UC-017", nombre: "Integrar y Liberar Cambio", tipo: "Obligatorio", rf: "RF-09",
    actores: "Gestor de Configuración",
    interaccion: "Detalle del Ticket → Panel de Liberación",
    reglas: [
      "RN-47: El ticket debe estar en estado 'Listo para Integración'.",
      "RN-48: Se debe registrar obligatoriamente la etiqueta de versión final liberada (tag de release).",
    ],
    descripcion: "El Gestor de Configuración ingresa a un ticket en estado 'Listo para Integración'. En la parte derecha ve el panel 'Liberación e Integración de Código'. El formulario requiere: 'Tag de Versión de Producción' (ej. v1.2.0), un campo para comentarios de la liberación y el botón de acción 'Liberar y Cerrar Ticket'.",
    pre: [
      "El ticket debe estar en 'Listo para Integración'.",
      "El usuario debe ser el Gestor de Configuración asignado en el proyecto.",
    ],
    post: [
      "El ticket de cambio pasa a estado 'Liberado' (estado final exitoso), cerrándose la trazabilidad.",
    ],
    flujo: [
      { usuario: "El Gestor de Configuración accede al ticket listo para integración.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra las opciones para registrar el tag de versión y liberar el ticket." },
      { usuario: "El Gestor realiza el merge en el repositorio físico, escribe la versión de producción en el formulario, añade notas de release y hace clic en 'Liberar y Cerrar Ticket'.", sistema: "" },
      { usuario: "", sistema: "El sistema registra la versión final del ticket en la base de datos, guarda el cambio de estado en el historial de transiciones, marca el ticket como 'Liberado' y finaliza el flujo." },
    ],
    excepciones: [
      {
        titulo: "E001 — Formato de tag de versión incorrecto",
        pasos: [
          { id: "E001-1", desc: "El Gestor de Configuración ingresa un tag de versión vacío o en un formato no soportado." },
          { id: "E001-2", desc: "El sistema valida que no esté vacío y muestra un mensaje toast en caso de error." },
        ]
      },
    ]
  },
  {
    id: "UC-018", nombre: "Actualizar Avance de Actividad", tipo: "Obligatorio", rf: "RF-14",
    actores: "Desarrollador Asignado, Líder Técnico, Gestor",
    interaccion: "Detalle de Proyecto → Tab Cronograma → Modal Editar Avance",
    reglas: [
      "RN-49: El usuario debe pertenecer al equipo del proyecto y estar asignado a la actividad o tener rol de gestión.",
      "RN-50: El porcentaje de avance debe encontrarse en el rango de 0% a 100%.",
    ],
    descripcion: "En la vista detalle del proyecto, dentro del tab 'Cronograma', los miembros del equipo que tienen actividades asignadas hacen clic en el botón 'Editar Avance' de la fila correspondiente. Se abre un modal titulado 'Reportar Avance - NombreActividad'. Tiene los campos: 'Porcentaje de Avance' (numérico de 0 a 100), selector de 'Estado' (Pendiente / En Progreso / Completado / Bloqueado), una caja para observaciones/bitácora del avance y el botón 'Guardar Avance'.",
    pre: [
      "La actividad debe existir en el cronograma del proyecto.",
      "El usuario en sesión debe estar autorizado en el equipo del proyecto.",
    ],
    post: [
      "El porcentaje de avance y el estado de la actividad se actualizan en base de datos. Se recalcula el porcentaje promedio del proyecto automáticamente.",
    ],
    flujo: [
      { usuario: "El desarrollador abre el tab 'Cronograma' del proyecto y hace clic en 'Editar Avance' de su actividad asignada.", sistema: "" },
      { usuario: "", sistema: "El sistema muestra el modal con el porcentaje actual, estado y caja de observaciones." },
      { usuario: "El usuario modifica el avance (ej. de 50% a 80%), cambia el estado a 'En Progreso', escribe sus observaciones del día y hace clic en 'Guardar Avance'.", sistema: "" },
      { usuario: "", sistema: "El sistema valida los datos en el servidor, actualiza el registro en 'cronograma_actividades', inserta una bitácora en la tabla de reportes históricos, recalcula el avance global y recarga los componentes." },
    ],
    excepciones: [
      {
        titulo: "E001 — Porcentaje de avance fuera de rango",
        pasos: [
          { id: "E001-1", desc: "El usuario escribe un porcentaje de avance mayor a 100 o menor a 0." },
          { id: "E001-2", desc: "El sistema rechaza la solicitud en el servidor y muestra un mensaje de error: 'El porcentaje debe estar entre 0 y 100.'" },
        ]
      },
    ]
  },
  {
    id: "UC-019", nombre: "Visualizar Avance y Reportes del Proyecto", tipo: "Obligatorio", rf: "RF-14",
    actores: "Usuario General (según rol y pertenencia al proyecto)",
    interaccion: "Detalle de Proyecto → Pestaña Ranking / Reportes de Avance",
    reglas: [
      "RN-51: Los reportes de avance consolidados y gráficos son de solo lectura.",
      "RN-52: El ranking de rendimiento se calcula sumando el porcentaje de avance de las actividades completadas por cada miembro del equipo.",
    ],
    descripcion: "Cualquier miembro del proyecto o administrador puede acceder a la pestaña 'Ranking' o hacer clic en 'Reportes' en la barra lateral del proyecto. La pestaña de ranking muestra una lista ordenada de rendimiento de los miembros con medallas de oro, plata y bronce según sus tareas completadas. El panel de reportes de avance histórico muestra un listado secuencial de todos los avances reportados por fecha, responsable, avance previo y nuevo avance, junto con gráficos interactivos del porcentaje de actividades completadas por fase.",
    pre: [
      "El proyecto debe contar con un equipo técnico y actividades asignadas en su cronograma.",
    ],
    post: [
      "El usuario visualiza de forma estructurada los indicadores de progreso del proyecto.",
    ],
    flujo: [
      { usuario: "El usuario abre la vista del proyecto y hace clic en la pestaña 'Ranking' o en el botón de reportes.", sistema: "" },
      { usuario: "", sistema: "El sistema ejecuta las consultas en la base de datos para obtener el promedio de avance, el ranking de rendimiento de los miembros y la bitácora de reportes." },
      { usuario: "", sistema: "El sistema calcula el puntaje de avance de cada integrante del equipo técnico basándose en las actividades terminadas en las que es responsable y le asigna una posición en la tabla de ranking." },
      { usuario: "", sistema: "El sistema renderiza los componentes visuales: medallas (Oro, Plata, Bronce) en el ranking, lista histórica de reportes detallada y gráficos de barras de progreso por fases del cronograma." },
      { usuario: "El usuario revisa los indicadores de desempeño y avance del equipo.", sistema: "" },
    ],
    excepciones: [
      {
        titulo: "E001 — Sin actividades asignadas para ranking",
        pasos: [
          { id: "E001-1", desc: "El proyecto no cuenta con ninguna actividad en su cronograma asignada a miembros del equipo." },
          { id: "E001-2", desc: "El sistema renderiza la pestaña de ranking vacía con un mensaje: 'No hay actividades registradas para mostrar el ranking de rendimiento.'" },
        ]
      },
    ]
  }
];

const children = [];
for (let i = 0; i < casos.length; i++) {
  const uc = casos[i];
  children.push(...tituloUC(uc.id, uc.nombre));
  children.push(tablaEspecificacion(uc));
  children.push(espaciado());
  children.push(tablaDescripcion(uc.descripcion));
  children.push(espaciado());
  children.push(tablaCondiciones(uc.pre, uc.post));
  children.push(espaciado());
  children.push(tablaFlujoNormal(uc.flujo));
  children.push(espaciado());
  if (uc.excepciones && uc.excepciones.length > 0) {
    children.push(tablaExcepciones(uc.excepciones));
  }
  if (i < casos.length - 1) {
    children.push(separador());
  }
}

const doc = new Document({
  sections: [{
    properties: {},
    children: children
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("documentos/especificacion_casos_uso.docx", buffer);
  console.log("Documento generado exitosamente en documentos/especificacion_casos_uso.docx");
}).catch(err => {
  console.error("Error al generar el documento:", err);
});
