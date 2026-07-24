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
