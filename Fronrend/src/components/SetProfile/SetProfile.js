import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../SetProfile/SetProfile.css'
import { Dialog } from '@mui/material';
import { updateUser } from '../../Actions/user';
import Loading2 from '../Loading/Loading2';
import toast from 'react-hot-toast';


const SetProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading, user, Updateloading, Updateuser } = useSelector((state) => state.user);


    const [image, setimage] = useState('data:image/jpeg;base64,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');
    const [name, setname] = useState();
    const [gender, setgender] = useState("Prefer not to say");
    const [Bio, setBio] = useState('');
    const [UserName, setUserName] = useState('');
    const [imageDialog, setimageDialog] = useState(false);

    const hendelImgChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setimage(Reader.result)
            }
        }
    }


    const hendleUpdatePost = () => {
        dispatch(updateUser(name, Bio, image, gender));
    }

    useEffect(() => {
        if (loading === false && isAuthenticated === false) {
            navigate('/');
        }
        if (user && user.user) {
            setimage(user.user.avater.url);
            setname(user.user.name);
            setUserName(user.user.UserId)
            if (user.user.gender) setgender(user.user.gender);
            if (user.user.Bio) setBio(user.user.Bio);

        }
    }, [isAuthenticated, navigate, loading, user])

    useEffect(() => {
        if (Updateuser && Updateuser.success) {
            toast.success('profile update')
            dispatch({
                type: 'UpdateUserclearMessage'
            })
            navigate(`/`)
        }
    }, [dispatch, Updateuser, navigate, user])


    return (
        <div className='setProfile'>
            <div>

                <div className='mtb'>
                    <p className='p4 setProfileflexLeft fw3'>Edit Profile</p>
                </div>

                <div className='setProfileflex mtb'>
                    <p className='setProfileflexLeft'>
                        <img className='img6' src={image} alt='img' />
                    </p>
                    <div className='setProfileflexright'>
                        <p className='fw3'>{UserName}</p>
                        <p className='btn1' onClick={() => setimageDialog(true)}>Change profile photo</p>
                    </div>
                </div>

                <div className='setProfileflex mtb'>
                    <p className='setProfileflexLeft p3'>name</p>
                    <div className='setProfileflexright'>
                        <input type='text' className='input b1 bg1' placeholder='name' value={name} onChange={(e) => setname(e.target.value)} />
                        <p className='p2'>your name change not your username change</p>
                    </div>
                </div>

                <div className='setProfileflex mtb'>
                    <p className='setProfileflexLeft p3'>Bio</p>
                    <div className='setProfileflexright '>
                        <div className="textarea b1 bg1" >
                            <textarea className='bg1' style={{ height: '5vmax' }} maxLength='150' placeholder='Write a bio ...'
                                value={Bio}
                                onChange={(e) => setBio(e.target.value)} />
                            <p className='bg1' >{Bio.length}/150</p>
                        </div>
                    </div>
                </div>

                <div className='setProfileflex mtb '>
                    <p className='setProfileflexLeft p3'>Gender</p>
                    <div className='setProfileflexright'>
                        <select className='input b1 bg1' value={gender} onChange={(e) => setgender(e.target.value)} >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Comman">Comman</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <p className='p2'>This won't be part of your public profile.</p>
                    </div>
                </div>

                <div className='setProfileflex mtb '>
                    <div className='setProfileflexLeft p3'><p> suggestions on profiles</p> </div>
                    <p className='setProfileflexright p1'>In this app people can see simileraccount suggestions on your profile,and wether your account can be suggested on other profile</p>
                </div>

                <div className='setProfileflex mtb'>
                    <p className='setProfileflexLeft p3'></p>
                    {Updateloading ? <><Loading2 /></> : <>
                        <button className='btn2' onClick={() => { hendleUpdatePost() }} style={{ backgroundColor: 'rgba(7, 49, 155, 0.764) ', color: 'white' }}>Sumbit</button>
                    </>}
                </div>
            </div>


            <Dialog open={imageDialog} onClose={() => setimageDialog(false)}>
                <div className='setImage textalignc mt'>
                    <div className=' bb1 '>
                        <img src={image} alt='img' className='img5 mt' />
                        <p className='p4 mt'>Synced profile photo</p>
                        <p className='p2 mb '>PicoPulce</p>
                    </div>
                    <div>
                        <p className='dp bb1 color3'  > <input type='file' accept='image/*' onChange={(e) => { hendelImgChange(e) }} /></p>
                        <p className='dp bb1 p6' onClick={() => {
                            setimage('data:image/jpeg;base64,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');
                            setimageDialog(false);
                        }}>Remove Current Photo</p>
                        <p className='dp bb1' onClick={() => setimageDialog(false)}>Cancle</p>
                    </div>
                </div>
            </Dialog>


        </div>
    )
}

export default SetProfile