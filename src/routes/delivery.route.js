'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/delivery.controller');
const authService = require('../services/auth.service');

router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.get('/getByOrder/:order', authService.authorize, controller.getByOrder);
router.post('/', authService.authorize, controller.create);
router.put('/:id', authService.authorize, controller.update);
router.put('/completeDelivery/:id', authService.authorize, controller.completeDelivery);
router.delete('/:id', authService.authorize, controller.delete);

module.exports = router;