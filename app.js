const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");


const app = express();

const port = process.env.PORT || 6000

app.get('/', (req, res) => {
    res.send("Hello");
});



app.listen(port, () => {
    console.log("Server is running at " + port);
});