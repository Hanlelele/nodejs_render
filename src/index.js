const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv.config()

const authRoute = require("./routes/auth");

const PORT = process.env.PORT || 8000

const conecctToDB = require("./configs/db");

const app = express()

//CONNECT DATABASE
conecctToDB();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    cors({
        origin: [
        "http://localhost:5173",

        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })  
);

app.use("/api/user", authRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})