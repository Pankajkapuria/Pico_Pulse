const postmodel = require('../Config/models/post.js')
const usermodel = require('../Config/models/user.js');
const cloudinary = require('cloudinary');


// post create
exports.creatpost = async (req, res) => {
    try {

        const { caption, image, location } = req.body;
        const mycloud = await cloudinary.v2.uploader.upload(image, {
            folder: 'posts'
        })

        const newpostData = {
            caption,
            owner: req.user._id,
            location,
            image: {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            },
        }

        const newpost = await postmodel.create(newpostData);
        const user = await usermodel.findById(req.user._id);
        user.post.unshift(newpost._id);
        await user.save();

        res.status(201).json({
            success: true,
            post: newpost,
            message: 'post creat'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'cannot creat post'
        })
    }
}

// post likeAndUnlike
exports.likeAndUnlike = async (req, res) => {
    try {
        const post = await postmodel.findById(req.params.id);

        if (!post) {
            res.status(400).json({
                success: false,
                message: 'post not found'
            })
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();
            res.status(201).json({
                success: true,
                message: 'post unlike'
            })
        }
        else {
            post.likes.push(req.user._id);
            await post.save();
            res.status(201).json({
                success: true,
                message: 'post like'
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

// post delete
exports.postDelete = async (req, res) => {
    try {
        const post = await postmodel.findById(req.params.id);

        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'post not found'
            })
        }

        if (post.owner.toString() != req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "unauthorized"
            })
        }


        const user = await usermodel.findById(req.user._id);
        const index = user.post.indexOf(req.params.id);
        user.post.splice(index, 1);
        await user.save();
        await postmodel.deleteOne({ _id: req.params.id });

        res.status(201).json({
            success: false,
            message: 'post delete'
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// post get
exports.getPostOfFollowing = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id);


        const posts = await postmodel.find({
            owner: {
                $in: user.followering,
            }
        }).populate('owner');
        posts.reverse();

        res.status(201).json({
            success: true,
            posts
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// caption update
exports.updateCaption = async (req, res) => {
    try {
        const post = await postmodel.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'post not found'
            })
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "not authorized"
            })
        }

        const { caption, location } = req.body;
        if (!caption) {
            return res.status(400).json({
                success: false,
                message: 'capction must be required.'
            })
        }

        post.caption = caption;
        post.location = location
        await post.save();
        res.status(201).json({
            success: true,
            message: 'capction update.'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// comment add 
exports.commentOnPost = async (req, res) => {
    try {
        const post = await postmodel.findById(req.params.id);
        const { comment } = req.body;
        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'post not found'
            })
        }


        let commentIndex = -1;

        post.comments.forEach((value, index) => {
            if (value.user.toString() === req.user._id.toString()) {
                commentIndex = index;
            }
        })

        if (commentIndex !== -1) {
            post.comments[commentIndex] = {
                user: req.user._id,
                comment
            }
            await post.save();
            res.status(201).json({
                success: true,
                message: 'comment update'
            })
        }

        else {
            post.comments.push({
                user: req.user._id,
                comment
            })
            await post.save();

            res.status(201).json({
                success: true,
                message: 'comment add'
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



// delete comment
exports.deleteComment = async (req, res) => {
    try {
        const post = await postmodel.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'post not found'
            })
        }


        // if user is owner of post
        if (post.owner.toString() === req.user._id.toString()) {
            post.comments.forEach((value, index) => {
                if (value._id.toString() === req.body.commentId) {
                    post.comments.splice(index, 1);
                    return;
                }
            })

            await post.save();
            res.status(201).json({
                success: true,
                message: 'select comment delete'
            })

        }

        else {

            post.comments.forEach((value, index) => {
                if (value.user.toString() === req.user._id.toString()) {
                    post.comments.splice(index, 1);
                    return;
                }
            })

            await post.save();
            res.status(201).json({
                success: true,
                message: 'comment delete'
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

exports.getPosts = async (req, res) => {
    try {
        const post = await postmodel.findById(req.params.id).populate('likes comments.user');

        if (!post) {
            return res.status(400).json({
                success: false,
                message: 'post not found'
            })
        }

        res.status(201).json({
            success: true,
            post
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getPopulearPosts = async (req, res) => {
    try {
        const posts = await postmodel.find({}).populate('owner')
        posts.sort((x, y) => y.likes.length - x.likes.length);
        res.status(201).json({
            success: true,
            posts
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.getPostLikesComments = async (req, res) => {
    try {
        const { find } = req.body
        if (find === 'likes') {
            const post = await postmodel.findById(req.params.id).populate('likes');
            if (!post) {
                res.status(400).json({
                    success: false,
                    message: 'post not found'
                })
            }

            res.status(201).json({
                success: true,
                likes: post.likes
            })
        }

        else {
            const post = await postmodel.findById(req.params.id).populate('comments.user');
            if (!post) {
                res.status(400).json({
                    success: false,
                    message: 'post not found'
                })
            }
            res.status(201).json({
                success: true,
                comment: post.comments
            })
        }

    }
    catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}


