const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registrar resultado institucional
router.post('/', async (req, res) => {
  const { unidad_educativa_id, materia_id, gestion, aprovechamiento, porcentaje_area } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO resultados_institucionales 
       (unidad_educativa_id, materia_id, gestion, aprovechamiento, porcentaje_area) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [unidad_educativa_id, materia_id, gestion, aprovechamiento, porcentaje_area]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar resultado' });
  }
});

// Listar resultados
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM resultados_institucionales');
  res.json(result.rows);
});

module.exports = router;
