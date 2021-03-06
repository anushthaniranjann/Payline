let express = require("express");
const path = require('path');
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const port = process.env.PORT || 5000

dotenv.config();
let app = express();

app.use(express.static(path.join(__dirname, '')));

//creating instance
const instance = new Razorpay({

    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

//Middlewares
app.use(cors());
app.use(express.json());

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(bodyParser.json());

app.set('view engine', 'ejs');


//Routes

app.get('/about', (req, res) => {
    res.render('about');
})
app.get('/help', (req, res) => {
    res.render('help');
})

app.get("/payments", (req, res) => {
    res.render("payment", { key: process.env.KEY_ID });
});

app.post("/api/payment/order", (req, res) => {
    params = req.body;

    instance.orders
        .create(params)
        .then((data) => {
            res.send({ sub: data, status: "success" });
        })
        .catch((error) => {
            res.send({ sub: error, status: "failed" });
        });
});

app.post("/api/payment/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);

    var response = { status: "failure" };

    if (expectedSignature === req.body.razorpay_signature)
        response = { status: "success" };
    res.send(response);
});

app.get('/*', (req, res) => {
    res.status(400).render('error', { path: req.originalUrl, pageTitle: 'Page not found' });
});


app.listen(port, () => {
    console.log("Server is running at " + port);
});