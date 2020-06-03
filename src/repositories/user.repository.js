'use strict'

const mongoose = require('mongoose');
const Model = mongoose.model('User');

exports.auth = async (username, password) => {
    const res = await Model.findOne({
        username, password
    }, 'name username type createAt updateAt');
    return res;
}

exports.get = async () => {
    const res = await Model.find({
    }, 'name username type createAt updateAt');
    return res;
}

exports.getByType = async type => {
    const res = await Model.find({
        type
    }, 'name username type createAt updateAt');
    return res;
}

exports.getById = async (id) => {
    const res = await Model.findById(id, 'name username type createAt updateAt');
    return res;
}

exports.create = (data) => {
    var model = new Model(data);
    return model.save()
}

exports.update = (id, data) => {
    return Model
        .findByIdAndUpdate(id, {
            $set: {
                ...data,
                updateAt: Date.now()
            }
        })
}

exports.delete = (id) => {
    return Model
        .findByIdAndRemove(id);
}