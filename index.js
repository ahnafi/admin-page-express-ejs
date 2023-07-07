const express = require("express");
require("dotenv").config();
const db = require("./db/connection");
const response = require("./db/response");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
// app
const app = express();
const port = process.env.PORT;
const paket = process.env.DB_CRUD;
const auth = process.env.DB_AUTH;
// listen
app.listen(port, () => {
  console.log(`app run at port ${port}`);
});
// header
// Set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// middleware
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);
const login = (req, res, next) => {
  if (!req.session.isLoggedIn) res.redirect("/login");
  next();
};
// API
app.get("/datas", (req, res) => {
  const sql = `SELECT * FROM ${paket}`;
  db.query(sql, (err, fields) => {
    if (err) response(503, err, "error", res);
    response(200, fields, "select all datas", res);
  });
});
// routing
// halaman admin
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    const sql = `SELECT * FROM ${paket}`;
    db.query(sql, (err, fields) => {
      if (err) throw err;
      res.render("index", {
        title: "page admin ",
        username: req.session.username,
        data: fields,
      });
    });
  } else {
    res.redirect("/login");
  }
});
// login logout
app.get("/login", (req, res) => {
  res.render("login", {
    title: "login",
    error: "",
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/login");
  });
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sql = `SELECT * FROM ${auth} WHERE username = '${username}' AND password = '${password}'`;
  db.query(sql, (err, field) => {
    if (err) console.log(err.sqlMessage);
    if (field.length > 0) {
      req.session.isLoggedIn = true;
      req.session.username = username;
      res.redirect("/");
    } else {
      res.render("login", {
        title: "login page",
        error:
          "username or password is wrong,coba lagi atau hubungi pembuat web",
      });
    }
  });
});
//add data
app.get("/add", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("add", {
      title: "Tambah Data",
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/add", (req, res) => {
  const { judul, harga } = req.body;
  const sql = `INSERT INTO ${paket} (judul,harga) VALUES ('${judul}','${harga}')`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    if (fields.affectedRows == 1) {
      res.redirect("/");
    }
  });
});
// edit data
app.get("/edit/:id", (req, res) => {
  if (req.session.isLoggedIn) {
    const id = req.params.id;
    const sql = `SELECT * FROM ${paket} WHERE id = ${id}`;
    db.query(sql, (err, field) => {
      if (err) throw err;
      res.render("edit", {
        title: "edit Data",
        data: field[0],
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.put("/edit", (req, res) => {
  const { id, judul, harga } = req.body;
  const sql = `UPDATE ${paket} SET judul = '${judul}', harga = '${harga}' WHERE id = ${id}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    res.redirect("/");
  });
});
// delete
app.delete("/delete", (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const sql = `DELETE FROM ${paket} WHERE id = ${id}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    if (fields.affectedRows == 1) {
      res.redirect("/");
    }
  });
});
