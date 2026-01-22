const express = require("express");
const router = express.Router();

const { readUsers, writeUsers } = require("../data/users.store");
const { ADMIN_EMAIL } = require("../config/admin.config");

// Middleware simple admin
function requireAdmin(req, res, next) {
  const adminEmail = req.headers["x-admin-email"];

  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({
      message: "Acceso denegado"
    });
  }

  next();
}

// =======================
// LISTAR USUARIOS PENDIENTES
// =======================
router.get("/pending", requireAdmin, (req, res) => {
  const data = readUsers();
  const pending = data.users.filter(u => u.status === "pending");
  res.json(pending);
});

// =======================
// APROBAR USUARIO
// =======================
router.post("/approve", requireAdmin, (req, res) => {
  const { email } = req.body;

  const data = readUsers();
  const user = data.users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  user.status = "approved";
  writeUsers(data);

  res.json({ message: "Usuario aprobado" });
});

// =======================
// RECHAZAR USUARIO
// =======================
router.post("/reject", requireAdmin, (req, res) => {
  const { email } = req.body;

  const data = readUsers();
  data.users = data.users.filter(u => u.email !== email);

  writeUsers(data);

  res.json({ message: "Usuario rechazado y eliminado" });
});

module.exports = router;
