import { configureStore } from '@reduxjs/toolkit';
import { AnotherUserReducer, FollowReducer, UserReducer, populearUsersReducer, postOfFollowingReducer, suggestedUsersReducer } from './Reducers/UserReducer.js';
import { addCommentReducer, addPostReducer, deleteCommentReducer, getLikeCommentReducer, getPostReducer, likeAndUnlikeReducer, populerPosts } from './Reducers/PostReducer.js';
import { getContacts, getMessageReducer } from './Reducers/MessageReducer.js';
import { getNotificationReducer } from './Reducers/Notification.js';



const store = configureStore({
    reducer: {
        user: UserReducer,
        postOfFollowing: postOfFollowingReducer,
        suggestedUsers: suggestedUsersReducer,
        populearUsers: populearUsersReducer,
        likeAndUnlikeUser: likeAndUnlikeReducer,
        addComment: addCommentReducer,
        deleteComment: deleteCommentReducer,
        anotherUserget: AnotherUserReducer,
        addPost: addPostReducer,
        getPost: getPostReducer,
        getLikeComment: getLikeCommentReducer,
        followhendle: FollowReducer,
        Message: getMessageReducer,
        Contacts: getContacts,
        NotificationReducer: getNotificationReducer,
        populerPostsReducer: populerPosts
    }
})

export default store;