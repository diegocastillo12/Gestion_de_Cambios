/**
 * controllers/authController.js — Autenticación con MySQL
 * Login por correo + contraseña contra tabla usuarios
 */

'use strict';

const { query, ROLES } = require('../config/db');

// ─── WRAPPER ASYNC ────────────────────────────────────────────────────────────
const asyncH = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.showLogin = (req, res) => {
  if (req.session && req.session.user) return res.redirect('/dashboard');
  res.render('login', { error: null, roles: ROLES, title: 'Iniciar Sesión' });
};

exports.login = asyncH(async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.render('login', {
      error: 'Ingresa tu correo y contraseña.',
      roles: ROLES,
      title: 'Iniciar Sesión',
    });
  }

  // Buscar usuario por correo (password en texto plano tal como está en la BD)
  const rows = await query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo, u.password_hash,
            r.nombre_rol
     FROM   usuarios u
     JOIN   roles r ON u.id_rol = r.id_rol
     WHERE  u.correo = ?`,
    [correo.trim().toLowerCase()]
  );

  if (rows.length === 0 || rows[0].password_hash !== password) {
    return res.render('login', {
      error: 'Correo o contraseña incorrectos.',
      roles: ROLES,
      title: 'Iniciar Sesión',
    });
  }

  const u = rows[0];
  req.session.user = {
    id:     u.id_usuario,
    nombre: u.nombre_completo,
    correo: u.correo,
    rol:    u.nombre_rol,
  };

  res.redirect('/dashboard');
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

// ─── MIDDLEWARES ──────────────────────────────────────────────────────────────
exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
};

exports.requireRole = (...rolesPermitidos) => (req, res, next) => {
  const user = req.session && req.session.user;
  if (!user) return res.redirect('/login');
  if (rolesPermitidos.includes(user.rol)) return next();
  res.status(403).render('error', {
    title: '403 — Acceso Denegado',
    message: 'No tienes permiso para acceder a esta sección.',
    user,
    roles: ROLES,
  });
};
