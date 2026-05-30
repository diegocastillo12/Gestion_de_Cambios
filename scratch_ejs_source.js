function test() {
    ; __append( include('partials/head') )
    ; __append("\n\n<style>\n/* ─── PROYECTO DETALLE ────────────────────────────────────────────────────── */\n.proyecto-hero {\n  background: var(--card-bg);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  padding: 2rem;\n  margin-bottom: 1.5rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}\n.proyecto-hero-info h1 {\n  font-size: 1.5rem; font-weight: 700; margin-bottom: 0.35rem;\n}\n.proyecto-hero-info p {\n  color: var(--text-muted); font-size: 0.9rem; max-width: 600px; line-height: 1.6;\n}\n.proyecto-hero-stats {\n  display: flex; gap: 1.5rem; flex-wrap: wrap; flex-shrink: 0;\n}\n.hero-stat {\n  text-align: center;\n  background: var(--bg-secondary);\n  border-radius: 12px;\n  padding: 0.75rem 1.25rem;\n  min-width: 90px;\n}\n.hero-stat-val { font-size: 1.75rem; font-weight: 800; color: var(--accent); }\n.hero-stat-lbl { font-size: 0.73rem; color: var(--text-muted); margin-top: 0.15rem; }\n\n/* Barra de avance general */\n.avance-general {\n  background: var(--card-bg);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 1.25rem 1.5rem;\n  margin-bottom: 1.5rem;\n  display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;\n}\n.avance-label { font-size: 0.9rem; color: var(--text-muted); flex-shrink: 0; }\n.avance-bar-outer {\n  flex: 1; min-width: 200px; background: var(--bg-secondary);\n  border-radius: 99px; height: 12px; overflow: hidden;\n}\n.avance-bar-inner {\n  height: 100%; border-radius: 99px;\n  background: linear-gradient(90deg, var(--accent), #7c3aed);\n  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);\n}\n.avance-pct { font-size: 1.2rem; font-weight: 700; color: var(--accent); flex-shrink: 0; }\n\n/* Tabs */\n.tabs { display: flex; gap: 0.25rem; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }\n.tab-btn {\n  padding: 0.65rem 1.1rem; border: none; background: none;\n  color: var(--text-muted); cursor: pointer; border-radius: 8px 8px 0 0;\n  font-size: 0.9rem; font-weight: 500; transition: all 0.2s;\n  border-bottom: 2px solid transparent; margin-bottom: -1px;\n}\n.tab-btn:hover  { color: var(--text-primary); background: var(--bg-secondary); }\n.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); background: rgba(99,102,241,0.06); }\n.tab-panel { display: none; }\n.tab-panel.active { display: block; }\n\n/* Cronograma tabla */\n.cronograma-table { width: 100%; border-collapse: collapse; }\n.cronograma-table th, .cronograma-table td {\n  padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border);\n  font-size: 0.875rem;\n}\n.cronograma-table th { color: var(--text-muted); font-weight: 500; text-transform: uppercase; font-size: 0.75rem; }\n.cronograma-table tr:hover td { background: var(--bg-hover, rgba(99,102,241,0.04)); }\n\n/* Progress cells */\n.progress-mini-outer {\n  background: var(--bg-secondary); border-radius: 99px; height: 6px;\n  min-width: 80px; overflow: hidden; display: inline-block; width: 100px;\n}\n.progress-mini-inner {\n  height: 100%; border-radius: 99px;\n  background: linear-gradient(90deg, var(--accent), #7c3aed);\n}\n\n/* Equipo grid */\n.equipo-grid {\n  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;\n}\n.miembro-card {\n  background: var(--bg-secondary); border: 1px solid var(--border);\n  border-radius: 12px; padding: 1.25rem; text-align: center;\n}\n.miembro-avatar {\n  width: 52px; height: 52px; border-radius: 50%;\n  background: linear-gradient(135deg, var(--accent), #7c3aed);\n  display: flex; align-items: center; justify-content: center;\n  font-size: 1.2rem; font-weight: 700; color: white;\n  margin: 0 auto 0.75rem;\n}\n.miembro-nombre { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem; }\n.miembro-rol { font-size: 0.78rem; color: var(--text-muted); }\n\n/* Ranking */\n.ranking-item {\n  display: flex; align-items: center; gap: 1rem;\n  padding: 0.75rem 1rem; border-radius: 10px;\n  background: var(--bg-secondary); margin-bottom: 0.5rem;\n  transition: background 0.2s;\n}\n.ranking-item:hover { background: var(--border); }\n.ranking-pos { font-size: 1.25rem; width: 2rem; text-align: center; flex-shrink: 0; }\n.ranking-info { flex: 1; }\n.ranking-nombre { font-weight: 600; font-size: 0.9rem; }\n.ranking-rol { font-size: 0.78rem; color: var(--text-muted); }\n.ranking-pct { font-weight: 700; color: var(--accent); font-size: 1.05rem; flex-shrink: 0; }\n\n/* Reporte button */\n.btn-reporte {\n  background: linear-gradient(135deg, var(--accent), #7c3aed);\n  color: white; border: none; border-radius: 8px;\n  padding: 0.45rem 1rem; font-size: 0.82rem; font-weight: 600;\n  cursor: pointer; transition: opacity 0.2s;\n}\n.btn-reporte:hover { opacity: 0.85; }\n\n/* Modal */\n.modal-overlay {\n  display: none; position: fixed; inset: 0; z-index: 200;\n  background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);\n  align-items: center; justify-content: center;\n}\n.modal-overlay.open { display: flex; }\n.modal-box {\n  background: var(--card-bg); border: 1px solid var(--border);\n  border-radius: 16px; padding: 2rem; max-width: 480px; width: 90%;\n  box-shadow: 0 24px 80px rgba(0,0,0,0.4);\n  animation: slideUp 0.2s ease;\n}\n@keyframes slideUp {\n  from { transform: translateY(20px); opacity: 0; }\n  to   { transform: translateY(0); opacity: 1; }\n}\n.modal-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; }\n.modal-close {\n  float: right; background: none; border: none; cursor: pointer;\n  color: var(--text-muted); font-size: 1.25rem; line-height: 1;\n}\n\n/* Árbol metodología */\n.metodologia-tree { padding: 0; }\n.etapa-item {\n  background: var(--bg-secondary); border-radius: 10px;\n  margin-bottom: 0.75rem; overflow: hidden;\n}\n.etapa-header {\n  padding: 0.85rem 1.1rem; font-weight: 600; font-size: 0.9rem;\n  cursor: pointer; display: flex; align-items: center; gap: 0.5rem;\n  user-select: none;\n}\n.etapa-header:hover { background: var(--border); }\n.etapa-body { padding: 0.5rem 1.1rem 0.85rem 2.5rem; border-top: 1px solid var(--border); display: none; }\n.etapa-body.open { display: block; }\n.fase-item { margin-bottom: 0.6rem; }\n.fase-nombre { font-size: 0.85rem; font-weight: 500; color: var(--text-primary); margin-bottom: 0.3rem; }\n.ecm-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }\n.ecm-chip {\n  background: rgba(99,102,241,0.12); color: var(--accent);\n  border-radius: 99px; padding: 0.2rem 0.6rem; font-size: 0.72rem; font-weight: 500;\n}\n</style>\n\n<div class=\"layout\">\n  ")
    ; __line = 177
    ; __append( include('partials/sidebar') )
    ; __append("\n\n  <main class=\"main-content\">\n\n    <!-- Hero del proyecto -->\n    <div class=\"proyecto-hero\">\n      <div class=\"proyecto-hero-info\">\n        <h1>📁 ")
    ; __line = 184
    ; __append(escapeFn( proyecto.nombre ))
    ; __append("</h1>\n        <p>")
    ; __line = 185
    ; __append(escapeFn( proyecto.descripcion || 'Sin descripción adicional.' ))
    ; __append("</p>\n        <div style=\"margin-top:0.75rem; display:flex; gap:0.5rem; flex-wrap:wrap;\">\n          ")
    ; __line = 187
    ;  const estadoClass2 = {Activo:'badge-teal',Pausado:'badge-orange',Cerrado:'badge-slate',Archivado:'badge-slate'}[proyecto.estado] || 'badge-slate'; 
    ; __append("\n          <span class=\"badge ")
    ; __line = 188
    ; __append(escapeFn( estadoClass2 ))
    ; __append("\">")
    ; __append(escapeFn( proyecto.estado ))
    ; __append("</span>\n          ")
    ; __line = 189
    ;  if(proyecto.metodologia_nombre) { 
    ; __append("<span class=\"badge badge-blue\">📐 ")
    ; __append(escapeFn( proyecto.metodologia_nombre ))
    ; __append("</span>")
    ;  } 
    ; __append("\n          ")
    ; __line = 190
    ;  if(proyecto.fecha_inicio) { 
    ; __append("<span class=\"badge badge-slate\">📅 ")
    ; __append(escapeFn( new Date(proyecto.fecha_inicio).toLocaleDateString('es-PE') ))
    ; __append("</span>")
    ;  } 
    ; __append("\n          ")
    ; __line = 191
    ;  if(proyecto.fecha_fin) { 
    ; __append("<span class=\"badge badge-slate\">🏁 ")
    ; __append(escapeFn( new Date(proyecto.fecha_fin).toLocaleDateString('es-PE') ))
    ; __append("</span>")
    ;  } 
    ; __append("\n        </div>\n      </div>\n      <div class=\"proyecto-hero-stats\">\n        <div class=\"hero-stat\">\n          <div class=\"hero-stat-val\">")
    ; __line = 196
    ; __append(escapeFn( resumen.total || 0 ))
    ; __append("</div>\n          <div class=\"hero-stat-lbl\">Actividades</div>\n        </div>\n        <div class=\"hero-stat\">\n          <div class=\"hero-stat-val\">")
    ; __line = 200
    ; __append(escapeFn( resumen.completadas || 0 ))
    ; __append("</div>\n          <div class=\"hero-stat-lbl\">Completadas</div>\n        </div>\n        <div class=\"hero-stat\">\n          <div class=\"hero-stat-val\">")
    ; __line = 204
    ; __append(escapeFn( tickets.length ))
    ; __append("</div>\n          <div class=\"hero-stat-lbl\">Tickets</div>\n        </div>\n        <div class=\"hero-stat\">\n          <div class=\"hero-stat-val\">")
    ; __line = 208
    ; __append(escapeFn( equipo.length ))
    ; __append("</div>\n          <div class=\"hero-stat-lbl\">Equipo</div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Barra de avance general -->\n    <div class=\"avance-general\">\n      <span class=\"avance-label\">📊 Avance General del Proyecto:</span>\n      <div class=\"avance-bar-outer\">\n        <div class=\"avance-bar-inner\" style=\"width:")
    ; __line = 218
    ; __append(escapeFn( promedioAvance ))
    ; __append("%\"></div>\n      </div>\n      <span class=\"avance-pct\">")
    ; __line = 220
    ; __append(escapeFn( promedioAvance ))
    ; __append("%</span>\n    </div>\n\n    <!-- Tabs -->\n    <div class=\"tabs\">\n      <button class=\"tab-btn active\" onclick=\"switchTab('cronograma', this)\">📅 Cronograma</button>\n      <button class=\"tab-btn\" onclick=\"switchTab('equipo', this)\">👥 Equipo</button>\n      <button class=\"tab-btn\" onclick=\"switchTab('metodologia', this)\">📐 Metodología</button>\n      <button class=\"tab-btn\" onclick=\"switchTab('tickets', this)\">🎫 Tickets</button>\n      <button class=\"tab-btn\" onclick=\"switchTab('ranking', this)\">🏆 Ranking</button>\n    </div>\n\n    <!-- TAB: CRONOGRAMA -->\n    <div id=\"tab-cronograma\" class=\"tab-panel active\">\n      <div class=\"card\" style=\"overflow:auto;\">\n        <div class=\"section-header\" style=\"margin-bottom:1rem;\">\n          <h2 class=\"section-title\" style=\"font-size:1rem;\">Actividades del Cronograma</h2>\n        </div>\n        ")
    ; __line = 238
    ;  if(cronograma && cronograma.length > 0) { 
    ; __append("\n        <table class=\"cronograma-table\">\n          <thead>\n            <tr>\n              <th>Actividad</th>\n              <th>Fase</th>\n              <th>Inicio</th>\n              <th>Fin</th>\n              <th>Avance</th>\n              <th>Estado</th>\n              <th>Entregable</th>\n              ")
    ; __line = 249
    ;  if(['Desarrollador Asignado','Líder Técnico','Gestor de Configuración'].includes(miRolEnProyecto)){ 
    ; __append("<th>Acción</th>")
    ;  } 
    ; __append("\n            </tr>\n          </thead>\n          <tbody>\n          ")
    ; __line = 253
    ;  cronograma.forEach(act => {
            const estadoColores = {
              Pendiente: 'badge-slate', 'En Progreso': 'badge-orange',
              Completado: 'badge-teal', Bloqueado: 'badge-red'
            };
          
    ; __line = 258
    ; __append("\n            <tr>\n              <td>\n                <div style=\"font-weight:500;\">")
    ; __line = 261
    ; __append(escapeFn( act.nombre ))
    ; __append("</div>\n                ")
    ; __line = 262
    ;  if(act.descripcion) { 
    ; __append("<div style=\"font-size:0.78rem;color:var(--text-muted);\">")
    ; __append(escapeFn( act.descripcion ))
    ; __append("</div>")
    ;  } 
    ; __append("\n              </td>\n              <td style=\"color:var(--text-muted);font-size:0.8rem;\">")
    ; __line = 264
    ; __append(escapeFn( act.fase_nombre || '—' ))
    ; __append("</td>\n              <td style=\"font-size:0.82rem;\">")
    ; __line = 265
    ; __append(escapeFn( act.fecha_inicio ? new Date(act.fecha_inicio).toLocaleDateString('es-PE') : '—' ))
    ; __append("</td>\n              <td style=\"font-size:0.82rem;\">")
    ; __line = 266
    ; __append(escapeFn( act.fecha_fin ? new Date(act.fecha_fin).toLocaleDateString('es-PE') : '—' ))
    ; __append("</td>\n              <td>\n                <div style=\"display:flex;align-items:center;gap:0.5rem;\">\n                  <div class=\"progress-mini-outer\"><div class=\"progress-mini-inner\" style=\"width:")
    ; __line = 269
    ; __append(escapeFn( act.porcentaje_avance ))
    ; __append("%\"></div></div>\n                  <span style=\"font-size:0.8rem;font-weight:600;\">")
    ; __line = 270
    ; __append(escapeFn( parseFloat(act.porcentaje_avance||0).toFixed(0) ))
    ; __append("%</span>\n                </div>\n              </td>\n              <td><span class=\"badge ")
    ; __line = 273
    ; __append(escapeFn( estadoColores[act.estado] || 'badge-slate' ))
    ; __append("\">")
    ; __append(escapeFn( act.estado ))
    ; __append("</span></td>\n              <td style=\"font-size:0.8rem;\">\n                ")
    ; __line = 275
    ;  if(act.entregable_ticket_id) { 
    ; __append("\n                  <a href=\"/tickets/")
    ; __line = 276
    ; __append(escapeFn( act.entregable_ticket_id ))
    ; __append("\" style=\"color:var(--accent);text-decoration:none;font-weight:500;\">\n                    ")
    ; __line = 277
    ; __append(escapeFn( act.entregable_ticket_id ))
    ; __append("\n                  </a>\n                ")
    ; __line = 279
    ;  } else { 
    ; __append("—")
    ;  } 
    ; __append("\n              </td>\n              ")
    ; __line = 281
    ;  if(['Desarrollador Asignado','Líder Técnico','Gestor de Configuración'].includes(miRolEnProyecto)){ 
    ; __append("\n              <td>\n                ")
    ; __line = 283
    ;  if(act.es_reportable) { 
    ; __append("\n                <button class=\"btn-reporte\" onclick=\"abrirModalReporte(")
    ; __line = 284
    ; __append(escapeFn( act.id_actividad ))
    ; __append(", '")
    ; __append(escapeFn( act.nombre.replace(/'/g,'\\'') ))
    ; __append("', ")
    ; __append(escapeFn( act.porcentaje_avance ))
    ; __append(")\">\n                  📝 Reportar\n                </button>\n                ")
    ; __line = 287
    ;  } else { 
    ; __append("\n                <span style=\"font-size:0.75rem;color:var(--text-muted);\">No reportable</span>\n                ")
    ; __line = 289
    ;  } 
    ; __append("\n              </td>\n              ")
    ; __line = 291
    ;  } 
    ; __append("\n            </tr>\n          ")
    ; __line = 293
    ;  }); 
    ; __append("\n          </tbody>\n        </table>\n        ")
    ; __line = 296
    ;  } else { 
    ; __append("\n        <div style=\"text-align:center;padding:3rem;color:var(--text-muted);\">\n          <div style=\"font-size:2.5rem;margin-bottom:0.75rem;\">📅</div>\n          <p>No hay actividades en el cronograma.</p>\n        </div>\n        ")
    ; __line = 301
    ;  } 
    ; __append("\n      </div>\n    </div>\n\n    <!-- TAB: EQUIPO -->\n    <div id=\"tab-equipo\" class=\"tab-panel\">\n      <div class=\"card\">\n        <h2 class=\"section-title\" style=\"font-size:1rem;margin-bottom:1.25rem;\">👥 Equipo del Proyecto</h2>\n        ")
    ; __line = 309
    ;  if(equipo && equipo.length > 0) { 
    ; __append("\n        <div class=\"equipo-grid\">\n          ")
    ; __line = 311
    ;  equipo.forEach(m => { 
    ; __append("\n          <div class=\"miembro-card\">\n            <div class=\"miembro-avatar\">")
    ; __line = 313
    ; __append(escapeFn( m.nombre.slice(0,2).toUpperCase() ))
    ; __append("</div>\n            <div class=\"miembro-nombre\">")
    ; __line = 314
    ; __append(escapeFn( m.nombre ))
    ; __append("</div>\n            <div class=\"miembro-rol\">")
    ; __line = 315
    ; __append(escapeFn( m.rol_en_proyecto ))
    ; __append("</div>\n            <div style=\"font-size:0.72rem;color:var(--text-muted);margin-top:0.3rem;\">")
    ; __line = 316
    ; __append(escapeFn( m.correo ))
    ; __append("</div>\n          </div>\n          ")
    ; __line = 318
    ;  }); 
    ; __append("\n        </div>\n        ")
    ; __line = 320
    ;  } else { 
    ; __append("\n        <p style=\"color:var(--text-muted);\">No hay miembros asignados.</p>\n        ")
    ; __line = 322
    ;  } 
    ; __append("\n      </div>\n    </div>\n\n    <!-- TAB: METODOLOGÍA -->\n    <div id=\"tab-metodologia\" class=\"tab-panel\">\n      <div class=\"card\">\n        <h2 class=\"section-title\" style=\"font-size:1rem;margin-bottom:1.25rem;\">📐 Metodología del Proyecto</h2>\n        ")
    ; __line = 330
    ;  if(arbolMetodologia) { 
    ; __append("\n        <div style=\"margin-bottom:1rem;\">\n          <strong style=\"font-size:1.1rem;\">")
    ; __line = 332
    ; __append(escapeFn( arbolMetodologia.nombre ))
    ; __append("</strong>\n          ")
    ; __line = 333
    ;  if(arbolMetodologia.descripcion) { 
    ; __append("\n          <p style=\"color:var(--text-muted);font-size:0.85rem;margin-top:0.35rem;\">")
    ; __line = 334
    ; __append(escapeFn( arbolMetodologia.descripcion ))
    ; __append("</p>\n          ")
    ; __line = 335
    ;  } 
    ; __append("\n        </div>\n        <div class=\"metodologia-tree\">\n          ")
    ; __line = 338
    ;  (arbolMetodologia.etapas || []).forEach((etapa, ei) => { 
    ; __append("\n          <div class=\"etapa-item\">\n            <div class=\"etapa-header\" onclick=\"toggleEtapa(this)\">\n              <span>▶</span>\n              <span>Etapa ")
    ; __line = 342
    ; __append(escapeFn( ei+1 ))
    ; __append(": ")
    ; __append(escapeFn( etapa.nombre ))
    ; __append("</span>\n              <span style=\"margin-left:auto;font-size:0.75rem;color:var(--text-muted);\">")
    ; __line = 343
    ; __append(escapeFn( (etapa.fases||[]).length ))
    ; __append(" fases</span>\n            </div>\n            <div class=\"etapa-body\">\n              ")
    ; __line = 346
    ;  (etapa.fases || []).forEach(fase => { 
    ; __append("\n              <div class=\"fase-item\">\n                <div class=\"fase-nombre\">🗂 ")
    ; __line = 348
    ; __append(escapeFn( fase.nombre ))
    ; __append("</div>\n                <div class=\"ecm-chips\">\n                  ")
    ; __line = 350
    ;  (fase.ecm || []).forEach(ecm => { 
    ; __append("\n                  <span class=\"ecm-chip\" title=\"")
    ; __line = 351
    ; __append(escapeFn( ecm.tipo ))
    ; __append("\">")
    ; __append(escapeFn( ecm.nombre ))
    ; __append("</span>\n                  ")
    ; __line = 352
    ;  }); 
    ; __append("\n                  ")
    ; __line = 353
    ;  if(!fase.ecm || !fase.ecm.length) { 
    ; __append("<span style=\"font-size:0.75rem;color:var(--text-muted);\">Sin elementos</span>")
    ;  } 
    ; __append("\n                </div>\n              </div>\n              ")
    ; __line = 356
    ;  }); 
    ; __append("\n            </div>\n          </div>\n          ")
    ; __line = 359
    ;  }); 
    ; __append("\n        </div>\n        ")
    ; __line = 361
    ;  } else { 
    ; __append("\n        <div style=\"text-align:center;padding:3rem;color:var(--text-muted);\">\n          <div style=\"font-size:2.5rem;margin-bottom:0.75rem;\">📐</div>\n          <p>No hay metodología configurada para este proyecto.</p>\n        </div>\n        ")
    ; __line = 366
    ;  } 
    ; __append("\n      </div>\n    </div>\n\n    <!-- TAB: TICKETS -->\n    <div id=\"tab-tickets\" class=\"tab-panel\">\n      <div class=\"card\" style=\"overflow:auto;\">\n        <div class=\"section-header\" style=\"margin-bottom:1rem;\">\n          <h2 class=\"section-title\" style=\"font-size:1rem;\">🎫 Solicitudes de Cambio del Proyecto</h2>\n          ")
    ; __line = 375
    ;  if(['Solicitante','Gestor de Configuración'].includes(miRolEnProyecto) || ['Solicitante','Gestor de Configuración'].includes(user.rol)){ 
    ; __append("\n          <a href=\"/tickets/nuevo\" class=\"btn btn-primary\" style=\"font-size:0.82rem;padding:0.4rem 1rem;\">➕ Nueva Solicitud</a>\n          ")
    ; __line = 377
    ;  } 
    ; __append("\n        </div>\n        ")
    ; __line = 379
    ;  if(tickets && tickets.length > 0) { 
    ; __append("\n        <table class=\"cronograma-table\">\n          <thead><tr><th>ID</th><th>Título</th><th>Estado</th><th>Solicitante</th><th>Fecha</th><th></th></tr></thead>\n          <tbody>\n          ")
    ; __line = 383
    ;  tickets.forEach(t => {
            const estadoMeta2 = {
              'Solicitado':'badge-slate','En Análisis':'badge-orange',
              'Pendiente de Aprobación':'badge-blue','Aprobado':'badge-teal',
              'En Desarrollo':'badge-yellow','En Pruebas QA':'badge-pink',
              'En Pruebas UAT':'badge-purple','Listo para Integración':'badge-blue',
              'Liberado':'badge-green','Rechazado':'badge-red','Descartado':'badge-slate'
            };
          
    ; __line = 391
    ; __append("\n          <tr>\n            <td><code style=\"font-size:0.78rem;\">")
    ; __line = 393
    ; __append(escapeFn( t.id ))
    ; __append("</code></td>\n            <td>")
    ; __line = 394
    ; __append(escapeFn( t.titulo ))
    ; __append("</td>\n            <td><span class=\"badge ")
    ; __line = 395
    ; __append(escapeFn( estadoMeta2[t.estado]||'badge-slate' ))
    ; __append("\">")
    ; __append(escapeFn( t.estado ))
    ; __append("</span></td>\n            <td style=\"font-size:0.82rem;\">")
    ; __line = 396
    ; __append(escapeFn( t.solicitanteNombre || '—' ))
    ; __append("</td>\n            <td style=\"font-size:0.78rem;color:var(--text-muted);\">")
    ; __line = 397
    ; __append(escapeFn( t.fechaCreacion ? new Date(t.fechaCreacion).toLocaleDateString('es-PE') : '—' ))
    ; __append("</td>\n            <td><a href=\"/tickets/")
    ; __line = 398
    ; __append(escapeFn( t.id ))
    ; __append("\" class=\"btn btn-ghost\" style=\"font-size:0.78rem;padding:0.3rem 0.75rem;\">Ver</a></td>\n          </tr>\n          ")
    ; __line = 400
    ;  }); 
    ; __append("\n          </tbody>\n        </table>\n        ")
    ; __line = 403
    ;  } else { 
    ; __append("\n        <div style=\"text-align:center;padding:3rem;color:var(--text-muted);\">\n          <div style=\"font-size:2.5rem;margin-bottom:0.75rem;\">🎫</div>\n          <p>No hay tickets en este proyecto.</p>\n        </div>\n        ")
    ; __line = 408
    ;  } 
    ; __append("\n      </div>\n    </div>\n\n    <!-- TAB: RANKING -->\n    <div id=\"tab-ranking\" class=\"tab-panel\">\n      <div class=\"card\">\n        <h2 class=\"section-title\" style=\"font-size:1rem;margin-bottom:1.25rem;\">🏆 Ranking de Avance del Equipo</h2>\n        ")
    ; __line = 416
    ;  if(ranking && ranking.length > 0) { 
    ; __append("\n        ")
    ; __line = 417
    ;  const medallas = ['🥇','🥈','🥉']; 
    ; __append("\n        ")
    ; __line = 418
    ;  ranking.forEach((m, i) => { 
    ; __append("\n        <div class=\"ranking-item\">\n          <div class=\"ranking-pos\">")
    ; __line = 420
    ; __append(escapeFn( medallas[i] || (i+1) ))
    ; __append("</div>\n          <div class=\"ranking-info\">\n            <div class=\"ranking-nombre\">")
    ; __line = 422
    ; __append(escapeFn( m.nombre ))
    ; __append("</div>\n            <div class=\"ranking-rol\">")
    ; __line = 423
    ; __append(escapeFn( m.rol ))
    ; __append(" · ")
    ; __append(escapeFn( m.total_reportes ))
    ; __append(" reportes</div>\n          </div>\n          <div style=\"flex:1;margin:0 1rem;\">\n            <div class=\"progress-mini-outer\" style=\"width:100%;display:block;\">\n              <div class=\"progress-mini-inner\" style=\"width:")
    ; __line = 427
    ; __append(escapeFn( m.promedio_avance || 0 ))
    ; __append("%;height:8px;\"></div>\n            </div>\n          </div>\n          <div class=\"ranking-pct\">")
    ; __line = 430
    ; __append(escapeFn( parseFloat(m.promedio_avance||0).toFixed(1) ))
    ; __append("%</div>\n        </div>\n        ")
    ; __line = 432
    ;  }); 
    ; __append("\n        ")
    ; __line = 433
    ;  } else { 
    ; __append("\n        <div style=\"text-align:center;padding:3rem;color:var(--text-muted);\">\n          <div style=\"font-size:2.5rem;margin-bottom:0.75rem;\">🏆</div>\n          <p>No hay reportes de avance aún.</p>\n        </div>\n        ")
    ; __line = 438
    ;  } 
    ; __append("\n\n        <!-- Últimos reportes -->\n        ")
    ; __line = 441
    ;  if(reportes && reportes.length > 0) { 
    ; __append("\n        <h3 style=\"font-size:0.9rem;font-weight:600;margin:1.5rem 0 0.75rem;color:var(--text-muted);\">📋 Últimos Reportes de Avance</h3>\n        ")
    ; __line = 443
    ;  reportes.slice(0,8).forEach(r => { 
    ; __append("\n        <div style=\"display:flex;gap:1rem;align-items:center;padding:0.6rem 0;border-bottom:1px solid var(--border);\">\n          <div style=\"flex:1;\">\n            <span style=\"font-weight:500;font-size:0.85rem;\">")
    ; __line = 446
    ; __append(escapeFn( r.reportado_por ))
    ; __append("</span>\n            <span style=\"color:var(--text-muted);font-size:0.78rem;\"> en <em>")
    ; __line = 447
    ; __append(escapeFn( r.actividad_nombre ))
    ; __append("</em></span>\n          </div>\n          <span style=\"font-weight:700;color:var(--accent);\">+")
    ; __line = 449
    ; __append(escapeFn( r.porcentaje ))
    ; __append("%</span>\n          <span style=\"font-size:0.75rem;color:var(--text-muted);\">\n            ")
    ; __line = 451
    ; __append(escapeFn( new Date(r.fecha_reporte).toLocaleDateString('es-PE', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) ))
    ; __append("\n          </span>\n          ")
    ; __line = 453
    ;  if(!r.visto_por_cliente && user.rol === 'Solicitante') { 
    ; __append("\n          <span class=\"badge badge-orange\" style=\"font-size:0.65rem;\">Nuevo</span>\n          ")
    ; __line = 455
    ;  } 
    ; __append("\n        </div>\n        ")
    ; __line = 457
    ;  }); 
    ; __append("\n        ")
    ; __line = 458
    ;  } 
    ; __append("\n      </div>\n    </div>\n\n  </main>\n</div>\n\n<!-- Modal: Reportar Avance -->\n<div class=\"modal-overlay\" id=\"modalReporte\">\n  <div class=\"modal-box\">\n    <button class=\"modal-close\" onclick=\"cerrarModal('modalReporte')\">✕</button>\n    <div class=\"modal-title\">📝 Reportar Avance</div>\n    <p id=\"modal-actividad-nombre\" style=\"color:var(--text-muted);font-size:0.85rem;margin-bottom:1.25rem;\"></p>\n\n    <div class=\"form-group\">\n      <label class=\"form-label\">Porcentaje de Avance (%)</label>\n      <input type=\"range\" id=\"avance-slider\" min=\"0\" max=\"100\" step=\"1\" value=\"0\"\n        oninput=\"document.getElementById('avance-val').textContent = this.value + '%'\"\n        style=\"width:100%;margin-bottom:0.5rem;accent-color:var(--accent);\">\n      <div style=\"text-align:center;font-size:1.5rem;font-weight:700;color:var(--accent);\" id=\"avance-val\">0%</div>\n    </div>\n\n    <div class=\"form-group\">\n      <label class=\"form-label\">Comentario (opcional)</label>\n      <textarea id=\"reporte-comentario\" class=\"form-input\" rows=\"3\" style=\"resize:vertical;\" placeholder=\"Describe el avance realizado...\"></textarea>\n    </div>\n\n    <div style=\"display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1.25rem;\">\n      <button class=\"btn btn-ghost\" onclick=\"cerrarModal('modalReporte')\">Cancelar</button>\n      <button class=\"btn btn-primary\" id=\"btn-enviar-reporte\" onclick=\"enviarReporte()\">Enviar Reporte</button>\n    </div>\n  </div>\n</div>\n\n<script>\nlet actividadActual = null;\n\nfunction switchTab(name, btn) {\n  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));\n  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));\n  document.getElementById('tab-' + name).classList.add('active');\n  btn.classList.add('active');\n}\n\nfunction toggleEtapa(header) {\n  const body = header.nextElementSibling;\n  const arrow = header.querySelector('span:first-child');\n  const isOpen = body.classList.toggle('open');\n  arrow.textContent = isOpen ? '▼' : '▶';\n}\n\nfunction abrirModalReporte(idActividad, nombre, avanceActual) {\n  actividadActual = idActividad;\n  document.getElementById('modal-actividad-nombre').textContent = nombre;\n  document.getElementById('avance-slider').value = avanceActual || 0;\n  document.getElementById('avance-val').textContent = (avanceActual || 0) + '%';\n  document.getElementById('reporte-comentario').value = '';\n  document.getElementById('modalReporte').classList.add('open');\n}\n\nfunction cerrarModal(id) {\n  document.getElementById(id).classList.remove('open');\n}\n\nasync function enviarReporte() {\n  const btn = document.getElementById('btn-enviar-reporte');\n  const porcentaje = document.getElementById('avance-slider').value;\n  const comentario = document.getElementById('reporte-comentario').value.trim();\n\n  btn.disabled = true;\n  btn.textContent = 'Enviando...';\n\n  try {\n    const resp = await fetch('/api/reportes', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ idActividad: actividadActual, porcentaje, comentario })\n    });\n    const data = await resp.json();\n\n    if (data.success) {\n      cerrarModal('modalReporte');\n      // Actualizar la barra de progreso de la actividad en la tabla sin recargar\n      location.reload();\n    } else {\n      alert('Error: ' + (data.error || 'No se pudo enviar el reporte.'));\n    }\n  } catch(e) {\n    alert('Error de conexión.');\n  } finally {\n    btn.disabled = false;\n    btn.textContent = 'Enviar Reporte';\n  }\n}\n\n// Cerrar modal con click fuera\ndocument.getElementById('modalReporte').addEventListener('click', function(e) {\n  if (e.target === this) cerrarModal('modalReporte');\n});\n</script>\n\n")
    ; __line = 559
    ; __append( include('partials/footer') )
    ; __append("\n")
    ; __line = 560

}