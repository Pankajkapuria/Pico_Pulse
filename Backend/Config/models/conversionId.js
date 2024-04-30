const mongoose = require("mongoose");

const conversionSchama = new mongoose.Schema({
    member1: {
        type: String
    },
    member2: {
        type: String
    }
})

const conversionmodel = mongoose.model('conversionId', conversionSchama);

module.exports = conversionmodel;