import React, { useState } from 'react'
import '../Help/Help.css'
import { Dialog } from '@mui/material'


const Help = () => {
    const [helpDialog, sethelpDialog] = useState(false)
    return (
        <div className=' d-flex f-d-col justify-content align-items'>
            <div className='help d-flex f-d-col justify-content align-items'>
                <h1 className=''>Help Us</h1>
                <p className='p3'>if you have any questions we are happy to help. </p>
                <input className='input b1' type='text' placeholder='Enter your name' />
                <input className='input b1' type='email' placeholder='Enter you email' />
                <div className="textarea HelpTextArea b1 bg1" >
                    <textarea className='bg1' style={{ height: '10vmax' }} maxLength='150' placeholder='Write your message' />
                </div>
                <button className='btn2 bg3 ' onClick={() => { sethelpDialog(true) }}>send message</button>
            </div>


            <Dialog open={helpDialog} onClose={() => { sethelpDialog(false) }}>
                <div className=' pp helpDialog d-flex f-d-col  align-items'>
                    <p className='p4'>Message send Sucessfully</p>
                    <p className='p3'>Thank you for your message!</p>
                    <p className='p3'>We will get back to you as soon as possiable</p>
                    <button className='btn2 bg3' onClick={() => { sethelpDialog(false) }}>okey</button>
                </div>
            </Dialog>
        </div>
    )
}

export default Help
