const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registrar materia
router.post('/', async (req, res) => {
  const { nombre, area } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO materias (nombre, area) VALUES ($1, $2) RETURNING *',
      [nombre, area]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar materia' });
  }
});

// Listar materias
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM materias');
  res.json(result.rows);
});

module.exports = router;
