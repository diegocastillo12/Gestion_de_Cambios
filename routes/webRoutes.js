'use strict';

const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const cc      = require('../controllers/changeController');
const admin   = require('../controllers/adminController');
const proy    = require('../controllers/proyectoController');
const { ROLES } = require('../config/constants');

// ─── AUTH ─────────────────────────────────────────────────────────────────────
router.get('/login',  auth.showLogin);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

// ─── RAÍZ → Redirigir según rol ───────────────────────────────────────────────
router.get('/', auth.requireAuth, (req, res) => {
  const rol = req.session.user?.rol;
  if (rol === ROLES.ADMINISTRADOR)   return res.redirect('/admin');
  if (rol === ROLES.SOLICITANTE)     return res.redirect('/cartera');
  return res.redirect('/dashboard');
});

// ─── DASHBOARD (equipo técnico) ───────────────────────────────────────────────
router.get('/dashboard', auth.requireAuth, cc.dashboard);

// ─── CARTERA DE PROYECTOS (Solicitante y equipo) ──────────────────────────────
router.get('/cartera', auth.requireAuth, proy.miCartera);

// ─── DETALLE DE PROYECTO ──────────────────────────────────────────────────────
router.get('/proyectos/:id',         auth.requireAuth, proy.detalleProyecto);
router.get('/proyectos/:id/reportes',auth.requireAuth, proy.verReportes);

// ─── TICKETS ──────────────────────────────────────────────────────────────────
router.get('/tickets',        auth.requireAuth, cc.listarTickets);
router.get('/tickets/nuevo',  auth.requireAuth, cc.mostrarNuevoTicket);
router.post('/tickets/nuevo', auth.requireAuth, cc.crearTicket);
router.get('/tickets/:id',    auth.requireAuth, cc.mostrarTicket);

// ─── ADMIN ────────────────────────────────────────────────────────────────────
const requireAdmin = auth.requireRole(ROLES.ADMINISTRADOR);

router.get('/admin',                      auth.requireAuth, requireAdmin, admin.dashboard);

// Usuarios
router.get('/admin/usuarios',             auth.requireAuth, requireAdmin, admin.listarUsuarios);

// Proyectos
router.get('/admin/proyectos',            auth.requireAuth, requireAdmin, admin.listarProyectos);
router.get('/admin/proyectos/nuevo',      auth.requireAuth, requireAdmin, admin.mostrarNuevoProyecto);
router.get('/admin/proyectos/:id/config', auth.requireAuth, requireAdmin, admin.mostrarEditarProyecto);

// Metodologías
router.get('/admin/metodologias',         auth.requireAuth, requireAdmin, admin.listarMetodologias);

module.exports = router;
