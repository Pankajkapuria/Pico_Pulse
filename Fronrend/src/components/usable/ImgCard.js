import React, { useEffect, useState } from 'react'
import '../usable/ImgCard.css'
import { Dialog } from '@mui/material';
import Posts from './Posts';
import { useDispatch, useSelector } from 'react-redux';
import { getPost } from '../../Actions/post';
import Loading2 from '../Loading/Loading2';

const ImgCard = ({
    postUrl,
    PostId,
    ownerProfileImg,
    ownerId,
    ownerName,
    followUnfollowbtn,
    owner

}) => {


    const [postSeen, setpostSeen] = useState(false);

    const dispatch = useDispatch();
    const { addPostloading, message } = useSelector((state) => state.getPost)
    const { updatemessage } = useSelector((state) => state.addPost)

    const findpost = () => {
        dispatch(getPost(PostId));
    }


    useEffect(() => {

        if (updatemessage && updatemessage.message === "post delete") {
            setpostSeen(false);
            dispatch({
                type: 'deletePostClearMessage'
            })
        }

    }, [dispatch, postSeen, updatemessage])


    return (
        <>

            <div onClick={() => { setpostSeen(true); findpost() }} className='ImgCard'>
                <img className='img4' src={postUrl} alt='' />
            </div>

            <Dialog open={postSeen} onClose={() => {
                setpostSeen(false);
                dispatch({
                    type: "getPostClearMessage"
                })
            }}>
                <div className="postDialog">
                    {addPostloading ? <><div className='d-flex justify-content' ><Loading2 /></div></> : <>
                        {message && message.post ? <Posts
                            ownerProfileImg={ownerProfileImg}
                            ownerId={ownerId}
                            ownerName={ownerName}
                            location={message.post.location}
                            posttime='10'
                            postImg={postUrl}
                            like={message.post.likes}
                            caption={message.post.caption}
                            comments={message.post.comments}
                            PostId={PostId}
                            followUnfollowbtn={followUnfollowbtn}
                            owner={owner}
                        /> : <>try again</>}

                    </>}

                </div>
            </Dialog>

        </>
    )
}

export default ImgCard
