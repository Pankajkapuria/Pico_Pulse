import { createReducer } from '@reduxjs/toolkit';

const intitialstate = {
    isAuthenticated: false
};

export const UserReducer = createReducer(intitialstate, {

    loginRequest: (state) => {
        state.loading = true
    },
    loginSucess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true
    },
    loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false
    },
    logoutSucess: (state, action) => {
        state.logoutloading = false;
        state.user = null;
        state.isAuthenticated = false
    },


    registerRequest: (state) => {
        state.loading = true
    },
    registerSucess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true
    },
    registerCheck: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    registerFailure: (state, action) => {
        state.loading = false;
        state.registererror = action.payload;
        state.isAuthenticated = false
    },
    registerCheckClearMessage: (state) => {
        state.message = null;
    },
    registerClearError: (state) => {
        state.registererror = null
    },


    UpdateUserRequest: (state) => {
        state.Updateloading = true
    },
    UpdateUserSucess: (state, action) => {
        state.Updateloading = false;
        state.Updateuser = action.payload;
    },
    UpdateUserFailure: (state, action) => {
        state.Updateloading = false;
        state.updateusererror = action.payload;
    },
    UpdateUserclearMessage: (state, action) => {
        state.Updateloading = false;
        state.Updateuser = null;
    },
    UpdateUserclearError: (state) => {
        state.updateusererror = null
    },

    changePasswordRequest: (state) => {
        state.changePasswordloading = true
    },
    changePasswordrSucess: (state, action) => {
        state.changePasswordloading = false;
        state.changePassword = action.payload;
    },
    changePasswordFailure: (state, action) => {
        state.changePasswordloading = false;
        state.changePassworderror = action.payload;
    },
    changePasswordclearMessage: (state, action) => {
        state.changePasswordloading = false;
        state.changePassword = null;
    },
    changePasswordclearError: (state) => {
        state.changePassworderror = null
    },



    loadUserRequest: (state) => {
        state.loading = true
    },
    loadUserSucess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true
    },
    loadUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false
    },

    UserclearError: (state) => {
        state.error = null
    }


})

export const postOfFollowingReducer = createReducer({}, {


    PostOfFollowingRequest: (state) => {
        state.PostOfFollowingloading = true
    },
    PostOfFollowingSucess: (state, action) => {
        state.PostOfFollowingloading = false
        state.PostOfFollowing = action.payload
    },
    PostOfFollowingFailer: (state, action) => {
        state.PostOfFollowingloading = false
        state.error = action.payload
    },


    PostOfFollowingclearError: (state) => {
        state.error = null
    }

})

export const suggestedUsersReducer = createReducer({}, {


    suggestedUsersRequest: (state) => {
        state.loading = true
    },
    suggestedUsersSucess: (state, action) => {
        state.loading = false
        state.suggestedUser = action.payload
    },
    suggestedUsersFailer: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearError: (state) => {
        state.error = null
    },

    searchUsersRequest: (state) => {
        state.searchloading = true
    },
    searchUsersSucess: (state, action) => {
        state.searchloading = false
        state.searchUsers = action.payload
    },
    searchUsersFailer: (state, action) => {
        state.searchloading = false
        state.Searcherror = action.payload
    },
    searchUsersClearMessage: (state) => {
        state.searchUsers = null;
    },
    searchclearError: (state) => {
        state.Searcherror = null
    },


})


export const populearUsersReducer = createReducer({}, {


    populearUsersRequest: (state) => {
        state.populearUserloading = true
    },
    populearUsersSucess: (state, action) => {
        state.populearUserloading = false
        state.populearUser = action.payload
    },
    populearUsersFailer: (state, action) => {
        state.populearUserloading = false
        state.error = action.payload
    },

    populearUsersClearError: (state) => {
        state.error = null
    }
})


export const AnotherUserReducer = createReducer({}, {
    AnotherUserRequest: (state) => {
        state.AnotherUserloading = true
    },
    AnotherUserSucess: (state, action) => {
        state.AnotherUserloading = false
        state.AnotherUser = action.payload
    },
    AnotherUserFailer: (state, action) => {
        state.AnotherUserloading = false
        state.error = action.payload
    },
    AnotherUserClear: (state) => {
        state.AnotherUser = null
    },
    AnotherUserClearError: (state) => {
        state.error = null
    },
})


export const FollowReducer = createReducer({}, {

    followUnfollowRequest: (state) => {
        state.followUnfollowloading = true
    },
    followUnfollowSucess: (state, action) => {
        state.followUnfollowloading = false
        state.followUnfollow = action.payload
    },
    followUnfollowFailer: (state, action) => {
        state.followUnfollowloading = false
        state.followUnfollowerror = action.payload
    },
    followUnfollowClearMessage: (state) => {
        state.followUnfollow = null
    },
    followUnfollowClearError: (state) => {
        state.followUnfollowerror = null
    },


    getFollowerFollowingRequest: (state) => {
        state.getFollowerFollowingloading = true
    },
    getFollowerFollowingSucess: (state, action) => {
        state.getFollowerFollowingloading = false
        state.getFollowerFollowing = action.payload
    },
    getFollowerFollowingFailer: (state, action) => {
        state.getFollowerFollowingloading = false
        state.getFollowerFollowingerror = action.payload
    },
    getFollowerFollowingClearMessage: (state) => {
        state.getFollowerFollowing = null
    },
    getFollowerFollowingClearError: (state) => {
        state.getFollowerFollowingerror = null
    },
})

