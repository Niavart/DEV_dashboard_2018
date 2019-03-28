const request = require('request');
const router = require('express').Router();
const outlook = require("node-outlook");
const Users_tools = require('../db-tools/user_tools');
const ejsLint = require('ejs-lint');
//const OutlookConnect = require('passport-outlook');
var userP;
//let town;//id = 2988506; //pour test c est l id de paris
//let apiKey = '65b7e266d5f36677a9b6664e46c0ca6f';
//router.use('/profile', searchLocation);
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
}

router.get('/', authCheck, (req, res) => {
  (async () => {
      userP = await Users_tools.findUserById(req.user);
      res.render('profile', { user: userP});
  })();
});

module.exports = router;