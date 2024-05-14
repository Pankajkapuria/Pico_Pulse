const express = require('express');
const { userregister,
    logincontroller,
    followAndFollowing,
    logOutController,
    updatePassword,
    updateProfile,
    userDelete,
    getProfile,
    getAnotherUserProfile,
    resetPassword,
    forgetPassword,
    suggestedForYou,
    popular,
    AboutUser,
    getfollowAndFollowing,
    GetAllUsers,
    verifyAccount } = require('../controllers/userControllers.js')

const userrouter = express.Router();
const { isAuthenticated } = require('../middlewares/auth.js')


// routes


userrouter.route('/register').post(userregister);
userrouter.route('/verify/:verificationCode').post(verifyAccount);
userrouter.route('/login').post(logincontroller);
userrouter.route('/logout').get(isAuthenticated, logOutController);
userrouter.route('/password_update').put(isAuthenticated, updatePassword);
userrouter.route('/profile_update').put(isAuthenticated, updateProfile);
userrouter.route('/followAndFollowing/:id').get(isAuthenticated, followAndFollowing);
userrouter.route('/getFollowerAndFollowing/:id').post(getfollowAndFollowing);
userrouter.route('/userDelete').delete(isAuthenticated, userDelete);
userrouter.route('/userprofile/getprofile').get(isAuthenticated, getProfile);
userrouter.route('/anotheruserprofile/getprofile/:id').get(getAnotherUserProfile);
userrouter.route('/forget/password').post(forgetPassword);
userrouter.route('/password/reset/:token').post(resetPassword);
userrouter.route('/suggestedForYou').get(isAuthenticated, suggestedForYou);
userrouter.route('/popular/user').get(popular);
userrouter.route('/AboutUser/:UserId').get(AboutUser);
userrouter.route('/users').get(GetAllUsers);


module.exports = userrouter;