const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { type } = require("os");


const userschama = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'enter name']
    },
    avater: {
        public_id: String,
        url: String
    },
    email: {
        type: String,
        unique: true
    },
    UserId: {
        type: String,
        unique: true
    },
    gender: {
        type: String,
    },
    Bio: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'password should be at least 6 charactors'],
        select: false
    },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    followering: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    message: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            conversionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "conversionId"
            }

        }
    ],
    resetPasswordToken: {
        type: String
    },
    resetPasswordexpire: {
        type: Date
    },
    verified: {
        type: Boolean
    },
    verificationCode: {
        type: String
    }
}, {
    timestamps: true
})


userschama.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


userschama.methods.CompairePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}



userschama.methods.creatToken = async function () {
    return jwt.sign({ UserId: this._id }, process.env.SERACT_KEY, { expiresIn: '1d' });
}

userschama.methods.generateToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordexpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const usermodel = mongoose.model('user', userschama);

module.exports = usermodel;