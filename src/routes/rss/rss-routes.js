const router = require('express').Router();
const passport = require('passport');
const widget_control = require('../../backbone/widget_control')
const Users_tools = require('../../db-tools/user_tools')
const rss = require('../../backbone/rss_control')

router.post('/article_list', (req, res) => {
    let html = "<label for='url'><h4>RSS link</h4></label><br><input id='url' type='url' placeholder='https://xkcd.com/rss.xml' name='link'><br>\
    <label for='number'><h4>Article limit</h4></label><br><input type='number' name='limit' min='1' value=1><br>\
    <label for='number'><h4>Refresh timer (h)</h4></label><br><input type='number' name='timer' min='1' value=1>"
    res.send(html);
    //res.status(502);
    //res.send("Error rss feed")
})

router.post('/get_rss', (req, res) => {
    rss.rss_feed(req.body.link, req.body.limit).then(feed => res.send(feed)).catch(err => {
        res.status(400);
        res.send("Error rss feed")
    })
})

module.exports = {
    router
}
