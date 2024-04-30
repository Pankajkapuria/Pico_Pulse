const mongoose = require("mongoose");

const postschama = new mongoose.Schema({
    caption: String,
    image: {
        public_id: String,
        url: String
    },
    location: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]

})

const postmodel = mongoose.model('Post', postschama);

module.exports = postmodel;