const notificationModal = require("../Config/models/Notifications");
const postmodel = require("../Config/models/post");

exports.getNotifications = async (req, res) => {
    try {
        const notifiactions = await notificationModal.findOne({ user: req.user._id });
        notifiactions.Notification = notifiactions.Notification.reverse();
        res.status(201).json({
            success: true,
            notifiactions
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.addNotification = async (req, res) => {
    try {
        let { who, type, PostId, comment } = req.body;
        const notifiaction = await notificationModal.findOne({ user: who });
        const detalis = {
            who: {
                Id: req.user.UserId,
                url: req.user.avater.url
            },
            Notifiactiontype: type,
            content: {}
        }

        if (type === 'like' || type === 'comment') {
            const postUrl = await postmodel.findById(PostId)
            detalis.content.postUrl = postUrl?.image?.url;
        }
        if (type === 'comment') {
            detalis.content.comment = comment;
        }

        if (notifiaction) {
            notifiaction?.Notification?.push(detalis)
            notifiaction.save();
        }
        else {
            await notificationModal.create({
                user: who,
                Notification: [detalis]
            })
        }

        res.status(201).json({
            sucess: true,
            message: 'notification send'
        })

    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}