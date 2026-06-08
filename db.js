import mysql from "mysql2/promise";

const conexion = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smarthunters_db"
});

export default conexion;