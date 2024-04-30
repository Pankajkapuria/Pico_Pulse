import React, { useEffect, useState } from 'react'
import '../CreatPost/CreatPost.css'
import { AddPhotoAlternateOutlined, ArrowBack, LocationOnOutlined, VideoCameraBackOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost } from '../../Actions/post';
import { Button } from '@mui/material';
import toast from 'react-hot-toast'
const CreatPost = ({
    postOptions,
    img,
    captions,
    backOptions,
    edit,
    PostId
}) => {

    const [postOption, setpostOption] = useState(postOptions);
    const [Caption, setCaption] = useState(captions);
    const [image, setimage] = useState(img);
    const [location, setlocation] = useState();

    const dispatch = useDispatch();
    const { addPostloading, updatePostloading, addPosterror, updatePosterror, message } = useSelector((state) => state.addPost)
    const { user } = useSelector((state) => state.user)


    const hendelImgChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setimage(Reader.result)
                setpostOption(true)
            }
        }
    }

    useEffect(() => {
        if (addPosterror) {
            toast.error('post not created')
            dispatch({
                type: "addPostClearError"
            })
            setpostOption(false);
        }

        if (updatePosterror) {
            toast.error('post not updated')
            dispatch({
                type: "UpdatePostClearError"
            })
        }

        if (message && message.success) {
            toast.success(message.message);
            setpostOption(false);
        }

    }, [dispatch, addPosterror, message, updatePosterror])

    const creatPost = () => {
        dispatch(addPost(Caption, image, location))
    }

    const UpdatePost = () => {
        console.log(location)
        dispatch(updatePost(PostId, Caption, location))
    }



    return (
        <>
            {postOption ? <>
                <div className="postCreat">
                    <div className=" fileSelectUpper postCreatUpper">
                        {backOptions === 'backBtn' ? <>
                            <p style={{ cursor: 'pointer' }} onClick={() => { setpostOption(false); setimage(null) }}><ArrowBack /></p>
                        </> : <>
                            <p style={{ cursor: 'pointer' }} >cancal</p>
                        </>}
                        {edit ? <>Edit info</> : <><p>Create new post</p></>}
                        {edit ? <>
                            <Button className='btn1' disabled={updatePostloading} onClick={() => { UpdatePost() }} > Done </Button>
                        </> : <>
                            <Button title='button' className='btn1' disabled={addPostloading} onClick={creatPost} > post </Button>
                        </>}
                    </div>
                    <div className="postCreatDown">
                        <div className="creatImg">
                            <img src={image} alt='img' />
                        </div>
                        <div className="creatImgOptions">
                            <div className='creatImgOptions_dp'>
                                {user && user.user ? <>
                                    <img className='img6' src={user.user.avater.url} alt='img' />
                                    <p >{user.user.UserId}</p>
                                </> : <></>}

                            </div>
                            <div className="textarea">
                                <textarea maxLength='2000' placeholder='Write a caption ...' value={Caption} onChange={(e) => setCaption(e.target.value)} />
                                <p>{Caption.length}/2,000</p>
                            </div>
                            <div className="addlocation">
                                <input style={{ border: 'none' }} className='input fw2' type='text' value={location} onChange={(e) => { setlocation(e.target.value) }} placeholder='Add Location' />
                                <LocationOnOutlined />
                            </div>
                        </div>
                    </div>
                </div>
            </> : <>
                <div className='fileSelect' >
                    <div className="fileSelectUpper">
                        <p>Create new post</p>
                    </div>
                    <div className="fileSelectDown">

                        <div className='PhotoIcon'><AddPhotoAlternateOutlined style={{ fontSize: '5vmax' }} /> <VideoCameraBackOutlined style={{ fontSize: '5vmax' }} /></div>
                        <p className='p4'>Drag photos and videos here</p>
                        <input type='file' accept='image/*' onChange={hendelImgChange} />
                    </div>
                </div>
            </>}

        </>
    )
}

export default CreatPost
