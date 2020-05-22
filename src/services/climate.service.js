'use strict'

const axios = require('axios').default;
const NodeCache = require("node-cache");

const ttl = 60 * 60 * 1;

const myCache = new NodeCache({ stdTTL: ttl });

exports.getInfo = async () => {
    return new Promise(async (res, rej) => {
        let temperature;

        temperature = myCache.get("temperature");
        if (temperature) {
            res(temperature);
            return;
        }

        const climate = await axios.get('http://apiadvisor.climatempo.com.br/api/v1/weather/locale/3477/current?token=fbbdbdaee4618a662d4fc67e52a36d83');

        if (climate && climate.data && climate.data.data) {
            temperature = climate.data.data.temperature;

            if (temperature > 30) {
                temperature = 30;
            }
        } else {
            rej(null);
        }

        myCache.set("temperature", temperature)
        res(temperature);
    })
}