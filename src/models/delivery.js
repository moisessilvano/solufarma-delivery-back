'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    orderCode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    customerCode: {
        type: String
    },
    fullAddress: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    minTemperature: {
        type: Number
    },
    maxTemperature: {
        type: Number
    },
    minHumidity: {
        type: Number
    },
    maxHumidity: {
        type: Number
    },
    deliveredIn: {
        type: Date,
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