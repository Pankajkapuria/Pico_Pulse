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
import peer from './Peer'
import { toast } from 'react-hot-toast'
import { Dialog } from '@mui/material'
import ReactPlayer from 'react-player'

const Messages = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const socket = useRef({});
    const [users, setusers] = useState([]);
    const [inbox, setinbox] = useState('');
    const [AllMessage, setAllMessage] = useState([]);
    const [Contacts, setContacts] = useState(false);
    const [remoteUser, setremoteUser] = useState();
    const [streamSend, setstreamSend] = useState(false)
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
    }, [])

    useEffect(() => {

        socket.current?.emit(Actions.JOIN, user.user._id);

        socket.current?.on(Actions.JOINED, ({ Messageusers }) => {
            setusers(Messageusers);
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

                if (peer.peer.signalingState !== 'closed') {
                    const offer = await peer.getOffer();
                    socket.current?.emit(Actions.CALL_SEND, {
                        offer: offer,
                        userId: message?.conversionUser?._id
                    })
                }
                else {
                    toast.error('try after some time')
                    setvideoDialog(false)
                }

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

    const sendStream = useCallback(() => {
        let setled = false;
        const interval = setInterval(() => {
            if (mystream) {
                for (const track of mystream.getTracks()) {
                    console.log('track add')
                    peer.peer.addTrack(track, mystream);
                }
                setled = true
            }
            if (setled) {
                clearInterval(interval)
            }
        }, 1000);
    }, [mystream])


    const Incoingclall = useCallback(async ({ socketId, userId, offer }) => {
        setremoteUser(socketId);
        try {
            setvideoDialog(true);
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setmystream(stream);
            const answer = await peer.getAnswer(offer);
            socket.current.emit(Actions.CALL_AECPTED, {
                socketId,
                userId,
                answer
            })
        }
        catch (error) {
            toast.error(error?.message)
            setvideoDialog(false)
        }
    }, [socket])


    const hendelcallAccepeted = useCallback(async ({ socketId, userId, answer }) => {
        setremoteUser(socketId);
        await peer.setLocalDescripti(answer);
        sendStream();
        setstreamSend(true)
    }, [sendStream])

    const negoIncoming = useCallback(async ({ socketId, offer }) => {
        const answer = await peer.getAnswer(offer);
        socket.current?.emit(Actions.PEER_NEGO_DONE, { socketId, answer })
    }, [])

    const negofinal = useCallback(async ({ answer }) => {
        await peer.setLocalDescripti(answer);
    }, [])


    useEffect(() => {
        socket.current?.on(Actions.CALL_REJECTED, ({ msg }) => {
            setvideoDialog(false)
            toast.error(msg)
        })
        socket.current?.on(Actions.INCOMING_CALL, Incoingclall)
        socket.current?.on(Actions.CALL_AECPTED, hendelcallAccepeted)
        socket.current?.on(Actions.PEER_NEGO_NEEDED, negoIncoming)
        socket.current?.on(Actions.PEER_NEGO_FINAL, negofinal)


        return () => {
            socket.current?.off(Actions.CALL_REJECTED)
            socket.current?.off(Actions.INCOMING_CALL, Incoingclall)
            socket.current?.off(Actions.CALL_AECPTED, hendelcallAccepeted)
            socket.current?.off(Actions.PEER_NEGO_NEEDED, negoIncoming)
            socket.current?.off(Actions.PEER_NEGO_FINAL, negofinal)

        }

    }, [Incoingclall, hendelcallAccepeted, negoIncoming, negofinal])

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.current?.emit(Actions.PEER_NEGO_NEEDED, { offer, socketId: remoteUser });
    }, [remoteUser, socket]);

    useEffect(() => {
        peer.peer.addEventListener(Actions.NEGOTIATIONNEEDED, handleNegoNeeded);

        return () => {
            peer.peer.removeEventListener(Actions.NEGOTIATIONNEEDED, handleNegoNeeded);
        }
    }, [handleNegoNeeded])


    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!", remoteStream);
            setremotestream(remoteStream[0]);
        });
    }, [remotestream]);

    const endCall = () => {
        peer.peer.getSenders().forEach(sender => {
            sender.track.stop();
        });
        peer.peer.close()
        setvideoDialog(false)
    }

    const micOnOff = () => {
        try {
            const audioTrack = mystream.getAudioTracks()[0];
            if (audioOnOff) {
                setaudioOnOff(false)
                // const sender = peer.peer.getSenders().find(sender => sender.track.kind === 'audio');
                // peer.peer.removeTrack(sender);
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

    useEffect(() => {
        peer.peer.oniceconnectionstatechange = function (event) {
            if (peer.peer.iceConnectionState === 'disconnected') {
                peer.peer.getSenders().forEach(sender => {
                    sender.track.stop();
                });

                peer.peer.close()
                setvideoDialog(false)
            }
        }
    }, [])



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

                {remoteUser && streamSend === false && <div id='button' className='pp d-flex f-d-col align-items' >
                    <p className='p3 '>Incoming call...</p>
                    <img className='img2' src={message?.conversionUser.avater.url} alt='img' />
                    <div className='mtb'><button className='btn2 bg5' onClick={() => {
                        setstreamSend(true)
                        sendStream();
                        document.getElementById('button').style.display = 'none'
                    }}>accepted</button>

                        <button className='btn2 bg6 ml1' onClick={() => {
                            setvideoDialog(false)
                            document.getElementById('button').style.display = 'none'
                            socket.current.emit(Actions.CALL_REJECTED, { socketId: remoteUser })
                        }}>reject</button></div>
                </div>}

                <div>
                    <div className="video ">
                        <div className="videoStream">
                            <div className="remoteStream">
                                {remotestream ? <ReactPlayer width="100%" height="100%" playing url={remotestream} /> : <p>call forword</p>}
                            </div>
                            <div className="myStream">
                                {<ReactPlayer playing muted width="100%" height="100%" url={mystream} />}
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
