'use strict'

const repository = require('../repositories/delivery.repository');
const errorEnum = require('../enums/error.enum');
const climareService = require('../services/climate.service');
const authService = require('../services/auth.service');
const moment = require('moment-timezone');
moment.tz.setDefault("America/brasilia");

const fs = require('fs');
const md5 = require('md5');

exports.get = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit);
        if (limit === 0) { limit = 30; }
        let skip = parseInt(req.query.skip);
        if (skip === 0) { limit = 0; }

        var data = await repository.get(limit, skip);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.getByOrder = async (req, res, next) => {
    try {
        const { order } = req.params;
        var data = await repository.getByRequestCode(order);

        data ? res.status(200).send(data) : res.status(400).send();
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.getByMotoboy = async (req, res, next) => {
    try {
        const { user } = req.params;
        var data = await repository.getByMotoboy(user);
        data ? res.status(200).send(data) : res.status(200).send([]);
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.getByParams = async (req, res, next) => {
    try {
        const { initialDate, finalDate, customerName, requestCode, exportFile } = req.query;

        if (!initialDate && !customerName && !requestCode) {
            if (!exportFile) {
                res.status(400).send({
                    message: 'Insira um valor no formulário de pesquisa!'
                });
                return;
            }
        }

        const deliveries = await repository.getByParams(initialDate, finalDate, customerName, requestCode);

        if (!exportFile) {
            res.status(200).send(deliveries);
            return;
        }

        // Require library
        var excel = require('excel4node');

        // Create a new instance of a Workbook class
        var workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var worksheet = workbook.addWorksheet('Relatório');

        const styleHeader = workbook.createStyle({
            font: {
                color: '#000000',
                size: 10,
                bold: true,
            },
            // fill: {
            //     bgColor: '#FFFF00'
            // },
            border: {
                bottom: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                left: {
                    style: 'thin',
                    color: '#000000'
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
            }
        });

        const styleData = workbook.createStyle({
            font: {
                color: '#000000',
                size: 10
            },
            border: {
                bottom: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                left: {
                    style: 'thin',
                    color: '#000000'
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
            }
        });

        worksheet.column(2).setWidth(10);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(10);
        worksheet.column(4).setWidth(12);
        worksheet.column(5).setWidth(16);
        worksheet.column(6).setWidth(13);
        worksheet.column(7).setWidth(15);
        worksheet.column(8).setWidth(18);

        worksheet.cell(1, 1).string('NR.REQ').style(styleHeader);
        worksheet.cell(1, 2).string('Nome do Paciente').style(styleHeader);
        worksheet.cell(1, 3).string('Data da Saída').style(styleHeader);
        worksheet.cell(1, 4).string('Horário de Saída').style(styleHeader);
        worksheet.cell(1, 5).string('Temperatura de Saída').style(styleHeader);
        worksheet.cell(1, 6).string('Data de Entrega').style(styleHeader);
        worksheet.cell(1, 7).string('Horário de Entrega').style(styleHeader);
        worksheet.cell(1, 8).string('Temperatura de Entrega').style(styleHeader);

        const newDeliveries = deliveries.filter(d => d.status != 'canceled');

        newDeliveries.map((d, index) => {
            worksheet.cell(index + 2, 1).string(d.requestCode).style(styleData);
            worksheet.cell(index + 2, 2).string(d.customerName).style(styleData);

            worksheet.cell(index + 2, 3).string(d.departureDateTime ? moment(d.departureDateTime).format('DD/MM/YYYY') : '').style(styleData);
            worksheet.cell(index + 2, 4).string(d.departureDateTime ? moment(d.departureDateTime).format('HH:mm') : '').style(styleData);
            worksheet.cell(index + 2, 5).string(d.departureTemperature ? d.departureTemperature : '').style(styleData);

            worksheet.cell(index + 2, 6).string(d.arrivalDateTime ? moment(d.arrivalDateTime).format('DD/MM/YYYY') : '').style(styleData);
            worksheet.cell(index + 2, 7).string(d.arrivalDateTime ? moment(d.arrivalDateTime).format('HH:mm') : '').style(styleData);
            worksheet.cell(index + 2, 8).string(d.arrivalTemperature ? d.arrivalTemperature : '').style(styleData);
        });

        const fileName = 'relatorio.xlsx';
        workbook.write(fileName, res);

    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        var data = await repository.getById(id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.create = async (req, res, next) => {
    try {
        const body = req.body;

        const newBody = {
            ...body,
            deliveryDate: moment(body.deliveryDate).toISOString()
        };

        await repository.create({
            deliveryDate: newBody.deliveryDate,
            orderCode: newBody.orderCode,
            requestCode: newBody.requestCode,
            customerName: newBody.customerName,
            fullAddress: newBody.fullAddress
        });
        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;

        await repository.update(id, req.body);
        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.completeDelivery = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const dataToken = await authService.decodeToken(token);

    try {
        const { id } = req.params;

        const delivery = await repository.getById(id);

        if (delivery && delivery.status == 'delivered') {
            return res.status(400).send({
                message: 'Essa entrega já foi efetuada por ' + delivery.deliveredUser.name
            })
        }

        const temperature = await climareService.getInfo();

        const newData = {
            deliveredUser: dataToken._id,
            arrivalDateTime: moment().toISOString(),
            arrivalTemperature: temperature,
            status: 'delivered',
            ...req.body
        }

        await repository.update(id, newData);

        req.app.io.emit('deliveries', {
            _id: delivery._id,
            orderCode: delivery.orderCode,
            requestCode: delivery.requestCode,
            customerName: delivery.customerName,
            fullAddress: delivery.fullAddress,
            ...newData,
            deliveredUser: {
                name: dataToken.name,
            }
        });

        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.releaseDelivery = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const dataToken = await authService.decodeToken(token);

    try {
        const { id } = req.params;
        const { deliveredUser } = req.body;

        const delivery = await repository.getById(id);

        if (delivery && delivery.deliveredUser) {
            return res.status(400).send({
                message: 'Essa entrega já foi efetuada por ' + delivery.deliveredUser.name
            })
        }

        const temperature = await climareService.getInfo();

        const newData = {
            departureDateTime: moment().toISOString(),
            departureTemperature: temperature,
            status: 'motoboy',
            deliveredUser
        }

        await repository.update(id, newData);

        const deliveryData = await repository.getById(id);

        req.app.io.emit('deliveries', deliveryData);

        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        await repository.delete(id);
        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};
