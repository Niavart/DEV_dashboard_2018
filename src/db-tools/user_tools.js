const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  username: String,
  email: String,
  userId: String,
  thumbnail: String
});

const userParamsSchema = new schema({
  username: String,
  email: String,
  userId: String,
  userAccessToken: String,
  google_acc: Object,
  office_acc: Object,
  widgets: Array
});

const User = mongoose.model('user', userSchema);
const User_Params = mongoose.model('user_params', userParamsSchema);

const findUserById = function (userid) {
  return new Promise(function (resolve, reject) {
    User_Params.findById(userid).then((user) => {
      if (user)
        resolve(user)
      reject(undefined)
    }).catch(err => reject(undefined))
  })
}

const verifUserC = function (userid) {
  return new Promise(function (resolve, reject) {
    User_Params.findOne({
      username: userid
    }).then((currentUser) => {
      if (currentUser) {
        resolve(currentUser);
      }
      reject(undefined);
    }).catch(err => reject(undefined))
  })
}

/*
const updateUser = function (userid, data) {
  return new Promise(function (resolve, reject) {
    User_Params.findOne({
      username: userid
    }).then((currentUser) => {
      if (currentUser) {
        resolve(currentUser);
      }
      reject(undefined);
    }).catch(err => reject(undefined))
  })
}*/

module.exports = {
  User,
  User_Params,
  verifUserC,
  findUserById
};
