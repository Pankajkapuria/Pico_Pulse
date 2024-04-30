import './App.css';
import Header from './components/Header/Header.js';
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './components/Login/login';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, populearUsersget, suggestedUsers } from './Actions/user.js';
import Home from './components/Home/Home';
import Account from './components/Account/Account';
import Register from './components/Register/Register.js';
import SetProfile from './components/SetProfile/SetProfile.js';
import Setting from './components/Setting/Setting.js';
import AccountCenter from './components/AccountCenter/AccountCenter.js';
import Messages from './components/Messages/Messages.js';
import { io } from 'socket.io-client'
import Actions from './Actions/EventActions.js';
import { Toaster, toast } from 'react-hot-toast';
import Notification from './components/notification/notification.js';
import Help from './components/Help/Help.js';
import ResetPassword from './components/Reset_Password/Reset_Password_Link.js';
import PasswordReset from './components/Reset_Password/Password_Reset.js';
import RepoartProbleam from './components/RepoartProbleam/RepoartProbleam.js';


function App() {
  const location = useLocation();

  const Notifactionsocket = useRef({});
  const { isAuthenticated, user } = useSelector((state) => state.user);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(suggestedUsers());
    dispatch(populearUsersget());
  }, [dispatch])

  // console.log(process.env.REACT_APP_BACKEND_URL)
  useEffect(() => {
    Notifactionsocket.current = io(`${process.env.REACT_APP_BACKEND_URL}/notification`)
  }, [])

  useEffect(() => {
    if (user?.user) {
      Notifactionsocket.current.emit(Actions.JOIN, {
        userId: user.user.UserId
      })
    }
    Notifactionsocket.current.on(Actions.NOTIFICATION_GET, ({ userName, type }) => {
      if (type === 'like') {
        toast(`${userName} liked your post`, { icon: '👏' })
      }
      if (type === 'comment') {
        toast(`${userName} comment your post`, { icon: '👏' })
      }
      if (type === 'follow') {
        toast(`${userName} started following you`, { icon: '👏' })
      }
      if (type === 'profile Seen') {
        toast(`${userName} seen your profile`, { icon: '👏' })
      }
    })

    return () => {
      Notifactionsocket.current.off(Actions.NOTIFICATION_GET)
    }

  }, [user])


  return (

    <div className="App">

      <Toaster position='top-right' />

      <div className="section">
        <div>
          {(location.pathname === '/account/login' || location.pathname === '/account/signUp' || location.pathname.includes('/user/password/reset')) ? <></> : <Header />}


          <div className='contant'>
            <Routes>
              <Route path='/' element={<Home Notifactionsocket={Notifactionsocket.current} />} />
              <Route path='/account/signUp' element={<Register />} />
              <Route path='/account/login' element={<Login />} />
              <Route path='/passwordRecovery' element={<ResetPassword />} />
              <Route path='/user/password/reset/:resetToken' element={<PasswordReset />} />
              <Route path='/accounts/setProfile' element={isAuthenticated ? <SetProfile /> : <Login />} />
              <Route path='/account/User/:UserId' element={<Account Notifactionsocket={Notifactionsocket.current} />} />
              <Route path='/account/setting' element={isAuthenticated ? <Setting /> : <Login />} />
              <Route path='/setting/Accountsetting' element={isAuthenticated ? <AccountCenter /> : <Login />} />
              <Route path='/direct/:id' element={isAuthenticated ? <Messages /> : <Login />} />
              <Route path='/Notifications' element={<Notification />} />
              <Route path='/setting/Help' element={<Help />} />
              <Route path='/Report/Problem' element={<RepoartProbleam />} />
            </Routes>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
