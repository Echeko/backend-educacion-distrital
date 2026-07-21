const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registrar unidad educativa
router.post('/', async (req, res) => {
  const { nombre, sie, distrito, gestion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO unidades_educativas (nombre, sie, distrito, gestion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, sie, distrito, gestion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar unidad educativa' });
  }
});

// Listar unidades educativas
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM unidades_educativas');
  res.json(result.rows);
});

module.exports = router;
