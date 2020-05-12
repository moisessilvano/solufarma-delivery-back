'use strict'

const mongoose = require('mongoose');
const Model = mongoose.model('User');

exports.get = async (limit, skip) => {
    const res = await Model.find({
        status: true
    }, 'name username createAt updateAt', { limit: limit, skip: skip });
    return res;
}

exports.getById = async (id) => {
    const res = await Model.findById(id, 'name username createAt updateAt');
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