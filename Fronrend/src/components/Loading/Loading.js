import { Skeleton } from '@mui/material'
import React from 'react'
import './Loading.css'

const Loading = () => {
    return (
        <>
            <div className='loading pp d-flex'>
                <Skeleton variant="circular" width={50} height={50} />
                <div className='loadingInside'>
                    <Skeleton />
                    <Skeleton width="60%" />
                </div>
            </div>
        </>
    )
}

export default Loading
