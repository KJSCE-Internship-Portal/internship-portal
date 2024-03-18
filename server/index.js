const express = require("express");
const https = require("https");
const fs = require("fs");
const dotenv = require("dotenv").config({ path: './config.env'});
const app = express();
const http = require('http');
const colors = require("colors");
const cors = require('cors');
const path = require('path');
const router = require("./routes/router")
const connectDB = require("./database/db");
const cookieParser = require('cookie-parser');

// Initiall Set Up
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
app.use("/api",router);

// Connecting to Database
connectDB()

var options = {
    key: fs.readFileSync('./_.somaiya.edu/server.key', 'utf-8').toString(),
    cert: fs.readFileSync('./_.somaiya.edu/c3976ebe92e975c9.crt', 'utf-8').toString(),
    ca: [fs.readFileSync('./_.somaiya.edu/ca1.crt', 'utf-8').toString(),fs.readFileSync('./_.somaiya.edu/ca2.crt', 'utf-8').toString(),fs.readFileSync('./_.somaiya.edu/ca3.crt', 'utf-8').toString()]
  };

const PORT = process.env.PORT || 5000;

const httpsServer = https.createServer(options, app);

httpsServer.listen(PORT, (req, res) => {
    console.log(`Server running on Port ${PORT} with HTTPS`.yellow.bold);
});
