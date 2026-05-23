/**
 * controllers/changeController.js — Lógica de negocio con MySQL
 * Todas las operaciones CRUD sobre solicitudes_cambio y tablas relacionadas.
 */

'use strict';

const { query, ROLES, ESTADOS, TIPOS_CAMBIO, IMPACTOS } = require('../config/db');

// ─── ASYNC WRAPPER ────────────────────────────────────────────────────────────
const asyncH = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─── META DE ESTADOS (UI) ─────────────────────────────────────────────────────
const estadoMeta = {
  'Solicitado':              { badge: 'badge-slate',  icon: '📋', color: 'var(--slate)' },
  'En Análisis':             { badge: 'badge-orange', icon: '🔍', color: 'var(--orange)' },
  'Pendiente de Aprobación': { badge: 'badge-blue',   icon: '⏳', color: 'var(--blue)' },
  'Aprobado':                { badge: 'badge-teal',   icon: '✅', color: 'var(--teal)' },
  'En Desarrollo':           { badge: 'badge-yellow', icon: '💻', color: 'var(--yellow)' },
  'En Pruebas QA':           { badge: 'badge-pink',   icon: '🧪', color: 'var(--pink)' },
  'En Pruebas UAT':          { badge: 'badge-purple', icon: '👥', color: 'var(--purple)' },
  'Listo para Integración':  { badge: 'badge-blue',   icon: '🔗', color: 'var(--blue)' },
  'Liberado':                { badge: 'badge-green',  icon: '🚀', color: 'var(--accent)' },
  'Rechazado':               { badge: 'badge-red',    icon: '❌', color: 'var(--red)' },
  'Descartado':              { badge: 'badge-slate',  icon: '🗑️', color: 'var(--slate)' },
};

// Pasos del flujo para el Stepper
const flujoEstados = [
  'Solicitado', 'En Análisis', 'Pendiente de Aprobación',
  'Aprobado', 'En Desarrollo', 'En Pruebas QA', 'En Pruebas UAT',
  'Listo para Integración', 'Liberado',
];

// ─── MÁQUINA DE TRANSICIONES ──────────────────────────────────────────────────
const transiciones = {
  'Solicitado': {
    'En Análisis': [ROLES.GESTOR_CONFIGURACION, ROLES.LIDER_TECNICO, ROLES.DIRECTOR],
    'Rechazado':   [ROLES.GESTOR_CONFIGURACION, ROLES.DIRECTOR],
    'Descartado':  [ROLES.GESTOR_CONFIGURACION],
  },
  'En Análisis': {
    'Pendiente de Aprobación': [ROLES.LIDER_TECNICO, ROLES.GESTOR_CONFIGURACION],
    'Rechazado':               [ROLES.LIDER_TECNICO, ROLES.DIRECTOR],
  },
  'Pendiente de Aprobación': {
    'Aprobado':   [ROLES.DIRECTOR, ROLES.CCB],
    'Rechazado':  [ROLES.DIRECTOR, ROLES.CCB],
    'Descartado': [ROLES.DIRECTOR],
  },
  'Aprobado': {
    'En Desarrollo': [ROLES.GESTOR_CONFIGURACION, ROLES.DESARROLLADOR],
  },
  'En Desarrollo': {
    'En Pruebas QA': [ROLES.DESARROLLADOR, ROLES.LIDER_TECNICO],
    'En Análisis':   [ROLES.LIDER_TECNICO],
  },
  'En Pruebas QA': {
    'En Pruebas UAT':          [ROLES.TESTER, ROLES.LIDER_TECNICO],
    'En Desarrollo':           [ROLES.TESTER],
    'Listo para Integración':  [ROLES.TESTER, ROLES.LIDER_TECNICO],
  },
  'En Pruebas UAT': {
    'Listo para Integración': [ROLES.TESTER, ROLES.LIDER_TECNICO],
    'En Desarrollo':          [ROLES.TESTER],
  },
  'Listo para Integración': {
    'Liberado':      [ROLES.GESTOR_CONFIGURACION],
    'En Desarrollo': [ROLES.GESTOR_CONFIGURACION],
  },
};

// ─── QUERY BASE DE TICKETS ────────────────────────────────────────────────────
const BASE_QUERY = `
  SELECT
    sc.id_sc,
    sc.ticket_id          AS id,
    sc.titulo,
    sc.descripcion,
    sc.justificacion_tecnica AS justificacion,
    sc.tipo_cambio        AS tipo,
    sc.impacto            AS prioridad,
    sc.estado_actual      AS estado,
    sc.horas_hombre_estimadas AS estimacionHoras,
    sc.version_tag,
    sc.id_solicitante,
    sc.id_desarrollador   AS asignadoId,
    sc.id_tester          AS testerId,
    sc.fecha_registro     AS fechaCreacion,
    sc.fecha_ultima_modificacion AS fechaActualizacion,
    u_sol.nombre_completo AS solicitanteNombre,
    u_sol.correo          AS solicitanteCorreo,
    u_dev.nombre_completo AS asignadoNombre,
    u_test.nombre_completo AS testerNombre
  FROM  solicitudes_cambio sc
  LEFT JOIN usuarios u_sol  ON sc.id_solicitante    = u_sol.id_usuario
  LEFT JOIN usuarios u_dev  ON sc.id_desarrollador  = u_dev.id_usuario
  LEFT JOIN usuarios u_test ON sc.id_tester         = u_test.id_usuario
`;

// Helper: filtra tickets según el rol
function filtrarPorRol(tickets, user) {
  const { rol, id } = user;
  switch (rol) {
    case ROLES.SOLICITANTE:
      return tickets.filter(t => t.id_solicitante === id);
    case ROLES.DESARROLLADOR:
      return tickets.filter(t => t.asignadoId === id || t.estado === 'En Desarrollo');
    case ROLES.TESTER:
      return tickets.filter(t =>
        ['En Pruebas QA', 'En Pruebas UAT', 'Listo para Integración'].includes(t.estado)
      );
    default:
      return tickets; // Gestor, Director, CCB, Líder ven todos
  }
}

// Helper: tickets pendientes para la bandeja del usuario
function filtrarBandeja(tickets, user) {
  const { rol } = user;
  const mapa = {
    [ROLES.GESTOR_CONFIGURACION]:  ['Solicitado', 'En Análisis', 'Listo para Integración'],
    [ROLES.DIRECTOR]:              ['Solicitado', 'Pendiente de Aprobación'],
    [ROLES.CCB]:                   ['Pendiente de Aprobación'],
    [ROLES.LIDER_TECNICO]:         ['En Análisis', 'En Desarrollo', 'En Pruebas QA'],
    [ROLES.DESARROLLADOR]:         ['Aprobado', 'En Desarrollo'],
    [ROLES.TESTER]:                ['En Pruebas QA', 'En Pruebas UAT'],
    [ROLES.SOLICITANTE]:           ['Solicitado'],
  };
  const estados = mapa[rol] || [];
  return tickets.filter(t => estados.includes(t.estado));
}

// ─── CÁLCULO DE ESTADÍSTICAS ──────────────────────────────────────────────────
function calcularStats(tickets) {
  const stats = {
    total: tickets.length,
    porEstado: {},
    porImpacto: {},
  };
  ESTADOS.forEach(e => (stats.porEstado[e] = 0));
  IMPACTOS.forEach(i => (stats.porImpacto[i] = 0));
  tickets.forEach(t => {
    if (stats.porEstado[t.estado] !== undefined) stats.porEstado[t.estado]++;
    if (stats.porImpacto[t.prioridad] !== undefined) stats.porImpacto[t.prioridad]++;
  });
  return stats;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
exports.dashboard = asyncH(async (req, res) => {
  const user    = req.session.user;
  const tickets = await query(BASE_QUERY);
  const visibles = filtrarPorRol(tickets, user);
  const stats    = calcularStats(visibles);
  const bandeja  = filtrarBandeja(visibles, user);

  res.render('dashboard', {
    user, roles: ROLES,
    tickets: visibles,
    stats, bandeja,
    estadoMeta,
    title: 'Dashboard',
  });
});

// ─── LISTADO DE TICKETS ───────────────────────────────────────────────────────
exports.listarTickets = asyncH(async (req, res) => {
  const user    = req.session.user;
  const tickets = await query(BASE_QUERY + ' ORDER BY sc.fecha_ultima_modificacion DESC');
  const visibles = filtrarPorRol(tickets, user);

  res.render('tickets', {
    user, roles: ROLES,
    tickets: visibles,
    estadoMeta,
    tiposCambio: TIPOS_CAMBIO,
    estados: ESTADOS,
    prioridades: IMPACTOS,
    filtros: req.query || {},
    title: 'Todos los Tickets',
  });
});

// ─── DETALLE DE TICKET ────────────────────────────────────────────────────────
exports.mostrarTicket = asyncH(async (req, res) => {
  const user = req.session.user;
  const { id } = req.params;

  // Ticket principal
  const rows = await query(BASE_QUERY + ' WHERE sc.ticket_id = ?', [id]);
  if (rows.length === 0) {
    return res.status(404).render('error', {
      title: '404 — Ticket no encontrado', message: `No existe el ticket ${id}.`, user, roles: ROLES,
    });
  }
  const ticket = rows[0];

  // Archivos afectados (ECS)
  const ecsAfectados = await query(
    'SELECT ruta_archivo FROM ecs_afectados WHERE id_sc = ?', [ticket.id_sc]
  );
  ticket.archivosAfectados = ecsAfectados.map(r => r.ruta_archivo);

  // Evidencias Git
  const gitRows = await query(
    'SELECT * FROM evidencias_git WHERE id_sc = ?', [ticket.id_sc]
  );
  const git = gitRows[0] || null;
  ticket.rama        = git ? git.nombre_rama : null;
  ticket.mergeRequest= git ? git.url_pull_request : null;
  ticket.comentarioTecnico = git ? git.comentario_tecnico : null;

  // Control de calidad
  const qaRows = await query(
    'SELECT * FROM control_calidad WHERE id_sc = ?', [ticket.id_sc]
  );
  const qa = qaRows[0] || null;
  ticket.qaResultados = qa ? {
    qa_estado:       qa.qa_estado,
    qa_evidencia:    qa.qa_evidencia_url,
    qa_observaciones:qa.qa_observaciones,
    uat_estado:      qa.uat_estado,
    uat_observaciones:qa.uat_observaciones,
  } : null;

  // Historial de estados
  const histRows = await query(
    'SELECT * FROM historial_estados WHERE id_sc = ? ORDER BY fecha_cambio ASC',
    [ticket.id_sc]
  );
  ticket.historial = histRows.map(h => ({
    estado:    h.estado_nuevo,
    anterior:  h.estado_anterior,
    fecha:     h.fecha_cambio,
    usuario:   h.usuario_nombre,
    rol:       h.usuario_rol,
    comentario:h.comentario,
  }));

  // Transiciones disponibles para este usuario en este estado
  const transicionesEstado = transiciones[ticket.estado] || {};
  const transicionesDisponibles = [];
  const transicionesPermitidas = {};
  Object.entries(transicionesEstado).forEach(([nuevoEstado, rolesPermitidos]) => {
    if (rolesPermitidos.includes(user.rol)) {
      transicionesPermitidas[nuevoEstado] = true;
      transicionesDisponibles.push(nuevoEstado);
    }
  });

  // Determinar si es estado terminal
  const isTerminal = ['Liberado', 'Rechazado', 'Descartado'].includes(ticket.estado);

  // Lista de desarrolladores y testers para asignar
  const desarrolladores = await query(
    "SELECT id_usuario, nombre_completo FROM usuarios WHERE id_rol IN (SELECT id_rol FROM roles WHERE nombre_rol IN ('Desarrollador Asignado', 'Líder Técnico'))"
  );
  const testers = await query(
    "SELECT id_usuario, nombre_completo FROM usuarios WHERE id_rol IN (SELECT id_rol FROM roles WHERE nombre_rol = 'Equipo QA / Tester')"
  );

  res.render('ticket-detail', {
    user, roles: ROLES,
    ticket,
    transicionesPermitidas,
    transicionesDisponibles,
    isTerminal,
    estadoMeta,
    flujoEstados,
    desarrolladores,
    testers,
    title: `${ticket.id} — ${ticket.titulo}`,
  });
});

// ─── NUEVO TICKET (FORM) ──────────────────────────────────────────────────────
exports.mostrarNuevoTicket = asyncH(async (req, res) => {
  res.render('nuevo-ticket', {
    user: req.session.user,
    roles: ROLES,
    tiposCambio: TIPOS_CAMBIO,
    prioridades: IMPACTOS,
    error: null,
    title: 'Nueva Solicitud de Cambio',
  });
});

// ─── CREAR TICKET ─────────────────────────────────────────────────────────────
exports.crearTicket = asyncH(async (req, res) => {
  const user = req.session.user;
  const { titulo, descripcion, justificacion_tecnica, tipo, prioridad, estimacionHoras } = req.body;

  if (!titulo || !descripcion || !tipo) {
    return res.render('nuevo-ticket', {
      user, roles: ROLES, tiposCambio: TIPOS_CAMBIO, prioridades: IMPACTOS,
      error: 'Los campos Título, Descripción y Tipo de Cambio son obligatorios.',
      title: 'Nueva Solicitud de Cambio',
    });
  }

  // Generar ticket_id único: TK-SC001
  const countRows = await query('SELECT COUNT(*) AS cnt FROM solicitudes_cambio');
  const n = (countRows[0].cnt || 0) + 1;
  const ticket_id = `TK-SC${String(n).padStart(3, '0')}`;

  await query(
    `INSERT INTO solicitudes_cambio
      (ticket_id, titulo, descripcion, justificacion_tecnica, tipo_cambio, impacto, estado_actual, horas_hombre_estimadas, id_solicitante)
     VALUES (?, ?, ?, ?, ?, ?, 'Solicitado', ?, ?)`,
    [ticket_id, titulo, descripcion, justificacion_tecnica || '', tipo, prioridad || 'Pendiente', parseInt(estimacionHoras) || 0, user.id]
  );

  // Historial inicial
  await query(
    `INSERT INTO historial_estados (id_sc, estado_anterior, estado_nuevo, usuario_nombre, usuario_rol, comentario)
     SELECT id_sc, NULL, 'Solicitado', ?, ?, 'Ticket creado.'
     FROM solicitudes_cambio WHERE ticket_id = ?`,
    [user.nombre, user.rol, ticket_id]
  );

  res.redirect(`/tickets/${ticket_id}`);
});
// ─── CAMBIAR ESTADO ───────────────────────────────────────────────────────────
exports.cambiarEstado = asyncH(async (req, res) => {
  const user = req.session.user;
  const { id } = req.params;
  const { nuevoEstado, comentario } = req.body;

  // Validar que el ticket existe
  const rows = await query(
    'SELECT id_sc, ticket_id, estado_actual FROM solicitudes_cambio WHERE ticket_id = ?', [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ ok: false, error: 'Ticket no encontrado.' });
  }
  const ticket = rows[0];
  const estadoActual = ticket.estado_actual;

  // Validar transición
  const permitidos = (transiciones[estadoActual] || {})[nuevoEstado] || [];
  if (!ESTADOS.includes(nuevoEstado) || !permitidos.includes(user.rol)) {
    return res.status(403).json({ ok: false, error: 'Transición no permitida para tu rol.' });
  }

  // Actualizar estado
  await query(
    'UPDATE solicitudes_cambio SET estado_actual = ? WHERE id_sc = ?',
    [nuevoEstado, ticket.id_sc]
  );

  // Registrar en historial
  await query(
    `INSERT INTO historial_estados (id_sc, estado_anterior, estado_nuevo, usuario_nombre, usuario_rol, comentario)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [ticket.id_sc, estadoActual, nuevoEstado, user.nombre, user.rol, comentario || null]
  );

  return res.json({ ok: true, nuevoEstado, ticketId: id });
});

// ─── GUARDAR EVIDENCIA GIT ────────────────────────────────────────────────────
exports.guardarGit = asyncH(async (req, res) => {
  const { id } = req.params;
  const { nombre_rama, url_pull_request, comentario_tecnico } = req.body;

  const rows = await query('SELECT id_sc FROM solicitudes_cambio WHERE ticket_id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Ticket no encontrado.' });
  const { id_sc } = rows[0];

  // Insert or Update (UPSERT)
  await query(
    `INSERT INTO evidencias_git (id_sc, nombre_rama, url_pull_request, comentario_tecnico)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       nombre_rama = VALUES(nombre_rama),
       url_pull_request = VALUES(url_pull_request),
       comentario_tecnico = VALUES(comentario_tecnico)`,
    [id_sc, nombre_rama, url_pull_request, comentario_tecnico || '']
  );

  res.json({ ok: true });
});

// ─── GUARDAR QA ───────────────────────────────────────────────────────────────
exports.guardarQA = asyncH(async (req, res) => {
  const { id } = req.params;
  const { qa_estado, qa_observaciones, qa_evidencia_url, uat_estado, uat_observaciones } = req.body;

  const rows = await query('SELECT id_sc FROM solicitudes_cambio WHERE ticket_id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Ticket no encontrado.' });
  const { id_sc } = rows[0];

  await query(
    `INSERT INTO control_calidad (id_sc, qa_estado, qa_observaciones, qa_evidencia_url, uat_estado, uat_observaciones)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       qa_estado = VALUES(qa_estado),
       qa_observaciones = VALUES(qa_observaciones),
       qa_evidencia_url = VALUES(qa_evidencia_url),
       uat_estado = VALUES(uat_estado),
       uat_observaciones = VALUES(uat_observaciones)`,
    [id_sc, qa_estado || 'Pendiente', qa_observaciones || '', qa_evidencia_url || '', uat_estado || 'Pendiente', uat_observaciones || '']
  );

  res.json({ ok: true });
});

// ─── ASIGNAR DESARROLLADOR / TESTER ──────────────────────────────────────────
exports.asignarPersonal = asyncH(async (req, res) => {
  const { id } = req.params;
  const { id_desarrollador, id_tester } = req.body;

  const rows = await query('SELECT id_sc FROM solicitudes_cambio WHERE ticket_id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Ticket no encontrado.' });
  const { id_sc } = rows[0];

  await query(
    'UPDATE solicitudes_cambio SET id_desarrollador = ?, id_tester = ? WHERE id_sc = ?',
    [id_desarrollador || null, id_tester || null, id_sc]
  );

  res.json({ ok: true });
});

// ─── API: LISTA PARA CONSUMO EXTERNO ─────────────────────────────────────────
exports.apiListar = asyncH(async (req, res) => {
  const user    = req.session.user;
  const tickets = await query(BASE_QUERY + ' ORDER BY sc.fecha_ultima_modificacion DESC');
  const visibles = filtrarPorRol(tickets, user);
  res.json({ ok: true, data: visibles });
});

exports.apiDetalle = asyncH(async (req, res) => {
  const rows = await query(BASE_QUERY + ' WHERE sc.ticket_id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, data: rows[0] });
});
