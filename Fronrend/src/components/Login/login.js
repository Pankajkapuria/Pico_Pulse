import React, { useEffect, useState } from 'react'
import '../Login/login.css'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../Actions/user.js'

const Login = () => {

    const navigate = useNavigate();

    const [id, setid] = useState();
    const [password, setpassword] = useState();

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.user);

    const loginHandel = () => {
        dispatch(loginUser(id, password))
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
        else {
            navigate('/account/login')
        }

    }, [isAuthenticated, navigate])



    return (



        <div className='login'>


            <div className='loginUper'>
                <div className='cpointer' onClick={() => { navigate('/') }}>
                    <h1 style={{ fontSize: '2em' }} >PicoPulse</h1>
                </div>
                <div className='loginUperfrom'>
                    <div>
                        <input className='input bg1 fw1' type="text" name="id" placeholder='email,UserId' value={id} onChange={(e) => { setid(e.target.value) }} />
                        <input className='input bg1 fw1' type="password" name="password" placeholder='password' value={password} onChange={(e) => { setpassword(e.target.value) }} />
                        <Button onClick={() => { loginHandel() }} className='btn3'>Login</Button>
                    </div>
                    <Link to='/passwordRecovery'>Forgotten Your Password?</Link>
                </div>
            </div>


            <div className='loginDowon'>
                <Link to='/account/signUp'>Don't have an account? <span className='forgetpass'> Sign up</span></Link>
            </div>


        </div>
    )
}

export default Login
