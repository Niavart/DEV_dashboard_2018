const express = require('express');
const app = express();
const path = require('path');
const authRoutes = require('./src/routes/auth-routes');
const initWidgets = require('./src/routes/init_widgets');
const profileRoute = require('./src/routes/profile_routes');
const passSetup = require('./src/config/passport-setup');
//const MongoClient = require('mongo');
//mongo to delete
const mongoose = require('mongoose');
const credentials = require('./src/config/credentials');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const Users_tools = require('./src/db-tools/user_tools')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/src/designCss/'));
app.use(express.static(__dirname + '/src/assets/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views/');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [credentials.session.cookieKey]
}));

app.use(passport.initialize());

app.use(passport.session());

app.get('/about.json', (req, res) => {
  var aboutj = require('./src/config/about.json');
  var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
  res.send({
    "client": {
      "host": ip
    },
    "server": {
      "current_time": Date.now(),
      "services": aboutj
    }
  })
})

//connect to mongoDB
mongoose.connect(credentials.mongoDB.dbURI, () => {
  //useNewUrlParser: true
  console.log('connected');
});

app.use('/auth', authRoutes);
app.use('/widgets', initWidgets);
app.use('/profile', profileRoute);
//create home route

app.get('/', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    res.render('home', {
      user: userP
    });
  })();

});

app.listen(8080, () => {
  console.log('app now listening');
});