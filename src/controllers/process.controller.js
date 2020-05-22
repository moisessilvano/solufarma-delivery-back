'use strict'

const deliveryRepository = require('../repositories/delivery.repository');
const errorEnum = require('../enums/error.enum');
const romaneioService = require('../services/romaneio.service');
const fs = require('fs');

exports.importFile = async (req, res, next) => {

    const { filename } = req.file;

    const path = './uploads/' + filename;

    var data = fs.readFileSync(path, 'utf8');
    const txtContent = data.toString();
    const deliveryList = romaneioService.getDeliveriesFromData(txtContent);
    const count = deliveryList.length;

    res.json({
        count,
        deliveryList
    });

    let qntUpdated = 0;
    let qntAdded = 0;
    let qntNotUpdated = 0;
    let qntNotAdded = 0;
    let qntRemaining = count;

    for (let i = 0; i < count; i++) {
        qntRemaining--;

        const d = deliveryList[i];
        console.log(i, d.orderCode);

        const delivery = await deliveryRepository.getByParams({
            orderCode: d.orderCode,
            requestCode: d.requestCode
        });
        if (delivery) {
            const result = await deliveryRepository.update(delivery._id, d);
            if (result) {
                qntUpdated++;
            } else {
                qntNotUpdated++;
            }
        } else {
            const result = await deliveryRepository.create(d);
            if (result) {
                qntAdded++;
            } else {
                qntNotAdded++;
            }
        }

        req.app.io.emit('upload', {
            status: 'pending',
            count,
            qntUpdated,
            qntNotUpdated,
            qntAdded,
            qntNotAdded,
            qntRemaining
        });
    }

    req.app.io.emit('upload', {
        status: 'finish',
        count,
        qntUpdated,
        qntNotUpdated,
        qntAdded,
        qntNotAdded,
        qntRemaining
    });

    fs.unlink(path, function (err) {

    });

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