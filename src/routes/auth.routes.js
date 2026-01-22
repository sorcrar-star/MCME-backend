const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// =======================
// REGISTRO
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Datos incompletos"
      });
    }

    const exists = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );

    if (exists.rowCount > 0) {
      return res.status(409).json({
        message: "Este correo ya está registrado"
      });
    }

    await pool.query(
      `INSERT INTO users (name, email, password, status)
       VALUES ($1, $2, $3, 'pending')`,
      [name, email, password]
    );

    res.json({
      message:
        "Tu cuenta fue registrada y está pendiente de aprobación."
    });

  } catch (err) {
    console.error("ERROR REGISTER:", err);
    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
});

// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos"
      });
    }

    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Tu cuenta aún no ha sido aprobada"
      });
    }

    res.json({
      message: "Login exitoso",
      user: {
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error("ERROR LOGIN:", err);
    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
});

module.exports = router;
