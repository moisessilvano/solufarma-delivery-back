'use strict'

const repository = require('../repositories/delivery.repository');
const errorEnum = require('../enums/error.enum');
const climareService = require('../services/climate.service');
const authService = require('../services/auth.service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
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
        var data = await repository.getByOrder(order);
        res.status(200).send(data);
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
        await repository.create(req.body);
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

        if (delivery && delivery.deliveredUser) {
            return res.status(400).send({
                message: 'Essa entrega já foi efetuada por ' + delivery.deliveredUser.name
            })
        }

        const climateInfo = climareService.getInfo();
        await repository.update(id, {
            ...climateInfo,
            deliveredUser: dataToken._id,
            deliveredIn: new Date()
        });
        res.status(201).send(climateInfo);
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
