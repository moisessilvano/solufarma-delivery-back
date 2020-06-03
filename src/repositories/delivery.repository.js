'use strict'

const mongoose = require('mongoose');
const Model = mongoose.model('Delivery');

exports.get = async (limit, skip) => {
    const res = await Model.find({},
        'orderCode requestCode deliveryDate fullAddress customerCode customerName status departureDateTime departureTemperature arrivalDateTime arrivalTemperature status deliveredUser createAt updateAt amountReceivable paymentMethod')
        .limit(limit)
        .skip(skip)
        .populate('deliveredUser', 'name username')
    return res;
}

exports.getById = async (id) => {
    const res = await Model.findById(id, 'orderCode requestCode deliveryDate fullAddress customerCode customerName status departureDateTime departureTemperature arrivalDateTime arrivalTemperature status deliveredUser createAt updateAt amountReceivable paymentMethod receivedBy')
        .populate('deliveredUser', 'name username');
    return res;
}

exports.getByOrder = async orderCode => {
    const res = await Model.findOne({
        orderCode
    },
        'orderCode deliveryDate fullAddress customerCode customerName status departureDateTime departureTemperature arrivalDateTime arrivalTemperature status deliveredUser createAt updateAt')
        .populate('deliveredUser', 'name username');
    return res;
}

exports.getByDate = async (date1, date2) => {
    let initialDate, finalDate;

    if (date1 && !date2) {
        initialDate = new Date(date1);
        finalDate = new Date(date1);
        finalDate.setDate(finalDate.getDate() + 1);

    }

    if (date1 && date2) {
        initialDate = new Date(date1);
        finalDate = new Date(date2)
        finalDate.setDate(finalDate.getDate() + 2);
    }

    const res = await Model.find(
        { "deliveryDate": { "$gte": initialDate, "$lt": finalDate } },
        'orderCode requestCode deliveryDate fullAddress customerCode customerName status departureDateTime departureTemperature arrivalDateTime arrivalTemperature status deliveredUser receivedBy createAt updateAt amountReceivable paymentMethod')
        .populate('deliveredUser', 'name username');
    return res;
}

exports.getByParams = async params => {
    const res = await Model.findOne(params,
        'orderCode deliveryDate fullAddress customerCode customerName status departureDateTime departureTemperature arrivalDateTime arrivalTemperature status deliveredUser createAt updateAt')
        .populate('deliveredUser', 'name username');
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