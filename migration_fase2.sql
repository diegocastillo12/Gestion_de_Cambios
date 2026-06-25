-- ============================================================
-- MIGRACIÓN FASE 2 — Vínculo Ticket → Requisito / ECM / Etapa
-- Ejecutar una sola vez en la base de datos
-- ============================================================

ALTER TABLE `solicitudes_cambio`
  ADD COLUMN `id_ecm_afectado`     INT          DEFAULT NULL AFTER `modulos_afectados`,
  ADD COLUMN `id_etapa_afectada`   INT          DEFAULT NULL AFTER `id_ecm_afectado`,
  ADD COLUMN `requisito_afectado`  VARCHAR(400) DEFAULT NULL AFTER `id_etapa_afectada`;

ALTER TABLE `solicitudes_cambio`
  ADD CONSTRAINT `fk_sc_ecm_afectado`
    FOREIGN KEY (`id_ecm_afectado`)
    REFERENCES `elementos_config_metodologia`(`id_ecm`)
    ON DELETE SET NULL,
  ADD CONSTRAINT `fk_sc_etapa_afectada`
    FOREIGN KEY (`id_etapa_afectada`)
    REFERENCES `etapas`(`id_etapa`)
    ON DELETE SET NULL;
