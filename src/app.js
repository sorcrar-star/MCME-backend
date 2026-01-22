const express = require("express");
const cors = require("cors");

// rutas
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

// inicializar app PRIMERO
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend funcionando correctamente" });
});

module.exports = app;
