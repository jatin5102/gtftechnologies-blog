require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./Routes');
app.use(express.json({ limit: '100mb' })); // Parse JSON
app.use(express.urlencoded({ limit: '100mb', extended: true })); // Parse form data


app.use(
    cors({
        origin: ["http://localhost:3000", "https://blog.gtftechnologies.com"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use('/uploads', express.static('uploads'));
app.use('/', routes);


module.exports = app;
