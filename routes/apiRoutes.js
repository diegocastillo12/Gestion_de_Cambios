/**
 * apiRoutes.js — Endpoints REST para operaciones POST/PUT del flujo de cambio
 * GestioCambios G04
 */

'use strict';

const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const change  = require('../controllers/changeController');

// ─── TICKETS ──────────────────────────────────────────────────────────────────
// POST /api/tickets             → Crear nuevo ticket
router.post('/tickets', auth.requireAuth, change.crearTicket);

// PUT  /api/tickets/:id/estado  → Cambiar estado (transición del flujo)
router.put('/tickets/:id/estado', auth.requireAuth, change.cambiarEstado);

// GET  /api/tickets             → Lista de tickets (API)
router.get('/tickets', auth.requireAuth, change.apiListar);

module.exports = router;
