import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🧩 Endpoint de prueba
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});


// 🏫 CRUD de Unidades Educativas
app.post("/unidades", async (req, res) => {
  const { nombre, sie, distrito, gestion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO unidades_educativas (nombre, sie, distrito, gestion) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, sie, distrito, gestion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear unidad educativa" });
  }
});

app.get("/unidades", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM unidades_educativas ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener unidades educativas" });
  }
});

app.put("/unidades/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, sie, distrito, gestion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE unidades_educativas SET nombre=$1, sie=$2, distrito=$3, gestion=$4 WHERE id=$5 RETURNING *",
      [nombre, sie, distrito, gestion, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar unidad educativa" });
  }
});

app.delete("/unidades/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM unidades_educativas WHERE id=$1", [id]);
    res.json({ message: "Unidad educativa eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar unidad educativa" });
  }
});


// 📚 CRUD de Materias
app.post("/materias", async (req, res) => {
  const { nombre, area } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO materias (nombre, area) VALUES ($1, $2) RETURNING *",
      [nombre, area]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear materia" });
  }
});

app.get("/materias", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM materias ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener materias" });
  }
});


// 📊 Resultados Institucionales
app.post("/resultados", async (req, res) => {
  const { unidad_educativa_id, materia_id, gestion, aprovechamiento, porcentaje_area } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO resultados_institucionales (unidad_educativa_id, materia_id, gestion, aprovechamiento, porcentaje_area) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [unidad_educativa_id, materia_id, gestion, aprovechamiento, porcentaje_area]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar resultado institucional" });
  }
});

app.get("/resultados", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.nombre AS unidad_educativa,
        m.nombre AS materia,
        r.gestion,
        r.aprovechamiento,
        r.porcentaje_area
      FROM resultados_institucionales r
      JOIN unidades_educativas u ON r.unidad_educativa_id = u.id
      JOIN materias m ON r.materia_id = m.id
      ORDER BY u.nombre, m.nombre;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener resultados institucionales" });
  }
});


// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
