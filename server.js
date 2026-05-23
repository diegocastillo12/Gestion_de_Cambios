/**
 * server.js — Punto de entrada de GestioCambios G04
 * Backend: Express.js | Vistas: EJS | Persistencia: en memoria (config/db.js)
 */

'use strict';

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path    = require('path');

const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MOTOR DE VISTAS ──────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── ARCHIVOS ESTÁTICOS ───────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── MIDDLEWARES ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── SESIONES ─────────────────────────────────────────────────────────────────
app.use(session({
  secret: 'gestio-cambios-g04-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,          // true solo con HTTPS en producción
    maxAge: 8 * 60 * 60 * 1000,  // 8 horas
  },
}));

// ─── VARIABLES LOCALES GLOBALES PARA VISTAS ───────────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  res.locals.currentPath = req.path;
  next();
});

// ─── RUTAS ────────────────────────────────────────────────────────────────────
app.use('/',     webRoutes);
app.use('/api',  apiRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página No Encontrada',
    message: `La ruta "${req.originalUrl}" no existe en el sistema.`,
    user: req.session ? req.session.user : null,
  });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).render('error', {
    title: 'Error Interno del Servidor',
    message: err.message || 'Ocurrió un error inesperado.',
    user: req.session ? req.session.user : null,
  });
});

const { testConnection } = require('./config/db');

// ─── ARRANQUE ─────────────────────────────────────────────────────────────────
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════════╗');
    console.log('  ║   GestioCambios G04 — Sistema SCM           ║');
    console.log(`  ║   Servidor activo en http://localhost:${PORT}  ║`);
    console.log('  ╚══════════════════════════════════════════════╝');
    console.log('');
    console.log('  Usuarios disponibles (password: 123):');
    console.log('  ┌──────────────────┬──────────────────────────────────┐');
    console.log('  │ docente@upt.pe   │ Solicitante                      │');
    console.log('  │ sergio@upt.pe    │ Gestor de Configuración          │');
    console.log('  │ diego@upt.pe     │ Líder Técnico/Analista           │');
    console.log('  │ gregory@upt.pe   │ Desarrollador Asignado           │');
    console.log('  │ cesar@upt.pe     │ Tester / QA                      │');
    console.log('  └──────────────────┴──────────────────────────────────┘');
    console.log('');
  });
});
