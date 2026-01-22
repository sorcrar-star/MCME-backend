const app = require("./app");
const pool = require("./db/db");

const PORT = process.env.PORT || 3001;

pool.query("SELECT NOW()")
  .then(() => console.log("🟢 PostgreSQL conectado correctamente"))
  .catch(err => console.error("🔴 Error conectando a PostgreSQL", err));

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
