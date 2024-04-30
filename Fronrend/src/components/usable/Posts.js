import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../usable/Posts.css'

import { Dialog } from '@mui/material'

import {
    MoreHoriz,
    FavoriteBorder,
    Favorite,
    MapsUgcRounded,
    MoreVert
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { addCommentOnPost, getLikeComment, likepost } from '../../Actions/post'
import User from './User'
import Comments from './Comments'
import PostOption from './PostOption';
import Loading from './Loading';
// import { addNotifiaction } from '../../Actions/Notification'
import Actions from '../../Actions/EventActions'
import { addNotifiaction } from '../../Actions/Notification'


const Posts = ({
    owner,
    ownerProfileImg,
    ownerId,
    ownerName,
    location,
    posttime,
    postImg,
    like = [],
    caption,
    comments = [],
    PostId,
    followUnfollowbtn,
    Notifactionsocket
}) => {


    const [likes, setLikes] = useState(false);
    const [likeUserSeen, setlikeUserSeen] = useState(false);
    const [countlikes, setcountlikes] = useState(like.length);

    const [newComment, setNewComment] = useState();
    const [addCommentNew, setaddCommentNew] = useState(null);
    const [exciteduUser, setExciteduUser] = useState();
    const [commentUserSeen, setcommentUserSeen] = useState(false);

    const [isAccount, setisAccount] = useState(false);
    const [isCommentSelf, setisCommentSelf] = useState(false);

    const [postOptionsToggle, setpostOptionsToggle] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
    const { Commentloading, message } = useSelector((state) => state.addComment)
    const { getLikeCommentloading, liComMessage } = useSelector((state) => state.getLikeComment)
    const { isAuthenticated } = useSelector((state) => state.user)

    const navigate = useNavigate();

    const hendlelikes = () => {
        if (likes) {
            setcountlikes(countlikes - 1);
        }
        else {
            setcountlikes(countlikes + 1);
            addNotifiaction({ who: owner, type: 'like', PostId })
            if (Notifactionsocket) {
                Notifactionsocket.emit(Actions.NOTIFICATION_GET, {
                    userName: user?.user?.name,
                    who: ownerId,
                    type: 'like'
                })
            }
        }

        setLikes(!likes);
        dispatch(likepost(PostId));
    }


    const getAllLikes = () => {
        dispatch(getLikeComment(PostId, 'likes'));
    }


    const getAllComment = () => {
        dispatch(getLikeComment(PostId, 'Comments'));
    }


    const addCommentHeandler = (e) => {
        e.preventDefault()
        dispatch(addCommentOnPost(PostId, newComment));
        addNotifiaction({ who: owner, type: 'comment', PostId, comment: newComment })
        if (Notifactionsocket) {
            Notifactionsocket.emit(Actions.NOTIFICATION_GET, {
                userName: user?.user?.name,
                who: ownerId,
                type: 'comment'
            })
        }
        setExciteduUser(null);
        setaddCommentNew(newComment);
        setNewComment('')
        setisCommentSelf(true);
    }


    useEffect(() => {
        for (let i = 0; i < like.length; i++) {
            if (user && user.user && like[i] === user.user._id) {
                setLikes(true)
                break;
            }
        }
        if (ownerId === user?.user?.UserId) {
            setisAccount(true)
        }

    }, [like, user, ownerId])


    useEffect(() => {
        if (!getLikeCommentloading && liComMessage && liComMessage.comment) {
            const c = liComMessage.comment.filter((e) => e.user._id === user.user._id)
            setExciteduUser(c[0]);
            setaddCommentNew(null);
            setisCommentSelf(true);
        }
    }, [getLikeCommentloading, liComMessage, user])


    return (
        <div className='Posts'>

            <div className="postHeader">
                <Link to={`/account/User/${ownerId}`}>
                    <img className='img1' src={ownerProfileImg} alt='img' />
                    <div className='PostHeaderContant'>
                        <p className='p1'>{ownerName} <span className='color1'> : {posttime}</span> </p>
                        <p className='p2'>{location ? location : 'unknown location'}</p>

                    </div>
                </Link>
                <p onClick={() => setpostOptionsToggle(true)}><MoreHoriz /></p>

            </div>

            <div className="postContainer">
                <img className='img3' src={postImg} alt='img' />
            </div>

            <div className="postfooter">
                <div className='postfooterIcon'>
                    <p onClick={() => { isAuthenticated ? hendlelikes() : navigate('/account/login') }} >
                        {likes ? <Favorite style={{ color: 'red' }} /> : <FavoriteBorder />}
                    </p>
                    <p onClick={() => {
                        if (isAuthenticated) {
                            setcommentUserSeen(true);
                            getAllComment();
                        }
                        else {
                            navigate('/account/login')
                        }

                    }} ><MapsUgcRounded /></p>
                </div>

                <div className='postfooterContainer'>
                    <p onClick={() => {
                        if (countlikes > 0) {
                            setlikeUserSeen(!likeUserSeen);
                            getAllLikes();
                        };
                    }} className='likes'>{countlikes} likes</p>
                    <p className='caption'>{caption}</p>
                </div>
            </div>





            {/* ============******* likes **********========= */}
            <Dialog open={likeUserSeen} onClose={() => {
                setlikeUserSeen(!likeUserSeen); dispatch({
                    type: "getLikeCommentClearMessage"
                })
            }
            }>

                {getLikeCommentloading ? <> <div className="dialogBox"><Loading /></div>  </> : <>
                    <div className="dialogBox">
                        <p className='bb1 '>Likes</p>
                        {isAuthenticated ?
                            <div className="dialogBoxuser m1">

                                {likes && user && user.user &&
                                    <Link to={`account/User/${user.user.UserId}`}> < User
                                        postImage={user.user.avater.url}
                                        UserName={user.user.name}
                                        UserId={user.user.UserId}
                                        LinkBtn="follow"
                                    />
                                    </Link>
                                }
                                {!getLikeCommentloading && liComMessage && liComMessage.likes && liComMessage.likes.map((e) => {
                                    if (e._id !== user.user._id) {
                                        return <Link to={`account/User/${e.UserId}`}>
                                            <User
                                                key={e._id}
                                                postImage={e.avater.url}
                                                UserName={e.name}
                                                UserId={e.UserId}
                                                LinkBtn="follow"
                                            />
                                        </Link>
                                    }
                                    return <> </>

                                })}

                            </div> :
                            <div className="dialogBoxuser ">
                                {!getLikeCommentloading && liComMessage && liComMessage.likes && liComMessage.likes.map((e) => (
                                    <User
                                        key={e._id}
                                        postImage={e.avater.url}
                                        UserName={e.name}
                                        UserId={e.UserId}
                                        LinkBtn="follow"
                                        justifyContent="space-between"
                                    />
                                ))}

                            </div>}

                    </div>
                </>}

            </Dialog>



            {/* ============******* Comments **********========= */}
            <Dialog open={commentUserSeen} onClose={() => {
                setcommentUserSeen(!commentUserSeen); dispatch({
                    type: "getLikeCommentClearMessage"
                })
            }}>
                {getLikeCommentloading ? <div className='dialogBoxComments'><Loading /></div> : <>
                    <div className="postUser bb1">
                        <div className="postUserImg">
                            <img className='Commentavter' src={ownerProfileImg} alt='img' />
                            <Link to={`account/User/${ownerId}`}>{ownerId}</Link>
                        </div>
                        <div className="postUserBtn">
                            <Link to='/'> <MoreVert /> </Link>
                        </div>
                    </div>



                    <div className="dialogBoxComments">
                        <div className="commentConnents">
                            {exciteduUser ? <> <Comments
                                UserImg={exciteduUser.user.avater.url}
                                UserId={exciteduUser.user.UserId}
                                PostComment={exciteduUser.comment}
                                isAccount={isAccount}
                                isCommentSelf={isCommentSelf}
                                PostId={PostId}
                                commentId={exciteduUser._id}
                            /> </> : <></>}

                            {
                                !Commentloading && message && message.success && addCommentNew ? <Comments
                                    UserImg={user.user.avater.url}
                                    UserId={user.user.UserId}
                                    PostComment={addCommentNew}
                                    isAccount={isAccount}
                                    isCommentSelf={isCommentSelf}
                                    PostId={PostId}
                                /> : <></>
                            }


                            {!getLikeCommentloading && liComMessage && liComMessage.comment && liComMessage.comment.length > 0 ? <>
                                {liComMessage.comment.map((e) => {
                                    if (e.user.UserId !== user.user.UserId) {
                                        return <Comments key={e._id}
                                            UserImg={e.user.avater.url}
                                            UserId={e.user.UserId}
                                            PostComment={e.comment}
                                            exciteduUser={exciteduUser}
                                            isAccount={isAccount}
                                            PostId={PostId}
                                            commentId={e._id}
                                        />
                                    }
                                    return <></>
                                })}
                            </> : <> <p style={{ textAlign: 'center' }}>No Comment yet</p>  </>}


                        </div>
                    </div>


                    <div className="addComment bt1">
                        <input onChange={(e) => setNewComment(e.target.value)} placeholder='Add a Comment' className='input fw2' type="text" name="" id="" value={newComment} />
                        <button disabled={Commentloading} className='btn1' onClick={addCommentHeandler} > post </button>
                    </div>
                </>}
            </Dialog>




            <Dialog open={postOptionsToggle} onClose={() => setpostOptionsToggle(false)}>
                <div className="postOptions">
                    <PostOption
                        isAccount={isAccount}
                        PostId={PostId}
                        PostImg={postImg}
                        caption={caption}
                        ownerId={ownerId}
                        ownerProfileImg={ownerProfileImg}
                        followUnfollowbtn={followUnfollowbtn}
                    />
                    <div className='CommentOptionsDialog'>
                        <p className='bb1 dp' onClick={() => { setpostOptionsToggle(false) }}>Cancal</p>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default Posts
