import React, { useState } from 'react'
import '../Register/Register.css'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
const Verify = () => {
    const [verificationCode, setverificationCode] = useState();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const verifyAccount = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/verify/${verificationCode}`,
                { email: state.Registeremail },
                {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            );

            if (data && data.sucess) {
                localStorage.setItem('token', data.token)
                dispatch({
                    type: "registerSucess",
                    payload: data
                })
                toast.success(data.message)
                navigate('/accounts/setProfile');
            }

        }
        catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error(error.message)
            }
        }
    }

    return (
        <div className='d-flex justify-content mt'>
            <div className='Verify b1 d-flex f-d-col pp justify-content'>
                <div><h1 className='f-size1 pp1 bb1'>Please verify your e-mail address</h1></div>
                <div className='p6 color3'>Please check your email account for the verification code we just sent you and enter that code in box below </div>
                <p className='d-flex f-d-col pp1'>
                    <p className='codeInput p3 '>Enter 4-digit code</p>
                    <input className='codeInput b1' value={verificationCode} type='number' onChange={(e) => { setverificationCode(e.target.value) }} />
                </p>

                <button className='btn2 btn3' onClick={verifyAccount}>Verify</button>
            </div>
        </div>
    )
}

export default Verify


