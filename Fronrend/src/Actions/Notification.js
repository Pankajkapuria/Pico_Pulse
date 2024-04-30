import axios from 'axios'

export const addNotifiaction = async ({ who, type, PostId, comment }) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/notification/creat/notification`,
            {
                who,
                type,
                PostId,
                comment
            },
            {
                "headers": {
                    authorization: token
                }
            }
        )
    }
    catch (error) {
        console.error(error)
    }
}

export const getNotification = () => async (dispatch) => {
    try {
        dispatch({
            type: "getNotificationRequest"
        })
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/notification/get/notifications`,
            {
                "headers": {
                    authorization: token
                }
            }
        )
        dispatch({
            type: "getNotificationSucess",
            payload: data
        })

        dispatch({
            type: "NotificationClearError"
        })
    }
    catch (error) {
        dispatch({
            type: "getNotificationFailer",
            payload: error.message
        })
    }
}

