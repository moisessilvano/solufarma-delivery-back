'use strict'

const mongoose = require('mongoose');
const Model = mongoose.model('Delivery');

exports.get = async () => {
    const res = await Model.find({},
        'orderCode date customerCode customerName minTemperature maxTemperature minHumidity maxHumidity deliveredIn deliveredUser createAt updateAt');
    return res;
}

exports.getById = async (id) => {
    const res = await Model.findById(id, 'orderCode date customerCode customerName minTemperature maxTemperature minHumidity maxHumidity deliveredIn deliveredUser createAt updateAt');
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