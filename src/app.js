'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

// Conecta ao banco
mongoose.connect(config.connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', true);

// Carrega os Models
require('./models/user');
require('./models/delivery');

// Carrega as rotas
const authRoute = require('./routes/auth.route');
const deliveryRoute = require('./routes/delivery.route');
const processRoute = require('./routes/process.route');
const userRoute = require('./routes/user.route');

app.use('/auth', authRoute);
app.use('/api/deliveries', deliveryRoute);
app.use('/api/process', processRoute);
app.use('/api/users', userRoute);

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

module.exports = app;