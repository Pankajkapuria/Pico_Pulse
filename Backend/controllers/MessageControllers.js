const messagemodel = require("../Config/models/Message");
const conversionmodel = require("../Config/models/conversionId");
const usermodel = require("../Config/models/user");


// conversation create
exports.conversationCreate = async (req, res) => {
    try {
        const member2 = req.params.id;
        if (member2 === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "user Self"
            })
        }

        const isConversion = await conversionmodel.findOne({
            "$or": [{
                "member1": req.user.id,
                "member2": member2
            }, {
                "member2": req.user.id,
                "member1": member2
            }]
        })



        if (isConversion) {
            return res.status(201).json({
                success: true,
                conversion: isConversion,
                message: 'coversion Already created'
            })
        }


        const conversion = await conversionmodel.create({
            member1: req.user.id,
            member2
        });

        const user1 = await usermodel.findById(req.user.id);
        const user2 = await usermodel.findById(member2);

        const conversation1 = {
            user: user2._id,
            conversionId: conversion._id
        }
        const conversation2 = {
            user: user1._id,
            conversionId: conversion._id
        }

        user1.message.push(conversation1);
        user2.message.push(conversation2);

        await user1.save();
        await user2.save();

        res.status(201).json({
            success: true,
            conversion,
            message: 'coversion creat'
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// create message
exports.MessageCreat = async (req, res) => {
    try {

        const { sender, conversionId, message } = req.body;
        const messages = await messagemodel.findOne({ conversionId: conversionId })
        if (messages) {
            const details = {
                sender,
                message
            }
            messages.messages.push(details)
            await messages.save();
        }
        else {
            await messagemodel.create({
                conversionId,
                messages: [{
                    sender,
                    message
                }]
            });
        }

        res.status(201).json({
            success: true,
            message: 'message sent'
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// get conversation Message
exports.getConversationMessage = async (req, res) => {
    try {
        const conversionId = req.params.id;
        if (!conversionId) {
            return res.status(201).json({
                success: false,
                message: 'converstion is required'
            })
        }
        const users = await conversionmodel.findById(conversionId);
        let conversionUser = {};
        if (users.member1 === req.user._id.toString()) {
            conversionUser = await usermodel.findById(users.member2)
        }
        else {
            conversionUser = await usermodel.findById(users.member1)
        }

        const conversation = await messagemodel.findOne({ conversionId });

        res.status(201).json({
            success: true,
            conversionUser: {
                UserName: conversionUser.name,
                UserId: conversionUser.UserId,
                _id: conversionUser._id,
                avater: conversionUser.avater
            },
            conversation,

        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getContacts = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id)
        const messageUsers = [];
        for (let i = 0; i < user.message.length; i++) {
            const c = await usermodel.findById(user.message[i].user.toString())
            messageUsers.push({
                avater: c.avater,
                UserName: c.name,
                UserId: c.UserId,
                conversionId: user.message[i].conversionId.toString()

            });
        }
        res.status(201).json({
            success: true,
            messageUsers
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}