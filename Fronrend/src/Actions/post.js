import axios from 'axios'


export const likepost = (id) => async (dispatch) => {
    try {

        dispatch({
            type: "likeRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/likeAndUnlike/${id}`,
            {
                "headers": {
                    authorization: token
                }
            }
        )

        dispatch({
            type: "likeSucess",
            payload: data
        })

        dispatch({
            type: "likeClearError"
        })


    }

    catch (error) {
        dispatch({
            type: "likeFailer",
            payload: error.message
        })
    }
}


export const addCommentOnPost = (id, newComment) => async (dispatch) => {
    try {

        dispatch({
            type: "CommentRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/addComment/${id}`,
            {
                comment: newComment
            },
            {
                "headers": {
                    authorization: token
                }
            }
        )



        dispatch({
            type: "CommentSucess",
            payload: data
        })

        dispatch({
            type: "CommentClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "CommentFailer",
            payload: error.message
        })
    }
}


export const CommentDeleteOnPost = (id, commentId) => async (dispatch) => {
    try {

        dispatch({
            type: "CommentDeleteRequest"
        })



        const token = localStorage.getItem('token');
        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/deleteComment/${id}`,
            {
                commentId
            },
            {
                "headers": {
                    authorization: token
                }
            }
        )


        dispatch({
            type: "CommentDeleteSucess",
            payload: data
        })

        dispatch({
            type: "CommentDeleteClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "CommentDeleteFailer",
            payload: error.message
        })
    }
}

export const addPost = (caption, image, location) => async (dispatch) => {
    try {

        dispatch({
            type: "addPostRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/upload`,
            {
                caption, image, location
            },
            {
                "headers": {
                    authorization: token
                }
            }
        )

        dispatch({
            type: "addPostSucess",
            payload: data
        })



        dispatch({
            type: "addPostClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "addPostFailer",
            payload: error.message
        })
    }
}

export const updatePost = (id, caption, location) => async (dispatch) => {
    try {
        dispatch({
            type: "UpdatePostRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/update_caption/${id}`,
            {
                caption,
                location
            },
            {
                "headers": {
                    authorization: token
                }
            }
        )


        dispatch({
            type: "UpdatePostSucess",
            payload: data
        })

        dispatch({
            type: "UpdatePostClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "UpdatePostFailer",
            payload: error.message
        })
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deletePostRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/delete/${id}`,
            {
                "headers": {
                    authorization: token
                }
            }
        )


        dispatch({
            type: "deletePostSucess",
            payload: data
        })

        dispatch({
            type: "deletePostClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "deletePostFailer",
            payload: error.message
        })
    }
}

export const getPost = (id) => async (dispatch) => {
    try {

        dispatch({
            type: "getPostRequest"
        })


        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/getPosts/${id}`,
        )


        dispatch({
            type: "getPostSucess",
            payload: data
        })

        dispatch({
            type: "getPostClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "getPostFailer",
            payload: error.message
        })
    }
}

export const getLikeComment = (id, find) => async (dispatch) => {
    try {
        dispatch({
            type: "getLikeCommentRequest"
        })

        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/post/getLikeComment/${id}`,
            {
                find
            }
        )


        dispatch({
            type: "getLikeCommentSucess",
            payload: data
        })

        dispatch({
            type: "getLikeCommentClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "getLikeCommentFailer",
            payload: error.message
        })
    }
}

export const getPopulearPosts = () => async (dispatch) => {
    try {
        dispatch({
            type: "populerPostsRequest"
        })

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/post/populerPosts`)


        dispatch({
            type: "populerPostsSucess",
            payload: data
        })


        dispatch({
            type: "populerPostsClearError"
        })

    }
    catch (error) {
        dispatch({
            type: "populerPostsFailer",
            payload: error.message
        })
    }
}