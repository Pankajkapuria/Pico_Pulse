import { createReducer } from '@reduxjs/toolkit';

export const getMessageReducer = createReducer({}, {
    getMessageRequest: (state) => {
        state.getMessageloading = true
    },
    getMessageSucess: (state, action) => {
        state.getMessageloading = false
        state.message = action.payload
    },
    getMessageFailer: (state, action) => {
        state.getMessageloading = false
        state.getMessageerror = action.payload
        state.message = null
    },

    getMessageClearError: (state) => {
        state.getMessageerror = null
    },

    cleargetMessage: (state) => {
        state.message = null
    }
})

export const getContacts = createReducer({}, {
    getContactsRequest: (state) => {
        state.getContactsloading = true
    },
    getContactsSucess: (state, action) => {
        state.getContactsloading = false
        state.getContactsmessage = action.payload
    },
    getContactsFailer: (state, action) => {
        state.getContactsloading = false
        state.getContactserror = action.payload
    },

    getContactsClearError: (state) => {
        state.getContactserror = null
    },

    cleargetContacts: (state) => {
        state.getContactsmessage = null
    }
})

// export const sendMessage = createReducer({}, {
//     sendMessageRequest: (state) => {
//         state.sendMessageloading = true
//     },
//     getContactsSucess: (state, action) => {
//         state.getContactsloading = false
//         state.getContactsmessage = action.payload
//     },
//     getContactsFailer: (state, action) => {
//         state.getContactsloading = false
//         state.getContactserror = action.payload
//     },

//     getContactsClearError: (state) => {
//         state.getContactserror = null
//     },

//     cleargetContacts: (state) => {
//         state.getContactsmessage = null
//     }
// })