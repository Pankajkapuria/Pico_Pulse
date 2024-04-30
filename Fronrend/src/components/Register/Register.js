import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../Actions/user';
import toast from 'react-hot-toast';
import Loading2 from '../Loading/Loading2';
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

    const confrimHendle = () => {
        dispatch(registerUser(email, name, userName, password))
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

        if (isAuthenticated && user && user.user) {
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
                            <Button className='btn3' onClick={() => { confrimHendle() }} >comfirm</Button>
                        </>}
                        <Link className='btn2' onClick={() => { setDOB(true); setconfirm(false) }}  >Go back</Link>
                    </div>
                </div>
            </>}




        </>
    )
}

export default Register
