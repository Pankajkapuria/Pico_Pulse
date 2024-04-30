import React, { useEffect } from 'react'
import TextBox from './TextBox'
import './notification.css'
import { getNotification } from '../../Actions/Notification'
import { useDispatch, useSelector } from 'react-redux'
import Loading from './../usable/Loading';

const Notification = () => {
    const dispatch = useDispatch();
    const { getNotificationloading, getNotifications } = useSelector((state) => state.NotificationReducer)
    const { user } = useSelector((state) => state.user)

    useEffect(() => {
        dispatch(getNotification())
    }, [dispatch])


    return (
        <div className='Notification bg4'>
            <div className="NotificationTop d-flex align-items justify-space-around pp">
                <h1 className='p4'>Notifications</h1>
                <img className='img1' src={user?.user.avater.url} alt='img' />
            </div>
            <div className="NotificationBottom d-flex f-d-col align-items">
                {getNotificationloading ? <><Loading /></> : <>
                    {getNotifications?.notifiactions?.Notification?.length > 0 ? <>
                        {
                            getNotifications.notifiactions.Notification.map((e) => {
                                // console.log(e)
                                if (e.Notifiactiontype === 'comment' || e.Notifiactiontype === 'like') {
                                    return <TextBox key={e._id} imgUrl={e.who.url}
                                        userId={e.who.Id}
                                        NotificationText={`${e.Notifiactiontype} on your post ${e.content.comment}`}
                                        postUrl={e.content.postUrl}
                                    />
                                }
                                if (e.Notifiactiontype === 'profile seen') {
                                    return <TextBox key={e._id} imgUrl={e.who.url}
                                        userId={e.who.Id}
                                        NotificationText={`, who you might know. seen your profile`}
                                    />
                                }
                                return <TextBox key={e._id} imgUrl={e.who.url}
                                    userId={e.who.Id}
                                    NotificationText={`start follow you`}
                                />
                            })
                        }
                    </> : <>
                        <p className="p6">no notification</p>
                    </>}
                </>}
            </div>
        </div >
    )
}

export default Notification
