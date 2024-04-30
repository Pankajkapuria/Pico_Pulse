const mongoose = require('mongoose');

const NotificationSchama = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Notification: [{
        who: {
            Id: {
                type: String
            },
            url: {
                type: String
            }
        },
        Notifiactiontype: {
            type: String
        },
        content: {
            postUrl: {
                type: String,
                default: ''
            },
            comment: {
                type: String,
                default: ''
            }

        }
    }]
})

const notificationModal = mongoose.model('notification', NotificationSchama)

module.exports = notificationModal