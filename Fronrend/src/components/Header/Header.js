import React, { useEffect, useState } from 'react'
import '../Header/Header.css'


import {
    HomeRounded,
    SearchRounded,
    AddRounded,
    AccountCircleRounded,
    SendRounded,
    MoreHoriz,
    FavoriteBorderRounded,
    ManageAccountsOutlined,
    ReportGmailerrorredOutlined,
    QuestionMarkOutlined,
    ClearOutlined
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Menu, } from '@mui/material';
import CreatPost from '../CreatPost/CreatPost';
import Logout from '../usable/Logout';
import User from './../usable/User';
import { SerchUsersGet } from '../../Actions/user';
import Loading from '../Loading/Loading.js';


const Header = () => {

    const [tab, setTab] = useState(window.location.pathname);

    const navigate = useNavigate();

    const [creatPost, setcreatPost] = useState(false);
    const [SearchDilog, setSearchDilog] = useState(false);
    const [openMenu, setopenMenu] = useState(false);
    const [name, setname] = useState('');


    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { message } = useSelector((state) => state.addPost)
    const { searchloading, searchUsers } = useSelector((state) => state.suggestedUsers)


    const searchHendle = () => {
        dispatch(SerchUsersGet(name));
    }

    const searchBoxOff = () => {
        setSearchDilog(false);
        setname('')
        dispatch({
            type: "searchUsersClearMessage"
        })
    }

    useEffect(() => {
        if (message && message.success) {
            setcreatPost(false)
            dispatch({
                type: "addPostClearMessage"
            })
        }
    }, [dispatch, message])


    return (
        <>
            <div className='header d-flex f-d-col'>
                <div className='logo d-flex justify-content'>
                    <h1 style={{ fontStyle: 'italic' }}>PicoPulse</h1>
                    <img src='logo.png' alt='' />
                </div>

                <div className='d-flex f-d-col' >

                    <Link to='/' onClick={() => setTab('/')} className='MiddleInside'>
                        {
                            tab === '/' ? <>
                                <span>  <HomeRounded fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }} >Home</p>
                            </> : <>
                                <span>  <HomeRounded fontSize='large' /> </span> <p  >Home</p>
                            </>
                        }
                    </Link>

                    <div onClick={() => { setSearchDilog(true) }} className='MiddleInside'>
                        {
                            tab === '/Search' ? <>
                                <span>  <SearchRounded fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }}  >Search</p>
                            </> : <>
                                <span>  <SearchRounded fontSize='large' /> </span> <p  >Search</p>
                            </>
                        }

                    </div>

                    <Link to='/direct/inbox' onClick={() => setTab('/message')} className='MiddleInside'>
                        {
                            tab === '/message' ? <>
                                <span>  <SendRounded fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }} >message</p>
                            </> : <>
                                <span>  <SendRounded fontSize='large' /> </span> <p  >message</p>
                            </>
                        }
                    </Link>

                    <Link to='/Notifications' onClick={() => setTab('/Notifications')} className='MiddleInside'>
                        {
                            tab === '/Notifications' ? <>
                                <span>  <FavoriteBorderRounded fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }} >Notifications</p>
                            </> : <>
                                <span>  <FavoriteBorderRounded fontSize='large' /> </span> <p  >Notifications</p>
                            </>
                        }
                    </Link>

                    <Link to={user && user.user ? `` : `/account/login`} onClick={() => {
                        setTab('/Creat');
                        user && user.user && setcreatPost(!creatPost);
                    }} className='MiddleInside'>
                        {
                            tab === '/Creat' ? <>
                                <span>  <AddRounded fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }} >Crate</p>
                            </> : <>
                                <span>  <AddRounded fontSize='large' /> </span> <p  >Crate</p>
                            </>
                        }
                    </Link>

                    <Link to={user && user.user ? `/account/User/${user.user.UserId}` : `/account/login`} onClick={() => setTab('/profile')} className='MiddleInside'>
                        {
                            tab === '/profile' ? <>
                                <span>  <AccountCircleRounded fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }} >Profile</p>
                            </> : <>
                                <span>  <AccountCircleRounded fontSize='large' /> </span> <p  >Profile</p>
                            </>
                        }
                    </Link>
                </div>

                <div>
                    <p onClick={() => {
                        setTab('/more');
                        if (isAuthenticated) {
                            setopenMenu(true)
                        }
                        else {
                            navigate('/account/login')
                        }

                    }} className='MiddleInside'>
                        {
                            tab === '/more' ? <>
                                <span>  <MoreHoriz fontSize='large' /> </span> <p style={{ color: '#2b2727', fontWeight: '900', fontSize: '1rem' }} >More</p>
                            </> : <>
                                <span>  <MoreHoriz fontSize='large' /> </span> <p   >More</p>
                            </>
                        }

                    </p>
                </div>
            </div >



            <Dialog open={creatPost} onClose={() => setcreatPost(!creatPost)}>
                <CreatPost postOptions={false}
                    img={null}
                    captions=''
                    backOptions='backBtn'
                    edit={false}
                />
            </Dialog>


            <Menu open={openMenu} onClose={() => { setopenMenu(false) }}>
                <div className='MiddleInside openMenu' style={{ flexDirection: 'column' }}>
                    <p className='m openMenup' onClick={() => {
                        navigate('/account/setting');
                        setopenMenu(false)
                    }}><span className='mr'><ManageAccountsOutlined /></span> Setting</p>
                    <p onClick={() => {
                        navigate('/Report/Problem');
                        setopenMenu(false)
                    }} className='m '  ><span className='mr'><ReportGmailerrorredOutlined /></span> Report a problem</p>
                    <p onClick={() => {
                        navigate('/setting/Help');
                        setopenMenu(false)
                    }} className='m '><span className='mr'><QuestionMarkOutlined /></span> Help</p>
                    <p className='m'><Logout /> </p>
                </div>
            </Menu>


            <Dialog open={SearchDilog} onClose={() => { searchBoxOff() }}>
                <div className="search">
                    <div>
                        <p className='p4 fw3 ml1'>Search</p>
                        <div className='bb1 d-flex pp'>
                            <input value={name} onChange={(e) => {
                                setname(e.target.value);
                                searchHendle();
                            }} className='input bg2 bnone' type='text' placeholder='Search' />
                            <p className='bg2 b2 cpointer pr' onClick={() => { setname('') }}><ClearOutlined fontSize="small" /></p>
                        </div>
                    </div>

                    {searchloading ? <>
                        <Loading />
                        <Loading />
                        <Loading />
                        <Loading />
                        <Loading />
                    </> : <>
                        <div className='ml1  dialogBoxuser' onClick={() => { searchBoxOff() }}>
                            {searchUsers ? <>
                                {searchUsers.users && searchUsers.users.length > 0 ? <>{searchUsers.users.map((e) => (
                                    <Link to={`/account/User/${e.UserId}`} key={e._id}>
                                        <User
                                            postImage={e.avater.url}
                                            UserName={e.name}
                                            UserId={e.UserId}
                                        />
                                    </Link>
                                ))}
                                </> : <>
                                    <p className='p1 textalignc'>No search found</p>
                                </>}
                            </> : <>
                                <p className='p5 textalignc'>no search yet</p>
                            </>}
                        </div>
                    </>}
                </div>
            </Dialog>
        </>
    )
}

export default Header
