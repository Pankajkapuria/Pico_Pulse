const mongoose = require("mongoose");

const messageSchama = new mongoose.Schema({
    conversionId: String,
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            message: {
                type: String
            }
        }
    ]
})


const messagemodel = mongoose.model('message', messageSchama);

module.exports = messagemodel;