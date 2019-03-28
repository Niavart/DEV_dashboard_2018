const router = require('express').Router();
const passport = require('passport');
const rssRoutes = require('./rss/rss-routes');
const weatherRoutes = require('./weather/weather-routes');
const lemondeRoutes = require('./lemonde/lemonde-routes');
const outlookRoutes = require('./outlook/outlook-routes');
const widget_control = require('../backbone/widget_control');
const googleMapsRoutes = require('./googleMaps/googleMaps-routes');
const Users_tools = require('../db-tools/user_tools')
const rss = require('../backbone/rss_control')
const url = require('url');

router.use('/rss', rssRoutes.router);
router.use('/weather', weatherRoutes.router);
router.use('/outlook', outlookRoutes.router)
router.use('/googleMaps', googleMapsRoutes.router);
router.use('/lemonde', lemondeRoutes.router);

router.get('/login', (req, res) => {
  res.render('login', {
    user: req.user
  });
});

router.get('/about', (req, res) => {
  res.render('about',{
    user: req.user
  });
});

router.get('/contactUs', (req, res) => {
  res.render('contactUs',{
    user: req.user
  });
});

router.get('/settings', (req, res) => {
  if (!req.user)
    res.sendStatus(403);
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    let d_wid = widget_control.get_widget_list(userP);
    res.render('settings', {
      user: userP,
      widgets: d_wid
    });
  })();
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//auth with google

router.get('/google', function (req, res) {
  passport.authenticate('google', {
    scope: ['profile']
  })(req, res)
});

router.get('/outlook', function (req, res) {
  passport.authenticate('windowslive', {
    scope: ["openid",
      "profile",
      "offline_access",
      "https://outlook.office.com/Mail.Read",
      "https://outlook.office.com/calendars.readwrite.shared",
      "https://outlook.office.com/contacts.read"
    ]
  })(req, res)
});

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.get('/authorize-outlook', passport.authenticate('windowslive'), (req, res) => {
  res.redirect(url.format({
    pathname: "/"
  }));
});

module.exports = router;
