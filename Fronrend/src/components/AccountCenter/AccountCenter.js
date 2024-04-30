import { AccountBalanceOutlined, AccountCircleRounded, ArrowForwardIosOutlined, GppGoodOutlined, PersonOutlineOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import '../AccountCenter/AccountCenter.css'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { ChangePassword } from '../../Actions/user'
import toast from 'react-hot-toast'

const AccountCenter = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [SettingNav, setSettingNav] = useState('profile');
    const [CurrPassword, setCurrPassword] = useState();
    const [NewPassword, setNewPassword] = useState();
    const [RetypeNewPassword, setRetypeNewPassword] = useState();


    const { user, loading, isAuthenticated, changePasswordloading, changePassword, changePassworderror } = useSelector((state) => state.user)

    const hendleChangePassword = () => {
        dispatch(ChangePassword(CurrPassword, NewPassword, RetypeNewPassword));
    }



    useEffect(() => {
        if (changePassword) {
            if (changePassword.success) {
                toast.success('passwprd update')
                navigate('/account/login')
            }
            else {
                toast.error(changePassword.message);
            }
            dispatch({
                type: 'changePasswordclearMessage'
            })
        }
        if (changePassworderror) {
            toast.error('password not update')
            dispatch({
                type: 'changePasswordclearError'
            })
        }
    }, [dispatch, changePassword, navigate, changePassworderror, isAuthenticated, loading])



    return (
        <>
            <div className="AccountSetting d-flex ">

                <div className="AccountSettingBar">
                    <div className="SettingBar mtb1 AccountCenter">
                        <h2 className='mtb1' style={{ fontStyle: 'italic' }}>PicoPulse</h2>
                        <h3 className='fw3 mtb1'>Account Center</h3>
                        <p className='p2 '>Mannage your connected experiences and account setting on PicoPulse app.</p>
                        <h4 className='fw1 mtb1'>Account Setting</h4>
                        <p className={SettingNav === 'profile' ? 'p5 pp  bg2 br' : 'p5 pp bghover'} onClick={() => { setSettingNav('profile') }} ><  AccountCircleRounded style={{ marginRight: '1.5vmax' }} />Profile</p>
                        <p className={SettingNav === 'Account' ? 'p5 pp  bg2 br' : 'p5 pp bghover'} onClick={() => { setSettingNav('Account') }} ><  AccountBalanceOutlined style={{ marginRight: '1.5vmax' }} />Account</p>
                        <p className={SettingNav === 'Personal details' ? 'p5 pp bg2 br' : 'p5 pp bghover'} onClick={() => { setSettingNav('Personal details') }} ><  PersonOutlineOutlined style={{ marginRight: '1.5vmax' }} />Personal details</p>
                        <p className={SettingNav === 'Change Password' ? 'p5 pp bg2 br' : 'p5 pp bghover'} onClick={() => { setSettingNav('Change Password') }} ><  GppGoodOutlined style={{ marginRight: '1.5vmax' }} />Password and security</p>
                        <p className={SettingNav === 'Delete Account' ? 'p6 pp bg2 br' : 'p6 pp bghover'} onClick={() => { setSettingNav('Delete Account') }}  >  <PersonRemoveOutlined style={{ marginRight: '1.5vmax' }} />Delete Account</p>
                    </div>
                </div>

                <div className="AccountSettingContant">

                    {SettingNav === 'profile' ? <>
                        <div className="profile pp m">
                            <h2 className='mb' style={{ fontStyle: 'italic' }}>Profile</h2>
                            <p className='p2'>Manage your profile info, and Edit your Post, and add more posts on your profile</p>
                            <Link to={`/account/user/${user?.user?.UserId}`} className='br bg2 pp d-flex justify-space-between mtb'><p className='d-flex'>{user && user.user &&
                                <img className='img6 mr1' src={user.user.avater.url} alt="" />}
                                {user && user.user && <span>{user.user.name}</span>}
                            </p>
                                <ArrowForwardIosOutlined />
                            </Link>
                        </div>
                    </> : <></>}

                    {SettingNav === 'Personal details' ? <>
                        <div className="pp m PersonalDetails">
                            <h2 className='mb'>Personal details</h2>
                            <p className='p2'> It's your persional details not your public profile part </p>
                            <div className='br bg2 pp d-flex justify-space-between mtb '>
                                <p className='p3'>email</p>
                                <p className='p1'>pankajjn60@gmail.com</p>
                            </div>
                            <div className='br bg2 pp d-flex justify-space-between mtb '>
                                <p className='p3'>Date of birth</p>
                                <p className='p1'>02-09-2002</p>
                            </div>
                            <div className='br bg2 pp d-flex justify-space-between mtb '>
                                <p className='p3'>Gender</p>
                                <p className='p1'>Male</p>
                            </div>
                        </div>
                    </> : <></>}

                    {SettingNav === 'Change Password' ? <>
                        <div className="pp m ChangePassword">
                            <p className='p1'>pankajjjn70--</p>
                            <h2 className='mb'>Change password</h2>
                            <p className='p2'> Your password must be at least six characters and include a combination of number, letters and space characters for extra security (!$&@*) </p>

                            <input onChange={(e) => { setCurrPassword(e.target.value) }} value={CurrPassword} className='input fw3 bg2 mtb1 pp' type='password' placeholder='Current Password' />
                            <input onChange={(e) => { setNewPassword(e.target.value) }} value={NewPassword} className='input fw3 bg2 mtb1 pp' type='password' placeholder='New Password' />
                            <input onChange={(e) => { setRetypeNewPassword(e.target.value) }} value={RetypeNewPassword} className='input fw3 bg2 mtb1 pp' type='password' placeholder='Retype New Password' />
                            <Button disabled={changePasswordloading} className='btn3 br' onClick={() => { hendleChangePassword() }}>Change password</Button>

                        </div>
                    </> : <></>}

                </div>

            </div >
        </>
    )
}

export default AccountCenter
