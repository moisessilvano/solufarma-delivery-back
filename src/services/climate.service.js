'use strict'

const axios = require('axios').default;

exports.getInfo = async () => {
    return new Promise(async (res, rej) => {
        const climate = await axios.get('http://apiadvisor.climatempo.com.br/api/v1/weather/locale/3477/current?token=fbbdbdaee4618a662d4fc67e52a36d83');
        let temperature;

        if (climate && climate.data && climate.data.data) {
            temperature = climate.data.data.temperature;
        } else {
            rej(null);
        }

        res({
            minTemperature: temperature,
            maxTemperature: temperature,
            minHumidity: 20,
            maxHumidity: 70
        });
    })
}