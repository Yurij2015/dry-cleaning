const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "db_drycleaning",
    password: "root3004917779"
});

app.set("view engine", "hbs");

// получение списка записей
app.get("/admin", function (req, res) {
    pool.query("SELECT * FROM orders", function (err, data) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            pages: data
        });
    });
});

// получение списка заказов
app.get("/orders", function (req, res) {
    pool.query("SELECT * FROM orders", function (err, data) {
        if (err) return console.log(err);
        res.render("orders.hbs", {
            pages: data
        });
    });
});

// возвращаем форму для добавления данных
app.get("/create", function (req, res) {
    res.render("create.hbs");
});
// получаем отправленные данные и добавляем их в БД
app.post("/create", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const menu_name = req.body.menu_name;
    const content = req.body.content;
    pool.query("INSERT INTO orders (menu_name, content) VALUES (?,?)", [menu_name, content], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/admin");
    });
});

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function (req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM orders WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.render("edit.hbs", {
            pages: data[0]
        });
    });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const menu_name = req.body.menu_name;
    const content = req.body.content;
    const id = req.body.id;

    pool.query("UPDATE orders SET menu_name=?, content=? WHERE id=?", [menu_name, content, id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/admin");
    });
});

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function (req, res) {

    const id = req.params.id;
    pool.query("DELETE FROM orders WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/admin");
    });
});


app.use(express.static(__dirname + "/"))
app.use(express.static(__dirname + "/css"))
app.use(express.static(__dirname + "/images"))
app.use(express.static(__dirname + "/js"))
app.use(express.static(__dirname + "/admin"))

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});