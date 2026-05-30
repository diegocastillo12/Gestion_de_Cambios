/**
 * seed.js
 * Script para poblar la base de datos con las metodologías (RUP y Scrum),
 * el proyecto demo "ZOFRA TACNA", asignación de equipo y cronograma inicial.
 */

'use strict';

require('dotenv').config();
const mysql = require('mysql2/promise');

async function seed() {
  console.log('Iniciando poblamiento de base de datos...');
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };

  const connection = await mysql.createConnection(config);

  try {
    // Desactivar temporalmente foreign key checks para limpiar de forma segura
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // 1. Limpiar metodologías existentes
    console.log('Limpiando metodologías demo previas...');
    await connection.query('DELETE FROM metodologias WHERE nombre IN (?, ?)', ['RUP (Rational Unified Process)', 'Scrum']);

    // 2. Limpiar proyecto demo previo si existe
    console.log('Limpiando proyecto demo "ZOFRA TACNA" previo...');
    const [existingProj] = await connection.query('SELECT id_proyecto FROM proyectos WHERE nombre = ?', ['ZOFRA TACNA']);
    if (existingProj.length > 0) {
      const idProj = existingProj[0].id_proyecto;
      await connection.query('DELETE FROM cronograma_actividades WHERE id_proyecto = ?', [idProj]);
      await connection.query('DELETE FROM proyecto_equipo WHERE id_proyecto = ?', [idProj]);
      await connection.query('DELETE FROM proyecto_clientes WHERE id_proyecto = ?', [idProj]);
      await connection.query('DELETE FROM proyectos WHERE id_proyecto = ?', [idProj]);
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 3. Insertar Metodología RUP
    console.log('Insertando Metodología RUP...');
    const [resRup] = await connection.query(
      'INSERT INTO metodologias (nombre, descripcion) VALUES (?, ?)',
      ['RUP (Rational Unified Process)', 'Metodología tradicional de desarrollo de software basada en fases y casos de uso.']
    );
    const idRup = resRup.insertId;

    // Etapas RUP
    const etapasRup = [
      { nombre: 'Iniciación', orden: 1, desc: 'Definición del alcance del proyecto y casos de negocio.' },
      { nombre: 'Elaboración', orden: 2, desc: 'Planificación de actividades y diseño de la arquitectura base.' },
      { nombre: 'Construcción', orden: 3, desc: 'Desarrollo del producto e implementación del software.' },
      { nombre: 'Transición', orden: 4, desc: 'Pruebas finales, despliegue y entrega al usuario final.' }
    ];

    const fasesRup = {
      'Iniciación': [
        {
          nombre: 'Concepción y Requerimientos',
          orden: 1,
          ecms: [
            { nombre: 'Documento Visión', tipo: 'Documento', desc: 'Define el alcance general y las necesidades del negocio.' },
            { nombre: 'Especificación de Requerimientos de Software (SRS)', tipo: 'Documento', desc: 'Requisitos funcionales y no funcionales detallados.' },
            { nombre: 'Diagrama de Casos de Uso', tipo: 'Diagrama', desc: 'Representación visual de los actores e interacciones del sistema.' }
          ]
        }
      ],
      'Elaboración': [
        {
          nombre: 'Arquitectura y Diseño',
          orden: 1,
          ecms: [
            { nombre: 'Documento de Arquitectura de Software (SAD)', tipo: 'Documento', desc: 'Descripción del diseño arquitectónico del sistema.' },
            { nombre: 'Diagrama de Clases', tipo: 'Diagrama', desc: 'Modelo estático de la estructura del sistema.' },
            { nombre: 'Diagrama de Secuencia', tipo: 'Diagrama', desc: 'Modelo dinámico del flujo de interacción entre objetos.' }
          ]
        }
      ],
      'Construcción': [
        {
          nombre: 'Desarrollo y Pruebas Unitarias',
          orden: 1,
          ecms: [
            { nombre: 'Código Fuente', tipo: 'Codigo', desc: 'Implementación del código del sistema.' },
            { nombre: 'Plan de Pruebas Unitarias', tipo: 'Prueba', desc: 'Pruebas automatizadas de lógica interna.' }
          ]
        }
      ],
      'Transición': [
        {
          nombre: 'Despliegue y Cierre',
          orden: 1,
          ecms: [
            { nombre: 'Manual de Usuario', tipo: 'Documento', desc: 'Guía de uso para el usuario final.' },
            { nombre: 'Plan de Despliegue', tipo: 'Documento', desc: 'Pasos y requerimientos para subir a producción.' }
          ]
        }
      ]
    };

    // Mapeo para guardar IDs de fases de RUP para usarlas en el cronograma
    let idFaseConcepcion = null;
    let idFaseArquitectura = null;

    for (const et of etapasRup) {
      const [resEt] = await connection.query(
        'INSERT INTO etapas (id_metodologia, nombre, orden, descripcion) VALUES (?, ?, ?, ?)',
        [idRup, et.nombre, et.orden, et.desc]
      );
      const idEt = resEt.insertId;

      const fases = fasesRup[et.nombre] || [];
      for (const fa of fases) {
        const [resFa] = await connection.query(
          'INSERT INTO fases (id_etapa, nombre, orden) VALUES (?, ?, ?)',
          [idEt, fa.nombre, fa.orden]
        );
        const idFa = resFa.insertId;

        if (et.nombre === 'Iniciación') idFaseConcepcion = idFa;
        if (et.nombre === 'Elaboración') idFaseArquitectura = idFa;

        for (const ec of fa.ecms) {
          await connection.query(
            'INSERT INTO elementos_config_metodologia (id_fase, nombre, tipo, descripcion) VALUES (?, ?, ?, ?)',
            [idFa, ec.nombre, ec.tipo, ec.desc]
          );
        }
      }
    }

    // 4. Insertar Metodología Scrum
    console.log('Insertando Metodología Scrum...');
    const [resScrum] = await connection.query(
      'INSERT INTO metodologias (nombre, descripcion) VALUES (?, ?)',
      ['Scrum', 'Metodología ágil para la gestión de proyectos de desarrollo de software basada en iteraciones (sprints).']
    );
    const idScrum = resScrum.insertId;

    // Etapas Scrum
    const etapasScrum = [
      { nombre: 'Planificación', orden: 1, desc: 'Definición del product backlog inicial y alcance general.' },
      { nombre: 'Sprints', orden: 2, desc: 'Desarrollo iterativo e incremental del software.' },
      { nombre: 'Cierre de Sprint', orden: 3, desc: 'Revisión del incremento y retrospectiva.' }
    ];

    const fasesScrum = {
      'Planificación': [
        {
          nombre: 'Preparación del Backlog',
          orden: 1,
          ecms: [
            { nombre: 'Product Backlog', tipo: 'Documento', desc: 'Lista priorizada de características del producto.' },
            { nombre: 'Historias de Usuario (User Stories)', tipo: 'Documento', desc: 'Requerimientos descritos desde la perspectiva del usuario.' }
          ]
        }
      ],
      'Sprints': [
        {
          nombre: 'Ejecución del Sprint',
          orden: 1,
          ecms: [
            { nombre: 'Sprint Backlog', tipo: 'Documento', desc: 'Tareas seleccionadas para el sprint actual.' },
            { nombre: 'Código Incremental', tipo: 'Codigo', desc: 'Entregable funcional desarrollado durante el sprint.' },
            { nombre: 'Criterios de Aceptación', tipo: 'Documento', desc: 'Condiciones que debe cumplir el incremento.' }
          ]
        }
      ],
      'Cierre de Sprint': [
        {
          nombre: 'Revisión y Retrospectiva',
          orden: 1,
          ecms: [
            { nombre: 'Reporte de Sprint Review', tipo: 'Documento', desc: 'Resultado de la demo del incremento ante el Product Owner.' },
            { nombre: 'Plan de Acción Retrospectiva', tipo: 'Documento', desc: 'Mejoras a implementar en el siguiente sprint.' }
          ]
        }
      ]
    };

    for (const et of etapasScrum) {
      const [resEt] = await connection.query(
        'INSERT INTO etapas (id_metodologia, nombre, orden, descripcion) VALUES (?, ?, ?, ?)',
        [idScrum, et.nombre, et.orden, et.desc]
      );
      const idEt = resEt.insertId;

      const fases = fasesScrum[et.nombre] || [];
      for (const fa of fases) {
        const [resFa] = await connection.query(
          'INSERT INTO fases (id_etapa, nombre, orden) VALUES (?, ?, ?)',
          [idEt, fa.nombre, fa.orden]
        );
        const idFa = resFa.insertId;

        for (const ec of fa.ecms) {
          await connection.query(
            'INSERT INTO elementos_config_metodologia (id_fase, nombre, tipo, descripcion) VALUES (?, ?, ?, ?)',
            [idFa, ec.nombre, ec.tipo, ec.desc]
          );
        }
      }
    }

    // 5. Crear Proyecto Demo "ZOFRA TACNA"
    console.log('Insertando Proyecto "ZOFRA TACNA"...');
    const [resProj] = await connection.query(
      `INSERT INTO proyectos (nombre, descripcion, estado, fecha_inicio, fecha_fin, id_admin, id_metodologia)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'ZOFRA TACNA',
        'PROYECTO PARA LA EMPRESA DE ZOFRA TACNA',
        'Activo',
        '2026-06-01',
        '2026-12-31',
        8, // Admin Sistema (admin@upt.pe)
        idRup // Metodología RUP
      ]
    );
    const idProj = resProj.insertId;

    // 6. Asignar Equipo del Proyecto
    console.log('Asignando equipo al proyecto...');
    const equipo = [
      { id_usuario: 3, rol: 'Líder Técnico' },             // Diego Fernando Castillo Mamani
      { id_usuario: 4, rol: 'Desarrollador Asignado' },    // Gregory Brandon Huanca Merma
      { id_usuario: 5, rol: 'Equipo QA / Tester' },        // César Nikolas Camac Meléndez
      { id_usuario: 2, rol: 'Gestor de Configuración' }    // Sergio Alberto Colque Ponce
    ];

    for (const eq of equipo) {
      await connection.query(
        'INSERT INTO proyecto_equipo (id_proyecto, id_usuario, rol_en_proyecto) VALUES (?, ?, ?)',
        [idProj, eq.id_usuario, eq.rol]
      );
    }

    // 7. Asignar Clientes del Proyecto
    console.log('Asignando cliente al proyecto...');
    await connection.query(
      'INSERT INTO proyecto_clientes (id_proyecto, id_usuario) VALUES (?, ?)',
      [idProj, 1] // Docente Evaluador UPT
    );

    // 8. Crear Cronograma de Actividades inicial
    console.log('Insertando actividades del cronograma...');
    const actividades = [
      {
        nombre: 'Elaborar Documento Visión',
        descripcion: 'Redacción del alcance inicial y objetivos del negocio.',
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-15',
        es_reportable: 1,
        porcentaje_avance: 100.00,
        estado: 'Completado',
        id_fase: idFaseConcepcion
      },
      {
        nombre: 'Especificar Requerimientos (SRS)',
        descripcion: 'Modelado de requisitos detallados de software.',
        fecha_inicio: '2026-06-16',
        fecha_fin: '2026-06-30',
        es_reportable: 1,
        porcentaje_avance: 50.00,
        estado: 'En Progreso',
        id_fase: idFaseConcepcion
      },
      {
        nombre: 'Definir Modelo de Casos de Uso',
        descripcion: 'Modelado de diagramas de casos de uso y documentación de escenarios.',
        fecha_inicio: '2026-07-01',
        fecha_fin: '2026-07-15',
        es_reportable: 1,
        porcentaje_avance: 0.00,
        estado: 'Pendiente',
        id_fase: idFaseConcepcion
      },
      {
        nombre: 'Diseñar Arquitectura (SAD)',
        descripcion: 'Definición del documento de arquitectura de software y diagramas clave.',
        fecha_inicio: '2026-07-16',
        fecha_fin: '2026-08-15',
        es_reportable: 1,
        porcentaje_avance: 0.00,
        estado: 'Pendiente',
        id_fase: idFaseArquitectura
      }
    ];

    for (const act of actividades) {
      await connection.query(
        `INSERT INTO cronograma_actividades
         (id_proyecto, id_fase, nombre, descripcion, fecha_inicio, fecha_fin, es_reportable, porcentaje_avance, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idProj,
          act.id_fase,
          act.nombre,
          act.descripcion,
          act.fecha_inicio,
          act.fecha_fin,
          act.es_reportable,
          act.porcentaje_avance,
          act.estado
        ]
      );
    }

    console.log('¡Base de datos poblada exitosamente con datos de prueba!');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await connection.end();
  }
}

seed();
