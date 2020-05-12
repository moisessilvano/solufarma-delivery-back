'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/process.controller');
const authService = require('../services/auth.service');

router.post('/importFile', controller.importFile);

module.exports = router;