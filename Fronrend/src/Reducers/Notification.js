import { createReducer } from '@reduxjs/toolkit';

export const getNotificationReducer = createReducer({}, {
    getNotificationRequest: (state) => {
        state.getNotificationloading = true
    },
    getNotificationSucess: (state, action) => {
        state.getNotificationloading = false
        state.getNotifications = action.payload
    },
    getNotificationFailer: (state, action) => {
        state.getNotificationloading = false
        state.getNotificationError = action.payload
    },
    Notificationclear: (state) => {
        state.getNotifications = null
    },
    NotificationClearError: (state, action) => {
        state.getNotificationError = null
    }
})