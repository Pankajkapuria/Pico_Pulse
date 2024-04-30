import { Dialog } from '@mui/material';
import React, { useState } from 'react'
import './AboutAccount.css'
import { CalendarMonthOutlined } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { AboutAccounts } from '../../Actions/user';
import Loading from './Loading';

const AboutAccount = ({
    User,
    UserId,
    Date
}) => {

    const [aboutAccountToggle, setaboutAccountToggle] = useState(false);

    const dispatch = useDispatch();
    const { GetDateloading, Datemessage } = useSelector((state) => state.addComment)

    return (
        GetDateloading ? <><Loading /></> : <>

            <>
                <p className='bb1 dp' onClick={() => {
                    setaboutAccountToggle(true);
                    dispatch(AboutAccounts(UserId))
                }}> About this account</p>


                <Dialog open={aboutAccountToggle} onClose={() => {
                    setaboutAccountToggle(false);
                    dispatch({
                        type: 'GetDateClearMessage'
                    })
                }} >
                    <div className="aboutAccount">
                        <p className='textalignc fw3 bb1' style={{ padding: '0.5vmax 0vmax' }}>About this account</p>
                        <div className="aboutAccountcontant bb1">
                            <div className=''>
                                <img className='img5' src={User} alt='img' />
                                <p className='p3'>{UserId}</p>
                                <p className='p2' style={{ padding: '0vmax 2vmax', textAlign: 'center' }}>To help keep our community authentic, we're showing information about accounts on PicoPules. People can see this by tapping on the ••• on your profile and choosing About this account</p>
                            </div>
                            <div>
                                <CalendarMonthOutlined style={{ fontSize: '2.2em' }} />
                                <div className='datejoin'>
                                    <p >Date joined</p>
                                    <p style={{ fontSize: '.8rem' }}>{Datemessage && Datemessage.date ? <>{Datemessage.date.date}</> : <>__</>}-{Datemessage && Datemessage.date ? <>{Datemessage.date.month}</> : <>__</>}-{Datemessage && Datemessage.date ? <>{Datemessage.date.year}</> : <>__</>}</p>
                                </div>
                            </div>
                        </div>
                        <p onClick={() => { setaboutAccountToggle(false) }} className='textalignc' style={{ padding: '0.3vmax 0vmax', cursor: 'pointer' }}> Close </p>
                    </div>
                </Dialog>
            </>
        </>
    )
}

export default AboutAccount
