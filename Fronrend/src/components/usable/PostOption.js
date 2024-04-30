import { Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CreatPost from '../CreatPost/CreatPost';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getPost } from '../../Actions/post';
import AboutAccount from './AboutAccount';
import '../usable/PostOption.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { followUnfollowUser } from '../../Actions/user';
import Loading from './Loading';
import toast from 'react-hot-toast';

const PostOption = ({
    isAccount,
    PostId,
    PostImg,
    caption,
    ownerId,
    ownerProfileImg,
    followUnfollowbtn
}
) => {

    const [edit, setedit] = useState(false);
    const params = useParams();
    const [deleteOptions, setdeleteOptions] = useState(false);
    const [followbtn, setfollowbtn] = useState(followUnfollowbtn);

    const dispatch = useDispatch();
    const naviagte = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.user)
    const { message } = useSelector((state) => state.addPost)
    const { followUnfollowloading, followUnfollow } = useSelector((state) => state.followhendle)

    const hendleDelete = () => {
        dispatch(deletePost(PostId));
    }

    const hendleUnfollow = () => {
        if (!isAuthenticated) {
            naviagte('/account/login')
            return;
        }
        dispatch(followUnfollowUser(ownerId));
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success('link copy sucessfully')
        }
        catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (message && message.message === 'capction update.') {
            setedit(false)
            dispatch({
                type: 'UpdatePostClearMessage'
            })
            dispatch(getPost(PostId));
        }
        if (followUnfollow && followUnfollow.sucess) {
            if (followUnfollow.message === 'follow') {
                setfollowbtn('unfollow')
            }
            if (followUnfollow.message === 'unfollow') {
                setfollowbtn('follow')
            }
            dispatch({
                type: 'followUnfollowClearMessage'
            })
        }
    }, [message, dispatch, PostId, followUnfollow])

    return (
        <>
            <div className="CommentOptionsDialog">
                {isAccount === true ? <><p className='bb1 p6 dp' onClick={() => { setdeleteOptions(true) }}  >Delete</p></> : <></>}
                {isAccount ? <><p className='bb1 dp' onClick={() => setedit(true)} >Edit</p></> : <>
                    {followUnfollowloading ? <><Loading /></> : <>
                        <p className='bb1 dp' onClick={() => { hendleUnfollow() }} style={{ fontWeight: '600', color: '#ff0000b6' }} >{followbtn}</p>
                    </>}
                </>}
                {isAccount ? <><p className='bb1 dp' >Hide like Count </p></> : <></>}
                {isAccount ? <><p className='bb1 dp' >Trun off commenting </p></> : <></>}
                <p className='bb1 dp'>  <Link to={`/account/User/${ownerId}`}  >Go To posts </Link> </p>
                <p className='bb1 dp' onClick={copyLink} >Copy link</p>
                <AboutAccount
                    User={ownerProfileImg}
                    UserId={ownerId}
                />
            </div>


            <Dialog open={edit} onClose={() => setedit(false)}>
                <CreatPost postOptions={true}
                    img={PostImg}
                    captions={caption}
                    backOptions=''
                    edit={edit}
                    PostId={PostId}
                />
            </Dialog>

            <Dialog open={deleteOptions} onClose={() => { setdeleteOptions(false) }}>
                <div className="deletepost">
                    <div className="deletePostHeader bb1" style={{ padding: '1.1vmax 0px' }}>
                        <p className='p4 textalignc color2 fw2'>Delete post?</p>
                        <p className='p2 textalignc'>Are you sure you want to delete this post?</p>
                    </div>
                    <p className='bb1 p6 dp textalignc' onClick={() => { hendleDelete() }}>Delete</p>
                    <p className='dp textalignc' onClick={() => { setdeleteOptions(false) }} >Cancle</p>
                </div>
            </Dialog>

            <></>
        </>
    )
}

export default PostOption
