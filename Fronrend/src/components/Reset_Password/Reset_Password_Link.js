import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loading2 from '../Loading/Loading2'
import axios from 'axios'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const [email, SetEmail] = useState();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const sendLoginLink = async () => {
        setLoading(true)
        try {
            const linkSend = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/forget/password`,
                { email }
            )
            if (linkSend?.data.success) {
                navigate('/account/login')
                toast.success(linkSend.data.message)
            }
        }
        catch (error) {
            console.log(error)
            if (error?.response?.data) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error(error.message)
            }
        }
        setLoading(false)
    }

    return (
        <div>
            <div className='login'>
                <div className='loginUper'>
                    <div>
                        <h1 style={{ fontSize: '2em', fontStyle: 'italic' }} >PicoPulse</h1>
                    </div>
                    <p className='p5'>Trouble with logging in?</p>
                    <div className='loginUperfrom'>
                        <div>
                            <div>
                                <p className='mt p2'>Enter your email address, username, and we'll send you a link to get back into your account. </p>
                            </div>
                            <input className='input bg1 fw1' type="email" name="email" placeholder='email' value={email} onChange={(e) => { SetEmail(e.target.value) }} />
                            {loading ? <><div className='d-flex justify-content' ><Loading2 /></div></> : <><button className='btn2 btn3' onClick={sendLoginLink} >Send Login Link</button></>}
                        </div>
                    </div>
                </div>


                <div className='loginDowon'>
                    <Link className='p6' to='/account/login'>Creat New Account </Link>
                </div>
            </div>


        </div>
    )
}

export default ResetPassword
