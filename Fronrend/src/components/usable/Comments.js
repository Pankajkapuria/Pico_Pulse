import React, { useState } from 'react'
import './Comments.css'

import { MoreHoriz } from '@mui/icons-material'
import { Dialog } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CommentDeleteOnPost } from '../../Actions/post'

const Comments = ({
    UserImg,
    UserId,
    PostComment,
    isCommentSelf,
    PostId,
    commentId,
    isAccount
}) => {


    const dispatch = useDispatch();

    const [CommentOptions, setCommentOptions] = useState(false);
    const [CommentDelete, setCommentDelete] = useState(false);

    const heandleCommentDelete = () => {
        dispatch(CommentDeleteOnPost(PostId, commentId));
        setCommentOptions(false);
        setCommentDelete(true);
    }



    return (

        <>
            {!CommentDelete ? <>
                <div className='CommentContians'>
                    <Link to={`/account/User/${UserId}`}><img className='Commentavter' src={UserImg} alt='img' /></Link>
                    <div className='CommentUser'>
                        <Link to={`account/User/${UserId}`}> <span className=''> {UserId} </span> {PostComment} </Link>
                        <p className='CommentTime'> 10d  <span onClick={() => setCommentOptions(true)} > <MoreHoriz fontSize='small' /> </span> </p>
                    </div>
                </div>
            </> : <></>}



            <Dialog open={CommentOptions} onClose={() => { setCommentOptions(false) }} >
                <div className="CommentOptionsDialog ">
                    {isCommentSelf || isAccount ? <><p onClick={heandleCommentDelete} className='bb1 p6' >Delete</p></> : <></>}
                    <p className='bb1 dp' style={{ fontWeight: '600' }}> <Link to={`/account/User/${UserId}`}>Profile</Link> </p>
                    <p className='bb1 dp' onClick={() => { setCommentOptions(false) }} >cancel</p>
                </div>
            </Dialog>

        </>
    )
}

export default Comments
