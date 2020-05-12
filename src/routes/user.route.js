'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authService = require('../services/auth.service');

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', authService.authorize, controller.create);
router.put('/:id', authService.authorize, controller.update);
router.delete('/:id', authService.authorize, controller.delete);

module.exports = router;