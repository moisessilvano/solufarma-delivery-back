'use strict'

const repository = require('../repositories/user.repository');
const errorEnum = require('../enums/error.enum');

exports.token = async (req, res, next) => {
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
