const express = require("express");
const router = express.Router();
const pool = require("../db/db");

const ADMIN_EMAIL = "sorcrar@gmail.com";

/**
 * Middleware simple de seguridad
 */
function isAdmin(req, res, next) {
  const adminEmail = req.headers["x-admin-email"];

  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({
      message: "Acceso denegado"
    });
  }

  next();
}

/**
 * Obtener usuarios pendientes
 */
router.get("/pending", isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, status, created_at
       FROM users
       WHERE status = 'pending'
       ORDER BY created_at ASC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("ERROR PENDING USERS:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

/**
 * Aprobar usuario
 */
router.post("/approve", isAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    await pool.query(
      `UPDATE users
       SET status = 'approved'
       WHERE email = $1`,
      [email]
    );

    res.json({ message: "Usuario aprobado" });
  } catch (err) {
    console.error("ERROR APPROVE:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

/**
 * Rechazar usuario
 */
router.post("/reject", isAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    await pool.query(
      `DELETE FROM users
       WHERE email = $1`,
      [email]
    );

    res.json({ message: "Usuario rechazado" });
  } catch (err) {
    console.error("ERROR REJECT:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

module.exports = router;
