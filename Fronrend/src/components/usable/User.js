import React, { useState } from 'react'
import '../usable/User.css'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from './Loading'
import axios from 'axios'

const User = ({
    postImage,
    UserName,
    UserId,
    LinkBtn
}) => {

    const [btn, setbtn] = useState(LinkBtn);
    const naviagte = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.user)
    const { followUnfollowloading } = useSelector((state) => state.followhendle)


    const hendleFollowUnfollow = async () => {

        if (!isAuthenticated) {
            naviagte('/account/login')
            return;
        }
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/followAndFollowing/${UserId}`,
            {
                headers: {
                    "authorization": token
                }
            }
        )

        if (data && data.sucess) {
            if (data.message === 'follow') {
                setbtn('unfollow')
            }
            if (data.message === 'unfollow') {
                setbtn('follow')
            }
        }
    }



    return (
        <div className='post d-flex'>
            <div >
                <div className="postDetials d-flex">
                    <img className='img1' src={postImage} alt='' />
                    <div className="postDetialsName">
                        <p>{UserId}</p>
                        <p>{UserName}</p>
                    </div>
                </div>
            </div>
            {followUnfollowloading ? <><Loading /></> : <p className='postbtn cpointer' onClick={() => { hendleFollowUnfollow() }}> {btn} </p>}
        </div >)
}

export default User
