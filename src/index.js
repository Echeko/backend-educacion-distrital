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
      "INSERT INTO unidades (nombre, sie, distrito, gestion) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, sie, distrito, gestion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear unidad educativa:", error.message);
    res.status(500).json({ error: "Error al crear unidad educativa" });
  }
});

app.get("/unidades", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM unidades ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener unidades educativas:", error.message);
    res.status(500).json({ error: "Error al obtener unidades educativas" });
  }
});

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
    console.error("Error al actualizar unidad educativa:", error.message);
    res.status(500).json({ error: "Error al actualizar unidad educativa" });
  }
});

app.delete("/unidades