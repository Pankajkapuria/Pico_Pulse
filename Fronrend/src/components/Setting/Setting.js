import React from 'react'
import '../Setting/Setting.css'
import { GppGoodOutlined, PersonOutlineOutlined, ArrowForwardIosOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import Logout from '../usable/Logout'

const Setting = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="setting">

                <div className='textalignc p5 pp bb1'>Settings and privacy</div>

                <div className='settingContant m1 '>


                    <div onClick={() => { navigate('/setting/Accountsetting') }} className='settingLeft'>
                        <div className="pp bg1">
                            <h2 className='mtb1' style={{ fontStyle: 'italic' }}>PicoPulse</h2>
                            <p className='p3 mtb1'>Account Center</p>
                            <p className='color2 mtb1'>Manage your connected experiences and account setting </p>
                            <div className="mtb1 AccountCenter">
                                <p className='color2 '>< PersonOutlineOutlined style={{ marginRight: '0.8vmax' }} />Personal details</p>
                                <p className='color2 mt'><GppGoodOutlined style={{ marginRight: '0.8vmax' }} />Password and security</p>
                                <p className='p6 mt' style={{ padding: '0px' }}><PersonRemoveOutlined style={{ marginRight: '0.8vmax' }} />Delete Account</p>
                            </div>
                            <p className='mtb1 p1 color3'>See more in Account Center</p>
                        </div>
                    </div>


                    <div className="settingright bg1 pp ">
                        <h2 className='mtb1' style={{ fontStyle: 'italic' }}>Account</h2>
                        <Link to='/accounts/setProfile' className=' m pp bb1 d-flex justify-space-between'>Edit Profile <span><ArrowForwardIosOutlined /></span></Link>
                        <Link className=' m pp bb1 d-flex justify-space-between'>Notifications <span><ArrowForwardIosOutlined /></span> </Link>
                        <Link className=' m pp bb1 d-flex justify-space-between'>who can see your content <span><ArrowForwardIosOutlined /></span></Link>
                        <Link to='/Report/Problem' className=' m pp bb1 d-flex justify-space-between'>Report a probleam <span><ArrowForwardIosOutlined /></span></Link>
                        <Link to='/setting/Help' className=' m pp bb1 d-flex justify-space-between'>Help <span><ArrowForwardIosOutlined /></span> </Link>
                        <p className=' p6 m pp bb1'>< Logout /> </p>
                    </div>


                </div>

            </div >
        </>
    )
}

export default Setting
