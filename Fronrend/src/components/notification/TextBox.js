import React from 'react'
import { Link } from 'react-router-dom'
import './notification.css'

const TextBox = ({ imgUrl, userId, NotificationText, followBtn, postUrl }) => {
    return (
        <div className='TextBox mtb1 pp1 d-flex justify-space-between   '>
            <div className='d-flex justify-content'>
                <img className='img6' src={imgUrl} alt='img' />
                <Link className='p3 color3 plr1 d-flex ' to={`/account/User/${userId}`} > {userId} </Link>
                <p> {NotificationText}    </p>
            </div>
            {postUrl ? <Link to={`/account/User/${userId}`}><img className=' textBoxImg img6' src={postUrl} alt='img' /></Link> : <></>}
        </div>
    )
}

export default TextBox
