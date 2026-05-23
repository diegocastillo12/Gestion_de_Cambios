/**
 * config/db-init.js — Inicialización automática de tablas adicionales
 * Crea la tabla historial_estados si no existe (no está en el SQL original).
 * Ejecutar al arrancar el servidor.
 */

'use strict';

const { pool, testConnection } = require('./db');

async function initDatabase() {
  console.log('\n  🔌 Conectando con MySQL...');
  const ok = await testConnection();
  if (!ok) {
    console.error('\n  ⚠️  El servidor arrancará pero las rutas fallarán sin DB.');
    return;
  }

  // Tabla adicional: historial de transiciones de estado
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS historial_estados (
      id_historial        INT AUTO_INCREMENT PRIMARY KEY,
      id_sc               INT NOT NULL,
      estado_anterior     VARCHAR(60),
      estado_nuevo        VARCHAR(60) NOT NULL,
      usuario_nombre      VARCHAR(100),
      usuario_rol         VARCHAR(60),
      comentario          TEXT,
      fecha_cambio        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_sc) REFERENCES solicitudes_cambio(id_sc) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('  ✅ Tabla historial_estados verificada.');
}

module.exports = initDatabase;
