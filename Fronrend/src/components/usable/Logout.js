import { LogoutRounded } from '@mui/icons-material';
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hendleLogOut = () => {
        localStorage.removeItem('token');
        dispatch({
            type: 'logoutSucess'
        })

        dispatch({
            type: "cleargetContacts"
        })
        toast.success('logout sucessFully')
        navigate('/account/login');
    }
    return (
        <>
            <p style={{ display: 'flex', cursor: 'pointer' }} onClick={() => { hendleLogOut() }} ><span className='mr'><LogoutRounded /></span> Log out</p>
        </>
    )
}

export default Logout
