'use strict';

const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const cc      = require('../controllers/changeController');

// ─── AUTH ─────────────────────────────────────────────────────────────────────
router.get('/login',  auth.showLogin);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/',          auth.requireAuth, cc.dashboard);
router.get('/dashboard', auth.requireAuth, cc.dashboard);

// ─── TICKETS ──────────────────────────────────────────────────────────────────
router.get('/tickets',         auth.requireAuth, cc.listarTickets);
router.get('/tickets/nuevo',   auth.requireAuth, cc.mostrarNuevoTicket);
router.post('/tickets/nuevo',  auth.requireAuth, cc.crearTicket);
router.get('/tickets/:id',     auth.requireAuth, cc.mostrarTicket);

module.exports = router;
