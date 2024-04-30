import React, { useEffect, useState } from 'react'
import '../Account/Account.css'
import { GridOn, Settings } from '@mui/icons-material'
import ImgCard from '../usable/ImgCard'
import { useDispatch, useSelector } from 'react-redux'
import { anotherUser, followUnfollowUser, getFollowerFollowingUser } from '../../Actions/user'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Dialog } from '@mui/material'
import User from '../usable/User'
import axios from 'axios'
import { addNotifiaction } from '../../Actions/Notification'
import Actions from '../../Actions/EventActions'
import Loading2 from '../Loading/Loading2'


const Account = ({ Notifactionsocket }) => {

    const dispatch = useDispatch();
    const params = useParams();
    const naviagte = useNavigate();


    const [follow, setfollow] = useState('unfollow');
    const [followersCount, setfollowersCount] = useState(0);
    const [seenFollowerFollowing, setseenFollowerFollowing] = useState(false);
    const [followerBtn, setfollowerBtn] = useState();

    const { AnotherUserloading, AnotherUser } = useSelector((state) => state.anotherUserget)
    const { isAuthenticated, user } = useSelector((state) => state.user)
    const { updatemessage } = useSelector((state) => state.addPost)
    const { followUnfollowloading, followUnfollow, getFollowerFollowing, getFollowerFollowingloading } = useSelector((state) => state.followhendle)


    const hendleFollowUnfollow = () => {
        if (!isAuthenticated) {
            naviagte('/account/login')
            return;
        }
        dispatch(followUnfollowUser(params.UserId));
    }

    const hendleGetFollowers = () => {
        setfollowerBtn('follower')
        setseenFollowerFollowing(true)
        dispatch(getFollowerFollowingUser(params.UserId, 'follower'));
    }

    const hendleGetFollowing = () => {
        setfollowerBtn('following')
        setseenFollowerFollowing(true)
        dispatch(getFollowerFollowingUser(params.UserId, 'followering'));
    }


    const chatConversation = async () => {

        // if already conversation then redirect on message page 
        if (user && AnotherUser && user?.user?.message?.find(conversation => conversation.user === AnotherUser?.user?._id)) {
            const ConverstionUser = user.user.message.find(conversation => conversation.user === AnotherUser?.user?._id);
            naviagte(`/direct/${ConverstionUser?.conversionId}`)
        }
        else {
            //  conversation is not created then conversation creat and after conversation creat redirect message page  
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/message/conversation/${AnotherUser?.user?._id}`,
                {},
                {
                    "headers": {
                        authorization: token
                    }
                }
            )
            if (data?.conversion) {
                naviagte(`/direct/${data?.conversion?._id}`)
            }
            else {
                alert('try after some time');
            }
        }
    }

    useEffect(() => {
        if (followUnfollow) {
            if (followUnfollow && followUnfollow.message === 'follow') {
                addNotifiaction({ who: AnotherUser?.user?._id, type: 'follow' })
                if (Notifactionsocket) {
                    Notifactionsocket.emit(Actions.NOTIFICATION_GET, {
                        userName: user?.user?.name,
                        who: AnotherUser?.user?.UserId,
                        type: 'follow'
                    })
                }
                setfollow('unfollow');
                setfollowersCount(followersCount + 1);
            }
            if (followUnfollow && followUnfollow.message === 'unfollow') {
                setfollow('follow');
                setfollowersCount(followersCount - 1);
            }
            dispatch({
                type: 'followUnfollowClearMessage'
            })
        }
    }, [followUnfollow, follow, followersCount, dispatch, AnotherUser, Notifactionsocket, user])


    useEffect(() => {
        dispatch(anotherUser(params.UserId));
    }, [dispatch, params.UserId])


    useEffect(() => {
        if (AnotherUser && AnotherUser.user && AnotherUser.user.follower) {
            setfollowersCount(AnotherUser.user.follower.length);
            let found = false;
            for (let i = 0; i < AnotherUser.user.follower.length; i++) {
                if (user && user.user && user.user._id === AnotherUser.user.follower[i]) {
                    found = true
                    setfollow('unfollow')
                    break;
                }
            }
            if (found === false) {
                setfollow('follow')
            }
        }
    }, [AnotherUser, user])

    useEffect(() => {
        if (user?.user && AnotherUser?.user) {
            const userExit = user.user.followering.indexOf(`${AnotherUser.user._id}`);
            if (userExit === -1 && user.user._id !== AnotherUser.user._id) {
                addNotifiaction({ who: AnotherUser?.user?._id, type: 'profile seen' })
                Notifactionsocket.emit(Actions.NOTIFICATION_GET, {
                    userName: user.user.name,
                    who: AnotherUser.user.UserId,
                    type: 'profile Seen'
                })
            }
        }
    }, [user, AnotherUser, Notifactionsocket])



    useEffect(() => {
        if (updatemessage && updatemessage.message === "post delete") {
            dispatch(anotherUser(params.UserId));
        }
    }, [dispatch, params.UserId, updatemessage])





    return (

        !AnotherUserloading && AnotherUser && AnotherUser.user ? <>
            <div className='Account' >
                <div className="AccountUpper bb1">
                    <div className="AccountHeader">
                        <div className="AccountImg d-flex">
                            <img className='img2' src={AnotherUser.user.avater.url} alt='img' />
                        </div>

                        <div className="AccountInFo">
                            <div className='AccountInfoHeader d-flex' style={{ alignItems: 'center' }} >
                                <p>{AnotherUser.user.UserId}</p>
                                {!isAuthenticated ? <><button onClick={() => { hendleFollowUnfollow() }} className='btn2' > {follow} </button></> : <></>}
                                {user?.user?.UserId !== params.UserId && isAuthenticated ? <>
                                    {followUnfollowloading ? <><Loading2 /></> : <>
                                        <button onClick={() => { hendleFollowUnfollow() }} className='btn2' > {follow} </button>
                                    </>}
                                </> : <> {user ? <>
                                    <Link to='/accounts/setProfile/' className='btn2 bg2' > Edit Profile </Link>
                                    <Link to='/account/setting'><Settings /></Link>
                                </> : <></>} </>}

                                {user?.user?.UserId !== params.UserId && follow ? <> <button className='btn2' onClick={() => { chatConversation() }} > Message </button> </> : <></>}
                            </div>

                            <div className="AccountInfomid d-flex color2">
                                <p> <span className='fw1'> {AnotherUser.user.post.length}</span> Posts</p>
                                <p onClick={() => { hendleGetFollowers() }} className='cpointer'> <span className='fw1 '>{followersCount}</span> followers </p>
                                <p onClick={() => { hendleGetFollowing() }} className='cpointer'> <span className='fw1'>{AnotherUser.user.followering.length}</span> following </p>
                            </div>

                            <div className="AccountInfoBio">
                                <p className='p5 color2'>{AnotherUser.user.name}</p>
                                <p > My name is जय श्री राम 🚩 <br />
                                    " You only live once , but you do it right , <br />
                                    Once is enough !! <br />
                                    🏡 𝑹𝑱-𝟑𝟏 🔁 𝑼𝒅𝒂𝒊𝒑𝒖𝒓 💫  </p>
                                {/* <p>{user?.user?.Bio}</p> */}
                            </div>

                        </div>

                    </div>
                </div>


                <div className="AccountPosts">
                    <div className='d-flex '>  <p><GridOn style={{ fontSize: '1rem' }} /> <span style={{ fontSize: '0.9rem' }}  >Posts</span></p> </div>
                    <div className='d-flex' >
                        {AnotherUser.user && AnotherUser.user.post.map((e) => {
                            return user && user?.user?.follower?.includes(e.owner) ? <>
                                <ImgCard
                                    key={e._id}
                                    postUrl={e.image.url}
                                    PostId={e._id}
                                    ownerProfileImg={AnotherUser.user.avater.url}
                                    ownerId={AnotherUser.user.UserId}
                                    ownerName={AnotherUser.user.name}
                                    followUnfollowbtn="unfollow"
                                    owner={AnotherUser.user._id}
                                />
                            </> : <>
                                <ImgCard
                                    key={e._id}
                                    postUrl={e.image.url}
                                    PostId={e._id}
                                    ownerProfileImg={AnotherUser.user.avater.url}
                                    ownerId={AnotherUser.user.UserId}
                                    ownerName={AnotherUser.user.name}
                                    followUnfollowbtn="follow"
                                /></>

                        })}
                    </div>
                </div>



                <Dialog open={seenFollowerFollowing} onClose={() => {
                    setseenFollowerFollowing(false)
                    dispatch({
                        type: 'getFollowerFollowingClearMessage'
                    })
                }}>
                    <div onClick={() => { setseenFollowerFollowing(false) }} className="dialogBoxuser seenFollowerFollowing">
                        {user && user.user ? <>
                            {user.user.UserId === params.UserId ? <>
                                <p className='textalignc fw1 bb1 '>{followerBtn === 'follower' ? "Follower" : "Following"}</p>
                                <div className='plr dialogBoxuser'>
                                    {!getFollowerFollowingloading && getFollowerFollowing?.follower?.map((e) => (
                                        <Link to={`/account/User/${e.UserId}`}>
                                            <User
                                                key={e._id}
                                                postImage={e.avater.url}
                                                UserName={e.name}
                                                UserId={e.UserId}
                                                LinkBtn={followerBtn === 'follower' ? 'Remove' : 'following'}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </> : <>
                                <p className='textalignc fw1 bb1 '>{followerBtn === 'follower' ? "Follower" : "Following"}</p>
                                {!getFollowerFollowingloading && getFollowerFollowing?.follower?.map((e) => (
                                    user && user.user && user.user.followering.includes(e._id) ? <>
                                        <Link to={`/account/User/${e.UserId}`} className='plr dialogBoxuser'>
                                            <User
                                                key={e._id}
                                                postImage={e.avater.url}
                                                UserName={e.name}
                                                UserId={e.UserId}
                                                LinkBtn='following'
                                            />
                                        </Link>
                                    </> : <></>
                                ))}
                                {!getFollowerFollowingloading && getFollowerFollowing?.follower?.map((e) => (
                                    user.user.followering.includes(e._id) ? <></> : <>
                                        {e._id === user.user._id ? <>
                                            <Link to={`/account/User/${e.UserId}`} className='plr dialogBoxuser'>
                                                <User
                                                    key={e._id}
                                                    postImage={e.avater.url}
                                                    UserName={e.name}
                                                    UserId={e.UserId}
                                                />
                                            </Link>
                                        </> : <>
                                            <Link to={`/account/User/${e.UserId}`} className='plr dialogBoxuser'>
                                                <User
                                                    key={e._id}
                                                    postImage={e.avater.url}
                                                    UserName={e.name}
                                                    UserId={e.UserId}
                                                    LinkBtn="follow"
                                                />
                                            </Link >
                                        </>}
                                    </>
                                ))}
                            </>}

                        </> : <>
                            <p className='textalignc fw1 bb1 '>{followerBtn === 'follower' ? "Follower" : "Following"}</p>
                            <div className='plr dialogBoxuser'>
                                {!getFollowerFollowingloading && getFollowerFollowing?.follower?.map((e) => (
                                    <Link to={`/account/User/${e.UserId}`}>
                                        <User
                                            key={e._id}
                                            postImage={e.avater.url}
                                            UserName={e.name}
                                            UserId={e.UserId}
                                            LinkBtn="follow"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </>}
                    </div>
                </Dialog >

            </div >
        </> : <> <div className='d-flex justify-content align-items height1'><Loading2 /></div> </>

    )
}

export default Account
