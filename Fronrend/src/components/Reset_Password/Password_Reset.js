import React, { useState } from 'react'
import Loading2 from '../Loading/Loading2'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const PasswordReset = () => {
    const [loading, setLoading] = useState(false)
    const [newPassword, SetnewPassword] = useState()
    const [confrom_newPassword, setConfrom_newPassword] = useState()

    const params = useParams()
    const navigate = useNavigate();

    const resetPassword = async () => {
        setLoading(true)
        try {
            const reset = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/password/reset/${params.resetToken}`, {
                password: newPassword,
                newPassword: confrom_newPassword
            })


            if (reset.data.success) {
                toast.success('Reset password')
                navigate('/account/login')
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
                    <p className='p5'>Create a strong password</p>
                    <div className='loginUperfrom'>
                        <div>
                            <div>
                                <p className='mt p2'>Your password must be at least six characters and include a combination of numbers, letters and special characters (!$@％). </p>
                            </div>
                            <input className='input mtb1 bg1 fw1' type="password" name="email" placeholder='New Password' value={newPassword} onChange={(e) => { SetnewPassword(e.target.value) }} />
                            <input className='input mtb1 bg1 fw1' type="password" name="email" placeholder='New Password' value={confrom_newPassword} onChange={(e) => { setConfrom_newPassword(e.target.value) }} />
                            {loading ? <><div className='d-flex justify-content' ><Loading2 /></div></> : <><button className='btn2 bg2' onClick={resetPassword}  >Reset Password</button></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset

