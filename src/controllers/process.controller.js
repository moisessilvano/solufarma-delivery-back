'use strict'

const deliveryRepository = require('../repositories/delivery.repository');
const errorEnum = require('../enums/error.enum');
const romaneioService = require('../services/romaneio.service');
const fs = require('fs');

exports.importFile = async (req, res, next) => {
    var data = fs.readFileSync('romaneio.txt', 'utf8');
    const txtContent = data.toString();
    const deliveryList = romaneioService.getDeliveriesFromData(txtContent);
    const count = deliveryList.length;

    res.json({
        count,
        deliveryList
    });

    for (let i = 0; i < count; i++) {
        const d = deliveryList[i];
        console.log(i, d.orderCode);

        const delivery = await deliveryRepository.getByOrder(d.orderCode);
        if (delivery) {
            const result = await deliveryRepository.update(delivery._id, d);
            result ? console.log('ATUALIZADO') : console.log('NÃO ATUALIZADO');
        } else {
            const result = await deliveryRepository.create(d);
            result ? console.log('ADICIONADO') : console.log('NÃO ADICIONADO');
        }
    }

    return;
};

exports.test = async (req, res, next) => {
    var data = fs.readFileSync('romaneio.txt', 'utf8');
    const txtContent = data.toString();
    const deliveryList = romaneioService.getDeliveriesFromData(txtContent);

    // deliveryList.map((d, index) => {
    //     if (d && !d.deliveryDate) {
    //         console.log(index, d);
    //     }
    // })

    // const d = deliveryList[13];

    // console.log(d);

    res.json({
        qnt: deliveryList.length,
        deliveryList
    });

    return;
};