const express = require("express");
const router = express.Router();

const {
  readUsers,
  writeUsers
} = require("../data/users.store");

// =======================
// REGISTRO
// =======================
router.post("/register", (req, res) => {
  const {
    nombres,
    apellidos,
    nacimiento,
    username,
    email,
    password
  } = req.body;

  if (
    !nombres ||
    !apellidos ||
    !nacimiento ||
    !username ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      message: "Datos incompletos"
    });
  }

  const data = readUsers();

  const exists = data.users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({
      message: "Este correo ya está registrado"
    });
  }

  data.users.push({
    nombres,
    apellidos,
    nacimiento,
    username,
    email,
    password, // luego ciframos
    status: "pending",
    createdAt: new Date().toISOString()
  });

  writeUsers(data);

  res.json({
    message:
      "Tu cuenta será aprobada en un lapso de 24 horas. Si no es aprobada, escribe a soporte: sorcrar@gmail.com"
  });
});

// =======================
// LOGIN
// =======================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const data = readUsers();
  const user = data.users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      message: "Correo o contraseña incorrectos"
    });
  }

  if (user.status !== "approved") {
    return res.status(403).json({
      message:
        "Tu cuenta aún no ha sido aprobada. Si ya pasaron 24 horas, contacta a soporte."
    });
  }

  res.json({
    message: "Login exitoso",
    user: {
      email: user.email,
      username: user.username
    }
  });
});

module.exports = router;
