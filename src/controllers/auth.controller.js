'use strict'

const repository = require('../repositories/user.repository');
const errorEnum = require('../enums/error.enum');
const passwordService = require('../services/password.service');
const authService = require('../services/auth.service');

exports.token = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await repository.auth(username, passwordService.encript(password));
        if (!user) res.status(401).send();

        const token = await authService.generateToken({
            _id: user._id,
            username: user.username,
            type: user.type
        });

        res.status(200).send({
            token
        });
    } catch (e) {
        res.status(500).send({
            message: errorEnum.REQUEST_ERROR,
            error: e
        });
    }
};

