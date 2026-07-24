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

// Endpoint de prueba
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// 🏫 CRUD de Unidades Educativas

// Crear unidad educativa
app.post("/unidades", async (req, res) => {
  const { nombre, sie, distrito, gestion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO unidades (nombre, sie, distrito, gestion) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, sie, distrito, gestion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear unidad educativa" });
  }
});

// Listar unidades educativas
app.get("/unidades", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM unidades ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener unidades educativas" });
  }
});

// Actualizar unidad educativa
app.put("/unidades/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, sie, distrito, gestion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE unidades SET nombre=$1, sie=$2, distrito=$3, gestion=$4 WHERE id=$5 RETURNING *",
      [nombre, sie, distrito, gestion, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar unidad educativa" });
  }
});

// Eliminar unidad educativa
app.delete("/unidades/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM unidades WHERE id=$1", [id]);
    res.json({ message: "Unidad educativa eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar unidad educativa" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
