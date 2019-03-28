const router = require('express').Router();
const GoogleMapsAPI = require('googlemaps');
const credentials = require('../../config/credentials');

router.post('/googlemaps-view', (req, res) => {
  let html = "<h3>Choose the Refresh Timer and add the widget!</h3><h4>Configure Google Maps on your profile</h4>\
  <label for='number'><h4>Refresh timer (h)</h4></label><br><input type='number' name='timer' min='1' value=1>"
  res.send(html);
})

module.exports = {
    router
}
