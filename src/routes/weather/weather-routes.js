const router = require('express').Router();
let apiKey = '65b7e266d5f36677a9b6664e46c0ca6f';
const request = require('request');

router.post('/get_weather', function (req, res) {
    town = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${town}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if (err) {
            res.status(503)
            res.send({
                error: 'Error, please try again'
            });
        } else {
            let weather = JSON.parse(body)
            if (weather.main == undefined) {
                res.status(503)
                res.send({
                    error: 'Error, please try again'
                });
            } else {
                let icon = 'http://openweathermap.org/img/w/' + weather.weather[0]['icon'] + '.png';
                let celsius = ((weather.main.temp))// - 32) * 5 / 9).toFixed(2);
                res.send({
                    weather: [weather.name, icon, celsius, weather.main.humidity, weather.wind.speed, town],
                    error: null
                });
            }
        }
    });
})

router.post('/city_temperature', (req, res) => {
    let html = "<label for='tex'><h4>City</h4></label><br><input type='text' placeholder='enter the city name' name='city'><br>\
    <label for='number'><h4>Refresh timer (h)</h4></label><br><input type='number' name='timer' name='limit' min='1' value=1>"
    res.send(html);
})

module.exports = {
    router
}
