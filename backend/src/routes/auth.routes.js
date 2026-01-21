const express = require("express");
const router = express.Router();

const {
  readUsers,
  writeUsers
} = require("../data/users.store");

const {
  findUserByEmail,
  createUser
} = require("../services/users.service");

// REGISTRO
router.post("/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      message: "Datos incompletos"
    });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      message: "Este correo ya está registrado"
    });
  }

  createUser({
    email,
    password, // luego la ciframos
    name,
    status: "pending",
    createdAt: new Date().toISOString()
  });

  res.json({
    message:
      "Registro exitoso. Tu cuenta será validada en un plazo de 24 horas."
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();

  const user = users.find(u => u.email === email);

  // ❌ Usuario no existe
  if (!user) {
    return res.status(401).json({
      message: "Correo o contraseña incorrectos"
    });
  }

  // ❌ Contraseña incorrecta
  if (user.password !== password) {
    return res.status(401).json({
      message: "Correo o contraseña incorrectos"
    });
  }

  // ⛔ Usuario pendiente
  if (user.status === "pending") {
    return res.status(403).json({
      message: `Tu perfil con el correo ${email} aún no ha sido aprobado. 
Si ya pasaron 24 horas o crees que es un error, contacta a soporte.`
    });
  }

  // ✅ Usuario aprobado
  return res.json({
    message: "Login exitoso",
    user: {
      email: user.email,
      name: user.name
    }
  });
});


module.exports = router;
