const usermodel = require('../Config/models/user.js');
const postmodel = require('../Config/models/post.js');
const { sendEmail } = require('../middlewares/sendMail.js')
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const conversionmodel = require('../Config/models/conversionId.js');
const messagemodel = require('../Config/models/Message.js');

exports.userregister = async (req, res) => {
    try {
        const { name, email, password, UserId, chackUser, avater, DOB } = req.body;

        if (!email || !password || !name || !UserId) {
            return res.status(201).json({ sucess: false, message: 'email & name & password & UserIdshould is required.' });
        }
        if (password.length < 6) {
            return res.status(201).json({ sucess: false, message: 'password should be atlest 6 charactor' });
        }

        let user = await usermodel.findOne({ email });
        if (user) {
            return res.status(201).json({ sucess: false, message: 'email is Already exit' });
        }


        let userId = await usermodel.findOne({ UserId });
        if (userId) {
            return res.status(201).json({ sucess: false, message: 'try another userId name' });
        }
        if (chackUser && chackUser === 'true') {
            return res.status(201).json({ sucess: true, message: 'new user right' });
        }


        const mycloud = await cloudinary.v2.uploader.upload(avater, {
            folder: 'profile profile'
        })

        user = await usermodel.create({
            name, email, password, UserId, avater: {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            }
        });


        const token = await user.creatToken();
        options = {
            expiresIn: '1d',
            httpOnly: true
        }

        res.status(201).cookie('token', token, options).json({
            sucess: true,
            user,
            token
        })

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logincontroller = async (req, res) => {
    try {
        const { Id, password } = req.body;

        if (!Id) {
            return res.status(400).json({ sucess: false, message: 'email or UserId should is required.' });
        }

        if (!password) {
            return res.status(400).json({ sucess: false, message: 'password should is required.' });
        }

        let user = '';

        user = await usermodel.findOne({ email: Id }).select("+password");

        if (!user) {
            user = await usermodel.findOne({ UserId: Id }).select("+password");
        }


        if (!user) {
            return res.status(400).json({ sucess: false, message: 'Id not found please register first.' });
        }

        const isMatch = await user.CompairePassword(password);
        if (!isMatch) {
            return res.status(400).json({ sucess: false, message: 'password not match' });
        }

        const token = await user.creatToken();
        user.password = undefined;

        // res.cookie('token', token, {
        //     expiresIn: new Date(Date.now() + 10 * 60 * 1000),
        //     httpOnly: true,
        // })

        res.status(201).json({
            sucess: true,
            user,
            token
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logOutController = async (req, res) => {
    try {
        options = {
            expires: new Date(Date.now()),
            httpOnly: true
        }

        return res.status(201).cookie('token', null, options).json({
            sucess: true,
            message: 'logout sucessfully'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id).select('+password');
        const { oldPassword, newPassword, confrom_newPassword } = req.body;

        const isMatch = await user.CompairePassword(oldPassword);
        if (!isMatch) {
            return res.status(201).json({
                sucess: false,
                message: 'Current password is incorrect'
            })
        }
        if (newPassword.length < 6) return res.status(201).json({ sucess: false, message: 'password should be 6 charactor ' })

        if (newPassword !== confrom_newPassword) {
            return res.status(201).json({
                sucess: false,
                message: 'newPassword confrom_newPassword not match'
            })
        }
        user.password = newPassword;
        await user.save();
        res.status(201).json({
            success: true,
            message: 'password updated'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id);
        const { name, avater, Bio, gender } = req.body;


        if (name) {
            user.name = name;
        }
        if (avater) {
            await cloudinary.v2.uploader.destroy(user.avater.public_id);

            const mycloud = await cloudinary.v2.uploader.upload(avater, {
                folder: 'profile'
            })
            user.avater = {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            }
        }

        if (Bio) {
            user.Bio = Bio
        }
        if (gender) {
            user.gender = gender
        }
        await user.save();

        res.status(201).json({
            success: true,
            message: 'profile update'
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.followAndFollowing = async (req, res) => {
    try {
        const userToFollow = await usermodel.findOne({ UserId: req.params.id });
        const loggedUser = await usermodel.findById(req.user._id);

        if (!userToFollow) {
            return res.status(400).json({
                sucess: false,
                message: 'user not Found'
            })
        }

        if (userToFollow._id.toString() === loggedUser._id.toString()) {
            return res.status(400).json({
                sucess: false,
                message: 'user self'
            })
        }

        // if userToFollow find then we check userToFollow is already follow , then we do unfollow
        if (userToFollow.follower.includes(req.user._id)) {
            const indexOfuserToFollow = loggedUser.followering.indexOf(userToFollow._id);
            const indexOfloggedUser = userToFollow.follower.indexOf(loggedUser._id);
            loggedUser.followering.splice(indexOfuserToFollow, 1);
            userToFollow.follower.splice(indexOfloggedUser, 1);
            userToFollow.save();
            loggedUser.save();
            return res.status(200).json({
                sucess: true,
                message: 'unfollow'
            })
        }
        else {
            loggedUser.followering.push(userToFollow._id);
            userToFollow.follower.push(loggedUser._id);
            userToFollow.save();
            loggedUser.save();
            return res.status(200).json({
                sucess: true,
                message: 'follow'
            })
        }

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getfollowAndFollowing = async (req, res) => {
    try {
        const user = await usermodel.findOne({ UserId: req.params.id });
        const { find } = req.body
        if (find === 'follower') {
            await user.populate('follower')
            res.status(201).json({
                success: true,
                follower: user.follower
            })
        }
        else {
            await user.populate('followering')
            res.status(201).json({
                success: true,
                follower: user.followering
            })
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.userDelete = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id);
        const posts = user.post;
        const following = user.followering
        const follower = user.follower;
        const userId = req.user._id
        // await usermodel.findByIdAndDelete(req.user._id);



        // Logout user after profile delete
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        // delete all posts for user
        for (let i = 0; i < posts.length; i++) {
            const postId = posts[i];
            await postmodel.findByIdAndDelete(postId);
        }

        // jo use delete hua h useke jo following the unke followers me se bhi is user ko delete kena h

        for (let i = 0; i < following.length; i++) {
            const followerID = following[i];
            const followuser = await usermodel.findById(followerID);

            const index = followuser.follower.indexOf(userId);
            followuser.follower.splice(index, 1);
            await followuser.save();
        }

        for (let i = 0; i < follower.length; i++) {
            const followeringID = following[i];
            const followinguser = await usermodel.findById(followeringID);

            const index = followinguser.followering.indexOf(userId);
            followinguser.followering.splice(index, 1);
            await followinguser.save();
        }


        // delete all converstion users
        for (let i = 0; i < user?.message.length; i++) {
            let users = user.message[i];
            const anotherUsers = await usermodel.findOne({ _id: users.user })
            for (let j = 0; j < anotherUsers.message.length; j++) {
                if (anotherUsers.message[j].user.toString() === req.user._id.toString()) {
                    anotherUsers.message.splice(j, 1);

                    console.log(anotherUsers.message[j].conversionId);
                    await conversionmodel.findByIdAndDelete(anotherUsers.message[j].conversionId);
                    await messagemodel.findOneAndDelete({ conversionId: anotherUsers.message[j].conversionId.toString() })
                }
            }
            await anotherUsers.save()

        }





        res.status(201).json({
            sucess: true,
            message: "Account Delete"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

exports.getProfile = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id)
        const posts = [];
        for (let i = 0; i < user.post.length; i++) {
            posts.push(await postmodel.findById(user.post[i]));
        }
        res.status(201).json({
            success: true,
            user,
            posts,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.GetAllUsers = async (req, res) => {
    try {
        let users = await usermodel.find(
            {
                $or: [{ name: { $regex: req.query.name, $options: "i" } }, { UserId: { $regex: req.query.name, $options: "i" }, }]
            }
        ).limit(20);

        users.sort((x, y) => y.follower.length - x.follower.length);

        res.status(201).json({
            success: true,
            users,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAnotherUserProfile = async (req, res) => {
    try {
        const user = await usermodel.findOne({ UserId: req.params.id }).populate('post');
        if (!user) {
            return res.json({
                success: false,
                message: 'user not found'
            })
        }

        res.status(201).json({
            success: true,
            user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'email is require'
            })
        }

        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'email is not registered please register first '
            })
        }

        const resetToken = await user.generateToken();

        await user.save();

        const resetUrl = `${req.headers.origin}/user/password/reset/${resetToken}`

        const message = `Reset your password on clicking below: \n\n ${resetUrl} `;

        try {
            await sendEmail({
                email: email,
                subject: 'Reset password',
                message: message
            })
            res.status(201).json({
                success: true,
                message: `mail sent on ${email} this mail`
            })
        }
        catch (error) {
            console.log(error)
            user.resetPasswordToken = undefined
            user.resetPasswordexpire = undefined
            await user.save();
            res.status(500).json({
                success: false,
                message: error.message
            })
        }

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token

        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await usermodel.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordexpire: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Link is expired'
            })
        }

        const { password, newPassword } = req.body;

        if (!password || password.length < 6) {
            return res.status(401).json({
                success: false,
                message: 'password should be at least 6 charactor'
            })
        }

        if (password !== newPassword) {
            return res.status(401).json({
                success: false,
                message: 'password and confrom_password should be same.'
            })
        }

        user.password = password
        user.resetPasswordToken = undefined;
        user.resetPasswordexpire = undefined;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'password reset'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.suggestedForYou = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id);

        const followingUsers = await usermodel.find({
            _id: {
                $in: user.followering
            }
        }).limit(8);



        const usres = [];
        const repeatedUser = [];
        for (let i = 0; i < followingUsers.length; i++) {
            const suggestUser = await usermodel.find({
                _id: {
                    $in: followingUsers[i].followering
                }
            })

            for (let j = 0; j < suggestUser.length; j++) {
                if (!user.followering.includes(suggestUser[j]._id) && req.user._id.toString() !== suggestUser[j]._id.toString()) {
                    if (repeatedUser.includes(suggestUser[j]._id.toString()) === false) {
                        repeatedUser.push(suggestUser[j]._id.toString());
                        usres.push(suggestUser[j]);
                    }
                }
            }
        }
        res.status(201).json({
            success: true,
            usres
        })


    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.popular = async (req, res) => {
    try {
        const usres = await usermodel.find({});
        usres.sort((x, y) => y.follower.length - x.follower.length);
        res.status(201).json({
            success: true,
            usres
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.AboutUser = async (req, res) => {
    try {

        const usres = await usermodel.findOne({
            UserId: req.params.UserId
        })


        let date = {}
        if (usres.createdAt) {
            date = {
                'date': usres.createdAt.getDate(),
                'month': usres.createdAt.getMonth(),
                'year': usres.createdAt.getFullYear()
            }
        }


        res.status(201).json({
            success: true,
            date
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}