const express = require('express');
const { creatpost,
    likeAndUnlike,
    postDelete,
    getPostOfFollowing,
    updateCaption,
    commentOnPost,
    deleteComment,
    getPosts,
    getPostLikesComments,
    getPopulearPosts } = require('../controllers/postControllers.js')
const postrouter = express.Router();
const { isAuthenticated } = require('../middlewares/auth.js')


// routes

// post uploade routes
postrouter.route('/upload').post(isAuthenticated, creatpost);
postrouter.route('/likeAndUnlike/:id').get(isAuthenticated, likeAndUnlike);
postrouter.route('/delete/:id').delete(isAuthenticated, postDelete);
postrouter.route('/posts').get(isAuthenticated, getPostOfFollowing);
postrouter.route('/populerPosts').get(getPopulearPosts);
postrouter.route('/update_caption/:id').put(isAuthenticated, updateCaption);
postrouter.route('/addComment/:id').post(isAuthenticated, commentOnPost);
postrouter.route('/deleteComment/:id').post(isAuthenticated, deleteComment);
postrouter.route('/getPosts/:id').get(getPosts);
postrouter.route('/getLikeComment/:id').post(getPostLikesComments);


module.exports = postrouter;