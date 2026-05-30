/**
 * models/MetodologiaModel.js — Capa de Acceso a Datos para Metodologías
 * Gestiona metodologías → etapas → fases → elementos de configuración
 */

'use strict';

const { query } = require('../config/db');

class MetodologiaModel {

  /** Listar todas las metodologías */
  async findAll() {
    return query('SELECT * FROM metodologias ORDER BY nombre ASC');
  }

  /** Obtener una metodología por ID */
  async findById(idMetodologia) {
    const rows = await query('SELECT * FROM metodologias WHERE id_metodologia = ?', [idMetodologia]);
    return rows.length > 0 ? rows[0] : null;
  }

  /** Crear metodología */
  async create(data) {
    const { nombre, descripcion } = data;
    const result = await query(
      'INSERT INTO metodologias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || '']
    );
    return result;
  }

  /** Actualizar metodología */
  async update(idMetodologia, data) {
    const { nombre, descripcion } = data;
    return query(
      'UPDATE metodologias SET nombre = ?, descripcion = ? WHERE id_metodologia = ?',
      [nombre, descripcion || '', idMetodologia]
    );
  }

  /** Eliminar metodología (en cascada borra etapas, fases, ECM) */
  async delete(idMetodologia) {
    return query('DELETE FROM metodologias WHERE id_metodologia = ?', [idMetodologia]);
  }

  // ─── ETAPAS ───────────────────────────────────────────────────────────────────

  /** Obtener etapas de una metodología */
  async getEtapas(idMetodologia) {
    return query(
      'SELECT * FROM etapas WHERE id_metodologia = ? ORDER BY orden ASC, id_etapa ASC',
      [idMetodologia]
    );
  }

  /** Crear etapa */
  async createEtapa(data) {
    const { idMetodologia, nombre, descripcion, orden } = data;
    return query(
      'INSERT INTO etapas (id_metodologia, nombre, descripcion, orden) VALUES (?, ?, ?, ?)',
      [idMetodologia, nombre, descripcion || '', orden || 0]
    );
  }

  /** Actualizar etapa */
  async updateEtapa(idEtapa, data) {
    const { nombre, descripcion, orden } = data;
    return query(
      'UPDATE etapas SET nombre = ?, descripcion = ?, orden = ? WHERE id_etapa = ?',
      [nombre, descripcion || '', orden || 0, idEtapa]
    );
  }

  /** Eliminar etapa */
  async deleteEtapa(idEtapa) {
    return query('DELETE FROM etapas WHERE id_etapa = ?', [idEtapa]);
  }

  // ─── FASES ────────────────────────────────────────────────────────────────────

  /** Obtener fases de una etapa */
  async getFases(idEtapa) {
    return query(
      'SELECT * FROM fases WHERE id_etapa = ? ORDER BY orden ASC, id_fase ASC',
      [idEtapa]
    );
  }

  /** Crear fase */
  async createFase(data) {
    const { idEtapa, nombre, descripcion, orden } = data;
    return query(
      'INSERT INTO fases (id_etapa, nombre, descripcion, orden) VALUES (?, ?, ?, ?)',
      [idEtapa, nombre, descripcion || '', orden || 0]
    );
  }

  /** Actualizar fase */
  async updateFase(idFase, data) {
    const { nombre, descripcion, orden } = data;
    return query(
      'UPDATE fases SET nombre = ?, descripcion = ?, orden = ? WHERE id_fase = ?',
      [nombre, descripcion || '', orden || 0, idFase]
    );
  }

  /** Eliminar fase */
  async deleteFase(idFase) {
    return query('DELETE FROM fases WHERE id_fase = ?', [idFase]);
  }

  // ─── ELEMENTOS DE CONFIGURACIÓN (ECM) ─────────────────────────────────────────

  /** Obtener ECM de una fase */
  async getECM(idFase) {
    return query(
      'SELECT * FROM elementos_config_metodologia WHERE id_fase = ? ORDER BY id_ecm ASC',
      [idFase]
    );
  }

  /** Crear ECM */
  async createECM(data) {
    const { idFase, nombre, tipo, descripcion } = data;
    return query(
      'INSERT INTO elementos_config_metodologia (id_fase, nombre, tipo, descripcion) VALUES (?, ?, ?, ?)',
      [idFase, nombre, tipo || 'Documento', descripcion || '']
    );
  }

  /** Actualizar ECM */
  async updateECM(idEcm, data) {
    const { nombre, tipo, descripcion } = data;
    return query(
      'UPDATE elementos_config_metodologia SET nombre = ?, tipo = ?, descripcion = ? WHERE id_ecm = ?',
      [nombre, tipo || 'Documento', descripcion || '', idEcm]
    );
  }

  /** Eliminar ECM */
  async deleteECM(idEcm) {
    return query('DELETE FROM elementos_config_metodologia WHERE id_ecm = ?', [idEcm]);
  }

  /**
   * Árbol completo: metodología → etapas → fases → ECM
   * @param {number} idMetodologia
   */
  async getArbolCompleto(idMetodologia) {
    const metodologia = await this.findById(idMetodologia);
    if (!metodologia) return null;

    const etapas = await this.getEtapas(idMetodologia);

    for (const etapa of etapas) {
      const fases = await this.getFases(etapa.id_etapa);
      for (const fase of fases) {
        fase.ecm = await this.getECM(fase.id_fase);
      }
      etapa.fases = fases;
    }

    metodologia.etapas = etapas;
    return metodologia;
  }
}

module.exports = new MetodologiaModel();
