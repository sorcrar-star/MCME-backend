const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

const adminRoutes = require("./routes/admin.routes");

app.use("/api/admin", adminRoutes);


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend funcionando correctamente" });
});

module.exports = app;
