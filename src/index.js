const express = require('express');
const cors = require('cors');
const unidadesRoutes = require('./routes/unidades');
const materiasRoutes = require('./routes/materias');
const resultadosRoutes = require('./routes/resultados');
const reportesRoutes = require('./routes/reportes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/unidades', unidadesRoutes);
app.use('/materias', materiasRoutes);
app.use('/resultados', resultadosRoutes);
app.use('/reportes', reportesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

// Endpoint de prueba
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
