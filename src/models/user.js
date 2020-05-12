'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['admin', 'motoboy']
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

module.exports = mongoose.model('User', schema);