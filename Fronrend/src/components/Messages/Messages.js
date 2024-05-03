import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../Messages/Messages.css'
import User from '../usable/User'
import { InfoOutlined, PhoneForwardedRounded, MapsUgcOutlined, SentimentSatisfied, SendRounded, VideocamOffRounded, MicOffRounded, CallEndRounded, Mic, Videocam } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getContacts, getMessage } from '../../Actions/Message'
import Loading from '../Loading/Loading'
import { io } from 'socket.io-client'
import axios from 'axios'
import Actions from '../../Actions/EventActions'
// import peer from './Peer'
import { toast } from 'react-hot-toast'
import { Dialog } from '@mui/material'
import ReactPlayer from 'react-player'

const Messages = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const socket = useRef({});
    const peerConection = useRef({});
    // const [users, setusers] = useState([]);
    const [inbox, setinbox] = useState('');
    const [AllMessage, setAllMessage] = useState([]);
    const [Contacts, setContacts] = useState(false);
    const [remoteUser, setremoteUser] = useState();
    const [mystream, setmystream] = useState(null);
    const [remotestream, setremotestream] = useState(null);
    const [videoDialog, setvideoDialog] = useState(false);
    const [audioOnOff, setaudioOnOff] = useState(true)
    const [VideoOnOff, setVideoOnOff] = useState(true);
    // const dialoge = useRef();

    const { user } = useSelector((state) => state.user)
    const { getMessageloading, message } = useSelector((state) => state.Message)
    const { getContactsloading, getContactsmessage } = useSelector((state) => state.Contacts)


    // socket connection
    useEffect(() => {
        socket.current = io(`${process.env.REACT_APP_BACKEND_URL}/message`, {
            reconnectionAttempts: 'Infinity',
            timeout: 10000,
            transports: ['websocket']
        })

        // socket.current = io(`http://localhost:5051/message`, {
        //     reconnectionAttempts: 'Infinity',
        //     timeout: 10000,
        //     transports: ['websocket']
        // })


    }, [])

    useEffect(() => {

        socket.current?.emit(Actions.JOIN, user.user._id);

        socket.current?.on(Actions.JOINED, ({ Messageusers }) => {
            // setusers(Messageusers);
        })

        return () => {
            socket.current?.off(Actions.JOIN)
        }

    }, [user])

    useEffect(() => {
        socket.current?.on(Actions.RECIVE_MESSAGE, (data) => {
            if (AllMessage) {
                setAllMessage([...AllMessage, data])
            }
            else {
                setAllMessage([data])
            }
        })

        return () => {
            socket.current?.off(Actions.RECIVE_MESSAGE)
        }

    }, [AllMessage])


    useEffect(() => {
        if (params.id !== 'inbox') {
            dispatch(getMessage(params.id));
            if (window.screen.availWidth <= 500) {
                document.getElementById('indoxContact').style.display = 'none'
                document.getElementById('indoxMessage').style.width = '100vw';
            }
        }
        if (params.id === 'inbox') {
            dispatch(getContacts());
            setContacts(true);
            if (window.screen.availWidth <= 500) {
                console.log('inside', window.screen.availWidth)
                document.getElementById('indoxContact').style.display = 'block'
                document.getElementById('indoxMessage').style.width = '0vw'
            }
        }
        if (Contacts === false) {
            dispatch(getContacts());
            setContacts(true);
        }

    }, [dispatch, params.id, Contacts])

    useEffect(() => {
        if (getMessageloading === false && message) {
            setAllMessage(message?.conversation?.messages)
        }
    }, [getMessageloading, message])


    // send Message
    const sendMessage = async () => {

        const token = localStorage.getItem('token');
        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/message/MessageCreat`,
            {
                sender: user.user._id,
                conversionId: params.id,
                message: inbox
            },
            {
                "headers": {
                    authorization: token
                },
            },
        )

        if (data?.success) {
            const messageINFO = {
                sender: user?.user?._id,
                message: inbox,
                receiver: message?.conversionUser?._id
            }
            if (AllMessage) {
                setAllMessage([...AllMessage, messageINFO])
            }
            else {
                setAllMessage([messageINFO])
            }

            socket.current?.emit(Actions.SEND_MESSAGE, messageINFO)
            setinbox('');
        }
    }

    const startCall = async () => {
        setvideoDialog(true)
        if (message?.conversionUser?._id) {
            try {
                let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                setmystream(stream)

                peerConection.current = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: [
                                "stun:stun.l.google.com:19302",
                                "stun:global.stun.twilio.com:3478",
                            ],
                        },
                    ],
                })

                peerConection.current.onicecandidate = (event) => {
                    console.log('on ice condiante in call send got !!!')
                    if (event.candidate) {
                        socket.current.emit('condiate', { condiate: event.candidate, userId: message?.conversionUser?._id })
                    }
                }

                peerConection.current.ontrack = (event) => {
                    const remoteStream = event.streams
                    remoteStream[0].getTracks().forEach(track => {
                        console.log(track, 'remote track')
                    })
                    setremotestream(remoteStream[0])
                }

                if (stream) {
                    stream.getTracks().forEach(track => {
                        console.log(track, 'add')
                        peerConection.current.addTrack(track, stream)
                    })
                }

                peerConection.current.oniceconnectionstatechange = function (event) {
                    if (peerConection.current.iceConnectionState === 'disconnected' || peerConection.current.iceConnectionState === 'closed') {
                        peerConection.current.getSenders()?.forEach(sender => {
                            sender.track?.stop();
                        });
                        peerConection.current.close()
                        peerConection.current.oniceconnectionstatechange = null;
                        peerConection.current.ontrack = null;
                        peerConection.current = null;
                        setvideoDialog(false)
                        peerConection.current = null
                    }
                }

                peerConection.current.createOffer((offer) => {
                    peerConection.current.setLocalDescription(offer)
                    socket.current.emit('offer', { offer, userId: message?.conversionUser?._id })
                }, (error) => {
                    alert('error for creating offer')
                })
            }
            catch (error) {
                toast.error(error?.message)
                setvideoDialog(false)
            }

        }
        else {
            toast.error('call not send please try after some time')
            setvideoDialog(false)
        }
    }

    const Incoingclall = useCallback(async ({ socketId, userId, offer }) => {
        setremoteUser(socketId);
        try {
            console.log('offer')
            setvideoDialog(true);
            peerConection.current = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            });

            peerConection.current.onicecandidate = (event) => {
                console.log('on ice condiante in recive got !!!')
                if (event.candidate) {
                    socket.current.emit('condiate', { condiate: event.candidate, userId, socketId })
                }
            }

            peerConection.current.ontrack = (event) => {
                const remoteStream = event.streams
                remoteStream[0].getTracks().forEach(track => {
                    console.log(track, 'remote track')
                })
                setremotestream(remoteStream[0])
            }

            peerConection.current.setRemoteDescription(offer);

            let stream1 = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setmystream(stream1);
            if (stream1) {
                stream1.getTracks().forEach(track => {
                    console.log(track, 'add')
                    peerConection.current.addTrack(track, stream1)
                })
            }

            // for call end
            peerConection.current.oniceconnectionstatechange = function (event) {
                if (peerConection.current.iceConnectionState === 'disconnected' || peerConection.current.iceConnectionState === 'closed') {
                    peerConection.current.getSenders()?.forEach(sender => {
                        console.log(sender)
                        sender.track?.stop();
                    });
                    peerConection.current.close()
                    peerConection.current.oniceconnectionstatechange = null;
                    peerConection.current.ontrack = null;
                    peerConection.current = null;
                    setvideoDialog(false)
                    peerConection.current = null
                }
            }

            peerConection.current.createAnswer((answer) => {
                peerConection.current.setLocalDescription(answer);
                socket.current.emit('answer', { answer, userId, socketId })
            }, (error) => {
                alert('error for creating answer')
            })
        }
        catch (error) {
            toast.error(error?.message)
            socket.current.emit(Actions.CALL_REJECTED, { socketId, message: 'try after some time' })
            setvideoDialog(false)
        }


    }, [socket])




    useEffect(() => {
        socket.current?.on(Actions.CALL_REJECTED, ({ msg }) => {
            setvideoDialog(false)
            toast.error(msg)
        })
        socket.current?.on('offer', Incoingclall)
        return () => {
            socket.current?.off(Actions.CALL_REJECTED)
            socket.current?.off('offer', Incoingclall)
        }

    }, [Incoingclall])


    useEffect(() => {
        if (socket.current) {
            socket.current.on('answer', ({ answer, socketId, userId }) => {
                setremoteUser(socketId);
                console.log('answer')
                peerConection.current.setRemoteDescription(answer)
            })

            socket.current.on('condiate', ({ condiate, socketId }) => {
                console.log('condiate got !!!')
                var iceCandidate = new RTCIceCandidate(condiate);
                peerConection.current.addIceCandidate(iceCandidate);
            })
        }
        return () => {
            socket.current.off('answer')
        }
    }, [])



    const endCall = () => {
        peerConection.current.getSenders().forEach(sender => {
            sender.track?.stop();
        });
        peerConection.current.close()
        peerConection.current.oniceconnectionstatechange = null;
        peerConection.current.ontrack = null;
        peerConection.current = null;

        setvideoDialog(false)
    }

    const micOnOff = () => {
        try {
            const audioTrack = mystream.getAudioTracks()[0];
            if (audioOnOff) {
                setaudioOnOff(false)
                audioTrack.enabled = false;
            }
            else {
                setaudioOnOff(true)
                audioTrack.enabled = true;
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const cameraOnOff = () => {
        try {
            const videoTrack = mystream.getVideoTracks()[0];
            if (VideoOnOff) {
                setVideoOnOff(false)
                videoTrack.enabled = false;
            }
            else {
                setVideoOnOff(true)
                videoTrack.enabled = true;
            }

        }
        catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <>
            <div className="indox ">

                <div id='indoxContact' className="indoxContact bright d-flex f-d-col ">

                    <h2 className='p4 pp'>{user.user.UserId}</h2>
                    <p className='p3 pp'>Messages</p>
                    <div className="Contacts pp d-flex f-d-col">
                        {user && getContactsloading ? <>
                            <Loading />
                            <Loading />
                            <Loading />
                            <Loading />
                        </> : <>
                            {getContactsmessage?.messageUsers?.length > 0 ? <>
                                {getContactsmessage.messageUsers.map((e) => (
                                    <Link to={`/direct/${e.conversionId}`} key={e.conversionId}>
                                        <User postImage={e.avater.url}
                                            UserName={e.UserName}
                                            UserId={e.UserId}
                                        />
                                    </Link>
                                ))}
                            </> : <>no message yet</>}
                        </>}




                    </div>
                </div>

                <div id='indoxMessage' className="indoxMessage ">
                    {params.id === 'inbox' ? <>

                        <div className="indoxDeshBord d-flex f-d-col justify-content align-items">
                            <MapsUgcOutlined style={{ fontSize: '3rem' }} />
                            <p className='p4'>Your messages</p>
                            <p className='p2'>Send private photos and messages to a friend </p>
                            <p className='btn2 bg3' >Send Message</p>
                        </div>

                    </> : <>

                        {getMessageloading ? <><Loading /></> : <>

                            <div className="div d-flex  f-d-col">
                                <div className="indoxMessageHeader bb1 pp d-flex justify-space-between porfileHeader">
                                    <div>
                                        {message?.conversionUser ? <>
                                            <Link to={`/account/User/${message.conversionUser.UserId}`}>
                                                <User postImage={message.conversionUser.avater.url}
                                                    UserName={message.conversionUser.UserName}
                                                    UserId={message.conversionUser.UserId}
                                                />
                                            </Link>
                                        </> : <></>}

                                    </div>
                                    <div>
                                        <span className='mr' onClick={startCall} ><PhoneForwardedRounded style={{ fontSize: '1.8rem' }} /></span>
                                        <span className='ml1'><InfoOutlined style={{ fontSize: '1.8rem' }} /></span>
                                    </div>
                                </div>



                                <div className='indoxConnatiner'>

                                    <div className=''>
                                        <p className='textalignc mt'><img className='img5 ' src={message?.conversionUser ? message.conversionUser.avater.url : ''} alt='' /></p>
                                        <p className='textalignc mt p3'> {message?.conversionUser ? <>{message.conversionUser.UserName}</> : <>_ _ _ _ _ _ _</>}</p>
                                        <p className='textalignc mt'><Link to={message?.conversionUser ? `/account/User/${message.conversionUser.UserId}` : ''} className=' btn1'>View profile</Link></p>
                                    </div>

                                    <div className='m1 mt' >
                                        {AllMessage?.length > 0 ? <>
                                            {AllMessage.map((e, i) => {
                                                if (e.sender === user.user._id) {
                                                    return <div className='inboxRight' key={i}>
                                                        <p></p>
                                                        <p className='mt pp1 bg3 br'>{e.message}</p>
                                                    </div>
                                                }
                                                else {
                                                    return <div className='inboxLeft mt' key={i}>
                                                        <img className='img6' src={message?.conversionUser?.avater.url} alt='l' />
                                                        <p className='bg2 pp1 br'>{e.message}</p>
                                                    </div>
                                                }
                                            })}
                                        </> : <>
                                            <p className='p1'>No message</p>
                                        </>}
                                    </div>
                                </div>

                                <div className="d-flex sendMessage pp align-items bt1">
                                    <SentimentSatisfied className='f-size1' />
                                    <input className='input bnone' type='text' placeholder='Message...' value={inbox} onChange={(e) => { setinbox(e.target.value) }} />
                                    <p onClick={() => { sendMessage() }}><SendRounded className='f-size1' /></p>
                                </div>
                            </div>
                        </>}
                    </>}

                </div>
            </div>

            <Dialog open={videoDialog} onClose={() => {
                setvideoDialog(false);
            }}>

                <div id='callAccepted'></div>

                <div>
                    <div className="video ">
                        <div className="videoStream">
                            <div className="remoteStream">
                                {remotestream ? <ReactPlayer playing width="100%" height="100%" url={remotestream} /> : <p>call forword</p>}
                            </div>
                            <div className="myStream">
                                {<ReactPlayer playing volume={0} muted width="100%" height="100%" url={mystream} />}
                            </div>
                        </div>
                        <div className="videoHeandleBth d-flex justify-content align-items">
                            <div>
                                {VideoOnOff ? <><Videocam onClick={cameraOnOff} style={{ fontSize: '2rem' }} /></> : <> <VideocamOffRounded onClick={cameraOnOff} style={{ fontSize: '2rem' }} /></>}
                            </div>

                            <div>
                                {audioOnOff ? <><Mic onClick={micOnOff} style={{ fontSize: '2rem' }} /></> : <><MicOffRounded onClick={micOnOff} style={{ fontSize: '2rem' }} /></>}
                            </div>
                            <div onClick={endCall}><CallEndRounded style={{ fontSize: '2rem' }} /></div>
                        </div>
                    </div>
                </div>

            </Dialog>
        </>


    )
}

export default Messages
