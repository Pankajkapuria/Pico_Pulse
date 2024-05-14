import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../Actions/user';
import toast from 'react-hot-toast';
import Loading2 from '../Loading/Loading2';
import axios from 'axios';
const Register = () => {

    const dispatch = useDispatch();
    const { message, loading, user, isAuthenticated, registererror } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [signUpFrom, setsignUpFrom] = useState(true);
    const [DOB, setDOB] = useState(false);
    const [confirm, setconfirm] = useState(false);


    const [email, setemail] = useState();
    const [name, setname] = useState();
    const [userName, setuserName] = useState();
    const [password, setpassword] = useState();
    const [bDate, setbDate] = useState();


    const SignUp = async () => {
        if (!email || !name || !userName || !password) {
            toast.error('All filed are required')
            return;
        }
        dispatch(registerUser(email, name, userName, password, 'true'))
    }

    const DOBHendle = () => {
        if (!bDate) {
            toast.error('DOB required.');
            return;
        }
        setDOB(false); setconfirm(true)
    }

    const confrimHendle = async () => {
        dispatch({
            type: "registerRequest"
        })

        const avater = 'data:image/jpeg;base64,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'

        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/register`,
            { email, name, UserId: userName, password, chackUser: false, avater: avater },
            {
                headers: {
                    "Content-Type": 'application/json'
                }
            }
        );
        if (data.sucess) {
            dispatch({
                type: "registerCheck",
                payload: ""
            })
            toast.success(data.message)
            navigate('/verify/Account', { state: { Registeremail: email } });
        }
    }



    useEffect(() => {
        if (message && message.sucess && message.message === 'new user right') {
            dispatch({
                type: 'registerCheckClearMessage'
            })
            setDOB(true);
            setsignUpFrom(false);
        }
        else {
            if (message && message.message && message.message.length > 0) {
                if (message.sucess) {
                    toast.success(message.message)
                }
                else {
                    toast.error(message.message);
                }
                dispatch({
                    type: 'registerCheckClearMessage'
                })
            }
        }

        if (isAuthenticated && user?.user) {
            navigate('/accounts/setProfile/');
        }

        if (registererror) {
            toast.error('not register please try again.')
            dispatch({
                type: 'registerClearError'
            })
            setsignUpFrom(true)
            setDOB(false)
            setconfirm(false)
        }

    }, [message, dispatch, isAuthenticated, user, navigate, registererror])



    return (
        <>


            {signUpFrom && <>
                <div className='login'>
                    <div className='loginUper'>
                        <div>
                            <h1 style={{ fontSize: '2em', fontStyle: 'italic' }} >PicoPulse</h1>
                        </div>
                        <p className='p5'> Sign up to see photos and videos from your friends.</p>
                        <div className='loginUperfrom'>
                            <div>
                                <input className='input bg1 fw1' type="email" name="email" placeholder='email' value={email} onChange={(e) => setemail(e.target.value)} />
                                <input className='input bg1 fw1' type="text" name="name" placeholder='FullName' value={name} onChange={(e) => setname(e.target.value)} />
                                <input className='input bg1 fw1' type="text" name="userName" placeholder='Username' value={userName} onChange={(e) => setuserName(e.target.value)} />
                                <input className='input bg1 fw1' type="password" name="password" placeholder='password' value={password} onChange={(e) => setpassword(e.target.value)} />
                                <div>
                                    <p className='mt p2'>People who use our service may have uploaded your current information to PicoPulse. </p>
                                    <p className='mt p2'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p>
                                </div>
                                {loading ? <><div className='d-flex justify-content' ><Loading2 /></div></> : <><Button className='btn3' onClick={() => SignUp()} >Next</Button></>}
                            </div>
                        </div>
                    </div>


                    <div className='loginDowon'>
                        <Link to='/account/login'>Have an account? <span className='forgetpass'> Log in</span></Link>
                    </div>
                </div>
            </>}


            {DOB && <>
                <div className='login'>
                    <div className='loginUper'>
                        <img className='img5' style={{ borderRadius: '0px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOfMYC0nfC0XIomDU8eJJYvH_kEAWPPI2vNQ&usqp=CAU' alt='img' />
                        <p className='p5'>Add your date of barth</p>
                        <p className='p2'>This won't be part of your profile Lorem, ipsum dolor.</p>
                        <input className='input ' type='date' value={bDate} onChange={(e) => setbDate(e.target.value)} />
                        <p className='p2'>This won't be part of your profile Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, sunt.</p>
                        <Button className='btn3' onClick={() => DOBHendle()} >Next</Button>
                        <Link className='btn2' onClick={() => { setsignUpFrom(true); setDOB(false) }} >Go back</Link>
                    </div>


                    <div className='loginDowon'>
                        <Link to='/account/login'>Have an account? <span className='forgetpass'> Log in</span></Link>
                    </div>
                </div>
            </>}




            {confirm && <>
                <div className='login'>
                    <div className='loginUper'>
                        <p className='p5'>Feel free Register and post photo and videos on picopulse and share your friends and make some new friends.</p>
                        <p className='p2'>Here , your photo and video are secure and procutated . </p>
                        {loading ? <><Loading2 /></> : <>
                            <Button id='confrimBtn' className='btn3' onClick={() => { confrimHendle() }} >comfirm</Button>
                        </>}
                        <Link className='btn2' onClick={() => { setDOB(true); setconfirm(false) }}  >Go back</Link>
                    </div>
                </div>
            </>}




        </>
    )
}

export default Register
