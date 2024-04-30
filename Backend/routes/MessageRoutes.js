const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { conversationCreate, MessageCreat, getConversationMessage, getContacts } = require('../controllers/MessageControllers');
const messageRouters = express.Router()

messageRouters.route('/conversation/:id').post(isAuthenticated, conversationCreate);
messageRouters.route('/MessageCreat').post(isAuthenticated, MessageCreat);
messageRouters.route('/getConversation/:id').get(isAuthenticated, getConversationMessage);
messageRouters.route('/getContects').get(isAuthenticated, getContacts);


module.exports = messageRouters;