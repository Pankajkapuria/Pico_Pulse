import axios from 'axios'
import { toast } from 'react-hot-toast';

export const loginUser = (id, password) => async (dispatch) => {
    try {

        dispatch({
            type: "loginRequest"
        })


        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/login`,
            { Id: id, password },
            {
                headers: {
                    "Content-Type": 'application/json'
                }
            }
        );


        if (data) {
            localStorage.setItem('token', data.token)
        }

        dispatch({
            type: "loginSucess",
            payload: data
        })

    }
    catch (error) {
        if (error?.response?.data) {
            toast.error(error.response.data.message)
        }
        dispatch({
            type: "loginFailure",
            payload: error.message
        })
    }
}

export const registerUser = (email, name, userName, password, chackUser) => async (dispatch) => {
    try {

        dispatch({
            type: "registerRequest"
        })

        const avater = 'data:image/jpeg;base64,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'

        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/register`,
            { email, name, UserId: userName, password, chackUser, avater: avater },
            {
                headers: {
                    "Content-Type": 'application/json'
                }
            }
        );


        if (chackUser === 'true') {
            dispatch({
                type: "registerCheck",
                payload: data
            })
        }
        // else {
        //     if (data) {
        //         localStorage.setItem('token', data.token)
        //     }
        //     dispatch({
        //         type: "registerSucess",
        //         payload: data
        //     })
        // }

        dispatch({
            type: "registerClearError"
        })
    }
    catch (error) {
        dispatch({
            type: "registerFailure",
            payload: error.message
        })
    }
}

export const updateUser = (name, Bio, avater, gender) => async (dispatch) => {
    try {

        dispatch({
            type: "UpdateUserRequest"
        })

        const token = localStorage.getItem('token');
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/profile_update`,
            { name, Bio, avater, gender },
            {
                headers: {
                    "Content-Type": 'application/json',
                    "authorization": token
                }
            }
        );

        dispatch({
            type: 'UpdateUserSucess',
            payload: data
        })

        dispatch({
            type: "UpdateUserclearError"
        })

    }
    catch (error) {
        dispatch({
            type: "UpdateUserFailure",
            payload: error.message
        })
    }
}

export const ChangePassword = (oldPassword, newPassword, confrom_newPassword) => async (dispatch) => {
    try {

        dispatch({
            type: "changePasswordRequest"
        })

        const token = localStorage.getItem('token');
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/password_update`,
            { oldPassword, newPassword, confrom_newPassword },
            {
                headers: {
                    "Content-Type": 'application/json',
                    "authorization": token
                }
            }
        );

        dispatch({
            type: 'changePasswordrSucess',
            payload: data
        })

        dispatch({
            type: "changePasswordclearError"
        })

    }
    catch (error) {
        console.log(error)
        dispatch({
            type: "changePasswordFailure",
            payload: error.message
        })
    }
}

export const loadUser = () => async (dispatch) => {
    try {

        dispatch({
            type: "loadUserRequest"
        })

        const token = localStorage.getItem('token');

        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/userprofile/getprofile`, {
            headers: {
                authorization: token
            }
        })
        dispatch({
            type: "loadUserSucess",
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: "loadUserFailure",
            payload: error.message
        })
    }
}

export const getFollowingPost = () => async (dispatch) => {

    try {
        dispatch({
            type: "PostOfFollowingRequest"
        })

        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/posts`,
            {
                headers: {
                    "authorization": token
                }
            }
        )


        dispatch({
            type: "PostOfFollowingSucess",
            payload: data.posts
        })

        dispatch({
            type: "clearError"
        })

    }
    catch (error) {
        dispatch({
            type: "PostOfFollowingFailer",
            payload: error.message
        })

    }

}

export const suggestedUsers = () => async (dispatch) => {
    try {

        dispatch({
            type: "suggestedUsersRequest"
        })

        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/suggestedForYou`,
            {
                headers: {
                    "authorization": token
                }
            }
        )

        dispatch({
            type: "suggestedUsersSucess",
            payload: data
        })

        dispatch({
            type: "clearError"
        })


    }

    catch (error) {
        dispatch({
            type: "suggestedUsersFailer",
            payload: error.message
        })
    }
}

export const anotherUser = (UserId) => async (dispatch) => {
    try {

        dispatch({
            type: "AnotherUserRequest"
        })

        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/anotheruserprofile/getprofile/${UserId}`,
            {
                headers: {
                    "authorization": token
                }
            }
        )

        dispatch({
            type: "AnotherUserSucess",
            payload: data
        })

        dispatch({
            type: "AnotherUserClearError"
        })



    }

    catch (error) {
        dispatch({
            type: "AnotherUserFailer",
            payload: error.message
        })
    }
}

export const populearUsersget = () => async (dispatch) => {
    try {

        dispatch({
            type: "populearUsersRequest"
        })

        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/popular/user`,
        )

        dispatch({
            type: "populearUsersSucess",
            payload: data
        })

        dispatch({
            type: "populearUsersClearError"
        })


    }

    catch (error) {
        dispatch({
            type: "populearUsersFailer",
            payload: error.message
        })
    }
}

export const AboutAccounts = (UserId) => async (dispatch) => {
    try {

        dispatch({
            type: "GetDateRequest"
        })

        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/AboutUser/${UserId}`,
        )

        dispatch({
            type: "GetDateSucess",
            payload: data
        })

        dispatch({
            type: "GetDateClearError"
        })

    }

    catch (error) {
        dispatch({
            type: "GetDateFailer",
            payload: error.message
        })
    }
}

export const followUnfollowUser = (id) => async (dispatch) => {

    try {
        dispatch({
            type: "followUnfollowRequest"
        })

        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/followAndFollowing/${id}`,
            {
                headers: {
                    "authorization": token
                }
            }
        )


        dispatch({
            type: "followUnfollowSucess",
            payload: data
        })

        dispatch({
            type: "followUnfollowClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "followUnfollowFailer",
            payload: error.message
        })

    }

}

export const getFollowerFollowingUser = (id, find) => async (dispatch) => {
    try {
        dispatch({
            type: "getFollowerFollowingRequest"
        })


        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/getFollowerAndFollowing/${id}`,
            {
                find
            }
        )


        dispatch({
            type: "getFollowerFollowingSucess",
            payload: data
        })

        dispatch({
            type: "getFollowerFollowingClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "getFollowerFollowingFailer",
            payload: error.message
        })
    }
}

export const SerchUsersGet = (name, Users) => async (dispatch) => {
    try {

        dispatch({
            type: "searchUsersRequest"
        })

        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/users?name=${name}`,
        )

        dispatch({
            type: "searchUsersSucess",
            payload: data
        })

        dispatch({
            type: "searchclearError"
        })


    }

    catch (error) {
        dispatch({
            type: "searchUsersFailer",
            payload: error.message
        })
    }
}