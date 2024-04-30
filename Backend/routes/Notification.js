const express = require('express');
const { addNotification, getNotifications } = require('../controllers/Notification');
const { isAuthenticated } = require('../middlewares/auth');

const NotificationRouter = express.Router();

NotificationRouter.route('/get/notifications').get(isAuthenticated, getNotifications)
NotificationRouter.route('/creat/notification').post(isAuthenticated, addNotification)

module.exports = NotificationRouter


