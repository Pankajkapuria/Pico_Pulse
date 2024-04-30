import { createReducer } from '@reduxjs/toolkit';

export const likeAndUnlikeReducer = createReducer({}, {


    likeRequest: (state) => {
        state.likeloading = true
    },
    likeSucess: (state, action) => {
        state.likeloading = false
        state.message = action.payload
    },
    likeFailer: (state, action) => {
        state.likeloading = false
        state.error = action.payload
    },

    likeClearError: (state) => {
        state.error = null
    },

    clearlikeMessage: (state) => {
        state.message = null
    }
})

export const addCommentReducer = createReducer({}, {
    CommentRequest: (state) => {
        state.Commentloading = true
    },
    CommentSucess: (state, action) => {
        state.Commentloading = false
        state.message = action.payload
    },
    CommentFailer: (state, action) => {
        state.Commentloading = false
        state.error = action.payload
    },

    CommentClearError: (state) => {
        state.error = null
    },


    GetDateRequest: (state) => {
        state.GetDateloading = true
    },
    GetDateSucess: (state, action) => {
        state.GetDateloading = false
        state.Datemessage = action.payload
    },
    GetDateFailer: (state, action) => {
        state.GetDateloading = false
        state.error = action.payload
    },

    GetDateClearMessage: (state) => {
        state.addPostloading = false
        state.Datemessage = null
    },

    GetDateClearError: (state) => {
        state.error = null
    }
})


export const deleteCommentReducer = createReducer({}, {
    CommentDeleteRequest: (state) => {
        state.Commentloading = true
    },
    CommentDeleteSucess: (state, action) => {
        state.Commentloading = false
        state.message = action.payload
    },
    CommentDeleteFailer: (state, action) => {
        state.Commentloading = false
        state.error = action.payload
    },

    CommentDeleteClearError: (state) => {
        state.error = null
    }
})

export const addPostReducer = createReducer({}, {
    addPostRequest: (state) => {
        state.addPostloading = true
    },
    addPostSucess: (state, action) => {
        state.addPostloading = false
        state.message = action.payload
    },
    addPostFailer: (state, action) => {
        state.addPostloading = false
        state.addPosterror = action.payload
    },

    addPostClearMessage: (state) => {
        state.addPostloading = false
        state.message = null
    },

    addPostClearError: (state) => {
        state.addPosterror = null
    },


    UpdatePostRequest: (state) => {
        state.updatePostloading = true
    },
    UpdatePostSucess: (state, action) => {
        state.updatePostloading = false
        state.message = action.payload
    },
    UpdatePostFailer: (state, action) => {
        state.updatePostloading = false
        state.updatePosterror = action.payload
    },

    UpdatePostClearMessage: (state) => {
        state.updatePostloading = false
        state.message = null
    },

    UpdatePostClearError: (state) => {
        state.updatePosterror = null
    },


    deletePostRequest: (state) => {
        state.deletePostloading = true
    },
    deletePostSucess: (state, action) => {
        state.deletePostloading = false
        state.updatemessage = action.payload
    },
    deletePostFailer: (state, action) => {
        state.deletePostloading = false
        state.updatePosterror = action.payload
    },
    deletePostClearMessage: (state) => {
        state.deletePostloading = false
        state.updatemessage = null
    },
    deletePostClearError: (state) => {
        state.deletePosterror = null
    }

})

export const getPostReducer = createReducer({}, {
    getPostRequest: (state) => {
        state.addPostloading = true
    },
    getPostSucess: (state, action) => {
        state.addPostloading = false
        state.message = action.payload
    },
    getPostFailer: (state, action) => {
        state.addPostloading = false
        state.error = action.payload
    },

    getPostClearMessage: (state) => {
        state.addPostloading = false
        state.message = null
    },

    getPostClearError: (state) => {
        state.error = null
    }
})

export const getLikeCommentReducer = createReducer({}, {
    getLikeCommentRequest: (state) => {
        state.getLikeCommentloading = true
    },
    getLikeCommentSucess: (state, action) => {
        state.getLikeCommentloading = false
        state.liComMessage = action.payload
    },
    getLikeCommentFailer: (state, action) => {
        state.getLikeCommentloading = false
        state.error = action.payload
    },

    getLikeCommentClearMessage: (state) => {
        state.getLikeCommentloading = false
        state.liComMessage = null
    },

    getLikeCommentClearError: (state) => {
        state.error = null
    }
})

export const populerPosts = createReducer({}, {
    populerPostsRequest: (state) => {
        state.populerPostsloading = true
    },
    populerPostsSucess: (state, action) => {
        state.populerPostsloading = false
        state.Message = action.payload
    },
    populerPostsFailer: (state, action) => {
        state.populerPostsloading = false
        state.error = action.payload
    },

    populerPostsClearMessage: (state) => {
        state.populerPostsloading = false
        state.Message = null
    },
    populerPostsClearError: (state) => {
        state.error = null
    }
})