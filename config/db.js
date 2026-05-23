/**
 * config/db.js — Conexión MySQL2 para GestioCambios G04
 * Motor: HeidiSQL / MySQL local
 * Base de datos: gestiocambios_db
 */

'use strict';

const mysql = require('mysql2/promise');

// ─── POOL DE CONEXIONES ───────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             parseInt(process.env.DB_PORT) || 3306,
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',        // ← cambia si tienes password en MySQL
  database:         process.env.DB_NAME     || 'gestiocambios_db',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  charset:          'utf8mb4',
  timezone:         '-05:00',
});

// ─── HELPER DE QUERIES ────────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ─── CONSTANTES DEL SISTEMA ───────────────────────────────────────────────────

const ROLES = {
  SOLICITANTE:          'Solicitante',
  DIRECTOR:             'Director',
  GESTOR_CONFIGURACION: 'Gestor de Configuración',
  LIDER_TECNICO:        'Líder Técnico',
  CCB:                  'Comité de Control (CCB)',
  DESARROLLADOR:        'Desarrollador Asignado',
  TESTER:               'Equipo QA / Tester',
};

const ESTADOS = [
  'Solicitado',
  'En Análisis',
  'Pendiente de Aprobación',
  'Aprobado',
  'En Desarrollo',
  'En Pruebas QA',
  'En Pruebas UAT',
  'Listo para Integración',
  'Liberado',
  'Rechazado',
  'Descartado',
];

const TIPOS_CAMBIO = ['Correctivo', 'Evolutivo', 'Adaptativo', 'Perfectivo'];
const IMPACTOS     = ['Pendiente', 'Menor', 'Mayor'];

// ─── TEST DE CONEXIÓN ─────────────────────────────────────────────────────────
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('  ✅ Conexión MySQL establecida correctamente.');
    conn.release();
    return true;
  } catch (err) {
    console.error('  ❌ Error al conectar con MySQL:', err.message);
    console.error('     Verifica host, puerto, usuario y contraseña en config/db.js');
    return false;
  }
}

module.exports = { pool, query, testConnection, ROLES, ESTADOS, TIPOS_CAMBIO, IMPACTOS };
