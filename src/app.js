require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./Routes');
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data


app.use(
    cors({
        origin: ["http://localhost:3001", "https://blog.gtftechnologies.com"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use('/uploads', express.static('uploads'));
app.use('/', routes);


module.exports = app;
