const router = require('express').Router();
const request = require('request');

let apiKey = '2e725c6205d0454f991a5b62c795f4ce';

router.post('/get_lemonde', function (req, res) {
  country = req.body.country;
  let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`;
  request(url, function (err, response, body) {
      if (err) {
          res.status(503)
          res.send({
              error: 'Error, please try again'
          });
      } else {
          let news = JSON.parse(body);
          res.send({
                news: news.articles,
                error: null
              });
          }
  });
});

router.post('/get_news', (req, res) => {
    let html = "<label for='tex'><h4> Country</h4><p>Choose your country and print only the Country Abbreviation.<br /> Ex. France -> fr.</p> \
    </label><br><input type='text' placeholder='country' name='country'><br>\
    <label for='number'><h4>Refresh timer</h4></label><br><input type='number' name='timer' name='limit' min='1' value=1>"
    res.send(html);
})

module.exports = {
    router
}
