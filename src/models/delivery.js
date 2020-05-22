'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    orderCode: {
        type: String,
        required: true
    },
    requestCode: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    fullAddress: {
        type: String,
        required: true,
    },
    customerCode: {
        type: String
    },
    customerName: {
        type: String,
        required: true,
    },

    departureDateTime: {
        type: String,
    },
    departureTemperature: {
        type: String,
    },

    arrivalDateTime: {
        type: String,
    },
    arrivalTemperature: {
        type: String,
    },

    receivedBy: {
        type: String,
    },

    status: {
        type: String,
        enum: ['canceled', 'pending', 'motoboy', 'delivered'],
        default: 'pending'
    },

    deliveredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updateAt: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Delivery', schema);