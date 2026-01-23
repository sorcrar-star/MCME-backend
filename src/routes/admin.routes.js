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
 * ===============================
 * USUARIOS PENDIENTES
 * ===============================
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
 * ===============================
 * APROBAR USUARIO
 * ===============================
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
 * ===============================
 * RECHAZAR USUARIO (ELIMINAR)
 * ===============================
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

/**
 * ===============================
 * USUARIOS APROBADOS
 * ===============================
 */
router.get("/approved", isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, status, created_at
       FROM users
       WHERE status = 'approved'
       ORDER BY created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("ERROR APPROVED USERS:", error);
    res.status(500).json({ message: "Error al obtener usuarios aprobados" });
  }
});

/**
 * ===============================
 * QUITAR ACCESO (SUSPENDER)
 * ===============================
 */
router.post("/revoke", isAdmin, async (req, res) => {
  const { email } = req.body;

  try {
    await pool.query(
      `UPDATE users
       SET status = 'suspended'
       WHERE email = $1`,
      [email]
    );

    res.json({ message: "Acceso quitado correctamente" });
  } catch (error) {
    console.error("ERROR REVOKE:", error);
    res.status(500).json({ message: "Error al quitar acceso" });
  }
});

/**
 * ===============================
 * USUARIOS SUSPENDIDOS
 * ===============================
 */
router.get("/suspended", isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, status, created_at
       FROM users
       WHERE status = 'suspended'
       ORDER BY created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("ERROR SUSPENDED USERS:", error);
    res.status(500).json({ message: "Error al obtener usuarios suspendidos" });
  }
});

/**
 * ===============================
 * REACTIVAR USUARIO
 * ===============================
 */
router.post("/reactivate", isAdmin, async (req, res) => {
  const { email } = req.body;

  try {
    await pool.query(
      `UPDATE users
       SET status = 'approved'
       WHERE email = $1`,
      [email]
    );

    res.json({ message: "Usuario reactivado correctamente" });
  } catch (error) {
    console.error("ERROR REACTIVATE:", error);
    res.status(500).json({ message: "Error al reactivar usuario" });
  }
});

module.exports = router;
