'use strict'

const deliveryRepository = require('../repositories/delivery.repository');
const errorEnum = require('../enums/error.enum');
const romaneioService = require('../services/romaneio.service');
const fs = require('fs');

exports.importFile = async (req, res, next) => {
    var data = fs.readFileSync('romaneio.txt', 'utf8');
    const txtContent = data.toString();
    const deliveryList = romaneioService.getDeliveriesFromData(txtContent);

    res.json({
        qnt: deliveryList.length,
        deliveryList
    });
};