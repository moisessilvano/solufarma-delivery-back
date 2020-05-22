'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/process.controller');
const authService = require('../services/auth.service');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.txt')
    }
})

var upload = multer({ storage: storage })

router.post('/importFile', upload.single('file'), controller.importFile);
router.post('/test', controller.test);

module.exports = router;