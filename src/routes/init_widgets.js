const router = require('express').Router();
const available_wid = require('../config/about.json')
const Users_tools = require('../db-tools/user_tools')
const widget_control = require('../backbone/widget_control')

const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
const {
  window
} = new JSDOM();
const {
  document
} = (new JSDOM('')).window;
global.document = document;

router.post('/update_w', function (req, res) {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    var valueSelected = req.body.valuesSelected;
    if (!valueSelected)
      return;
    var wid_toAdd = widget_control.find_widget(valueSelected.service, valueSelected.name)
    wid_toAdd.params = req.body.params;
    wid_toAdd.ind = userP.widgets.length
    userP.widgets.push(wid_toAdd);
    userP.widgets.forEach((widget, index) => {
      widget.ind = index
    });
    userP.save().then(data => console.log('user params saved')).catch(e => console.error(e))
    res.sendStatus(200)
  })();
});

router.get('/', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    res.render('widgets', {
      user: userP,
      services: available_wid
    });
  })();
})

router.post('/remove_w', function (req, res) {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    var indToRemove = req.body.index;
    userP.widgets.splice(indToRemove, 1);
    userP.widgets.forEach((widget, index) => {
      widget.ind = index
    });
    userP.save().then(data => {
      res.sendStatus(200)
      console.log('user params saved')
    }).catch(e => {
      res.sendStatus(500)
      console.error(e)
    })
  })();
});

module.exports = router;