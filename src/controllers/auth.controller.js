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

