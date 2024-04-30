import axios from 'axios'

export const getMessage = (id) => async (dispatch) => {
    try {

        dispatch({
            type: "getMessageRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/message/getConversation/${id}`,
            {
                "headers": {
                    authorization: token
                }
            }
        )

        dispatch({
            type: "getMessageSucess",
            payload: data
        })

        dispatch({
            type: "getMessageClearError"
        })


    }

    catch (error) {
        dispatch({
            type: "getMessageFailer",
            payload: error.message
        })
    }
}

export const getContacts = () => async (dispatch) => {
    try {

        dispatch({
            type: "getContactsRequest"
        })


        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/message/getContects/`,
            {
                "headers": {
                    authorization: token
                }
            }
        )

        dispatch({
            type: "getContactsSucess",
            payload: data
        })

        dispatch({
            type: "getContactsClearError"
        })


    }

    catch (error) {
        dispatch({
            type: "getContactsFailer",
            payload: error.message
        })
    }
}