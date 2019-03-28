const request = require('request');
const router = require('express').Router();
const outlook = require("node-outlook");
const passport = require('passport');
const Users_tools = require('../../db-tools/user_tools');
const ejsLint = require('ejs-lint');
var userP;

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
}

router.post('/get_mail', authCheck, (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user);
      outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
      var queryParams = {
        '$select': 'Subject,ReceivedDateTime,From,WebLink',
        '$orderby': 'ReceivedDateTime desc',
        '$top': req.body.limit
      };
      // Pass the user's email address
      var userInfo = {
        email: userP.office_acc.email
      };

      outlook.mail.getMessages({
          token: userP.userAccessToken,
          folderId: 'Inbox',
          odataParams: queryParams,
          user: userInfo
        },
        function (error, result) {
          if (error) {
            console.log('getMessages returned an error: ', error);
            res.redirect('/auth/outlook');
          } else if (result) {
            console.log('getMessages returned ' + result.value.length + ' messages.');
            res.send(result.value)
          }
        });
      // This is the oAuth token*/
    } catch (err) {
      userP = undefined;
      res.sendStatus(500)
    }
  })();
});

router.post('/read_outlook_mail', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    let html;
    if (userP.office_acc && userP.userAccessToken) {
      html = "<h3>Confirm using this account ? " + userP.office_acc.email + "</h3>\
      <label for='number'><h4>Event limit</h4></label><br><input type='number' name='limit' min='1' value=1><br>\
      <label for='number'><h4>Refresh timer (h)</h4></label><br><input type='number' name='timer' min='1' value=1>"
    } else {
      html = "<button id='button-office-addit' class='btn btn-primary btn-md'><img class='outlook-logo-icon' src='/outlook-logo.jpg' alt='icon' /> <a href='/auth/outlook'> office365 </a></button>"
    }
    res.send(html);
  })();
})

router.post('/get_calendar', authCheck, (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user);
      outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
      var queryParams = {
        '$select': 'Subject,Start,End',
        '$orderby': 'Start/DateTime desc',
        '$top': 20
      };
      // Pass the user's email address
      var userInfo = {
        email: userP.office_acc.email
      };

      outlook.calendar.getEvents({
          token: userP.userAccessToken,
          folderId: 'Inbox',
          odataParams: queryParams,
          user: userInfo
        },
        function (error, result) {
          if (error) {
            console.log('getEvents returned an error: ', error);
            res.redirect('/auth/outlook');
          } else if (result) {
            console.log('getEvents returned ' + result.value.length + ' events.');
            res.send(result.value)
          }
        });
      // This is the oAuth token*/
    } catch (err) {
      userP = undefined;
      res.sendStatus(500)
    }
  })();
});

router.post('/outlook_calendar', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    let html;
    if (userP.office_acc && userP.userAccessToken) {
      html = "<h3>Confirm using this account ? " + userP.office_acc.email + "</h3>\
    <label for='number'><h4>Event limit</h4></label><br><input type='number' name='limit' min='1' value=1><br>\
    <label for='number'><h4>Refresh timer (h)</h4></label><br><input type='number' name='timer' min='1' value=1>"
    } else {
      html = "<button id='button-office-addit' class='btn btn-primary btn-md'><img class='outlook-logo-icon' src='/outlook-logo.jpg' alt='icon' /> <a href='/auth/outlook'> office365 </a></button>";
    }
    res.send(html);
  })();
})


router.post('/create_event', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    var userInfo = {
      email: userP.office_acc.email
    };
    var newEvent = {
      "Subject": req.body.Subject,
      "Body": {
        "ContentType": "HTML",
        "Content": req.body.Content
      },
      "Start": {
        "DateTime": new Date(req.body.Start),
        "TimeZone": "Eastern Standard Time"
      },
      "End": {
        "DateTime": new Date(req.body.End),
        "TimeZone": "Eastern Standard Time"
      },
      "Attendees": [{
        "EmailAddress": {
          "Address": userInfo.email,
          "Name": userP.office_acc.username
        },
        "Type": "Required"
      }]
    };
    outlook.calendar.createEvent({
        token: userP.userAccessToken,
        event: newEvent,
        user: userInfo
      },
      function (error, result) {
        if (error) {
          console.log('createEvent returned an error: ' + error);
          res.sendStatus(500)
        } else if (result) {
          res.sendStatus(200)
        }
      });
  })();
})

router.post('/get_contacts', authCheck, (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user);
      outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
      var queryParams = {
        '$select': 'GivenName,Surname,EmailAddresses',
        '$orderby': 'CreatedDateTime desc',
        '$top': 20
      };

      var userInfo = {
        email: userP.office_acc.email
      };
      outlook.contacts.getContacts({token: userP.userAccessToken, odataParams: queryParams, user: userInfo},
        function(error, result){
          if (error) {
            console.log('getContacts returned an error: ' + error);
          }
          else if (result) {
            console.log('getContacts returned ' + result.value.length + ' contacts.');
            res.send(result.value);
          }
        });
    } catch (err) {
      userP = undefined;
      res.sendStatus(500)
    }
  })();
});

router.post('/outlook_contacts', (req, res) => {
  (async () => {
    try {
      userP = await Users_tools.findUserById(req.user)
    } catch (err) {
      userP = undefined
    }
    let html;
    if (userP.office_acc && userP.userAccessToken) {
      html = "<h3>Confirm using this account ? " + userP.office_acc.email + "</h3>\
    <label for='number'><h4>Contacts limit</h4></label><br><input type='number' name='limit' min='1' value=1><br>\
    <label for='number'><h4>Refresh timer (h)</h4></label><br><input type='number' name='timer' min='1' value=1>"
    } else {
      html = "<button id='button-office-addit' class='btn btn-primary btn-md'><img class='outlook-logo-icon' src='/outlook-logo.jpg' alt='icon' /> <a href='/auth/outlook'> office365 </a></button>";
    }
    res.send(html);
  })();
});

module.exports = {
  router
}
