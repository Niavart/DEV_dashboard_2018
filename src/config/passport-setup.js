const passport = require('passport');
const GoogleConnect = require('passport-google-oauth20');
const OutlookConnect = require('passport-outlook');
const credentials = require('./credentials');
const UserParams = require('../db-tools/user_tools').User_Params;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserParams.findById(id).then((user) => {
    if (user) {
      done(null, user.id);
    } else {
      done(null, null);
    }
  });
});

passport.use(
  new GoogleConnect({
    callbackURL: '/auth/google/redirect',
    clientID: credentials.google.clientID,
    clientSecret: credentials.google.clientSecret,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    const verifu = undefined;
    if (req.user && req.user.userId) {
      (async () => {
        verifu = await UserParams.findOne({
          userId: req.user.userId
        })
      })();
    }
    if (verifu && (!verifu.google_acc || !verifu.google_acc.googleId)) {
      verifu.google_acc = {
        username: profile.displayName,
        email: profile.EmailAddress,
        googleId: profile.id,
        thumbnail: checkthumb ? checkthumb.value : "",
      }
      verifu.save().then(data => {
        console.log('user officeacc updated')
        done(null, data);
      }).catch(e => console.error(e))
    } else {
      UserParams.findOne({
        userId: profile.id
      }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          let checkthumb = profile.photos[0]
          new UserParams({
            username: profile.displayName,
            userId: profile.id,
            google_acc: {
              username: profile.displayName,
              email: profile.EmailAddress,
              googleId: profile.id,
              thumbnail: checkthumb ? checkthumb.value : "",
            },
            office_acc: {}
            //thumbnail: profile._json.image.url
          }).save().then((newUser) => {
            console.log('new user created: ' + newUser);
            done(null, newUser);
          });
        }
      })
    }
  })
);

passport.use(
  new OutlookConnect({
    clientID: credentials.office365.client.id,
    clientSecret: credentials.office365.client.secret,
    callbackURL: '/auth/authorize-outlook',
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const verifu = undefined;
      if (req.user && req.user.userId) {
        verifu = await UserParams.findOne({
          userId: req.user.userId
        });
      }
      if (verifu && (!verifu.office_acc || !verifu.office_acc.officeId)) {
        verifu.userAccessToken = accessToken;
        verifu.office_acc = {
          username: profile.displayName,
          email: profile._json.EmailAddress,
          officeId: profile.id,
          thumbnail: "",
        }
        verifu.save().then(data => {
          console.log('user officeacc updated')
          done(null, data);
        }).catch(e => console.error(e))
      } else {
        const existingUser = await UserParams.findOne({
          userId: profile.id
        });
        if (existingUser) {
          console.log('user already exist');
          existingUser.userAccessToken = accessToken;
          await existingUser.save()
          return done(null, existingUser);
        } else {
          console.log('create new Profile');
          new UserParams({
            username: profile.displayName,
            userId: profile.id,
            userAccessToken: accessToken,
            office_acc: {
              username: profile.displayName,
              email: profile._json.EmailAddress,
              officeId: profile.id,
              thumbnail: "",
            },
            google_acc: {}
          }).save().then((newUser) => {
            done(null, newUser);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
);
