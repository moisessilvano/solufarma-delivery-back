'use strict'

const repository = require('../repositories/user.repository');
const errorEnum = require('../enums/error.enum');

exports.token = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await repository.auth(username, password);
        if (!user) res.status(201).send();

        res.status(200).send({
            token: null
        });
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

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
