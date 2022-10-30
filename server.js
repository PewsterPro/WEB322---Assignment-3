/*************************************************************************
* WEB322– Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hugh Kim Student ID: 141050211 Date: 2022-10-28
*
* Your app’s URL (from Heroku) :https://afternoon-shelf-26223.herokuapp.com/
* Your app’s URL (from Cyclic) :_______________________________________________
*
*************************************************************************/ 

const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dataService = require("./data-service");

const app = express();
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
});

app.get("/employees", function (req, res) {
    if(req.query.status){
        dataService.getEmployeesByStatus(req.query)
        .then((data) => {res.json(data);}).catch((err) => {
            console.log(err);res.json(err);
        });
    }
    else if(req.query.department){
        dataService.getEmployeesByDepartment(req.query)
        .then((data) => {res.json(data);}).catch((err) => {
            console.log(err);res.json(err);
        });
    }
    else if(req.query.manager){
        dataService.getEmployeesByManager(req.query)
        .then((data) => {res.json(data);}).catch((err) => {
            console.log(err);res.json(err);
        });
    }
    else {
        dataService.getAllEmployees(req.query)
        .then((data) => {res.json(data);}).catch((err) => {
            console.log(err);res.json(err);
        });
    }
});

app.get("/employee/:employeeNum", function (req, res) {
    dataService.getEmployeeByNum(req.params)
    .then((data) => {res.json(data);}).catch((err) => {
        console.log(err);res.json(err);
    })
});

app.get("/departments", function(req,res){
    dataService.getDepartments()
    .then((data) => {res.json(data);}).catch((err) => {
        console.log(err);res.json(err);
    })
});

app.get("/managers", function(req,res){
    dataService.getManagers()
    .then((data) => {res.json(data);}).catch((err) => {
        console.log(err);res.json(err);
    })
});

app.get("/employees/add", (req, res) => {
    res.sendFile(__dirname + "/views/addEmployee.html");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/employees/add", function(req,res){
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});


app.get("/images/add", (req, res) => {
    res.sendFile(__dirname + "/views/addImage.html");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });

  app.get("/images",function(req, res){
    fs.readdir("./public/images/uploaded", function(err, items)
    {res.json( {"images": items});});
});

app.use(express.static('public'));
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"/views/error404.html"));})


dataService.initialize()
    .then(() => {
        app.listen(8080, onHttpStart);
    }).catch((err) => {
        console.log(err);
    });