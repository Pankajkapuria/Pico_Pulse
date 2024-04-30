import React, { useEffect } from 'react'
import '../Home/Home.css'
import { Link } from 'react-router-dom'
import Posts from '../usable/Posts'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowingPost, suggestedUsers } from '../../Actions/user'
import User from '../usable/User'
import Loading2 from './../Loading/Loading2';
import { getPopulearPosts } from '../../Actions/post'
const Home = ({ Notifactionsocket }) => {

    const dispatch = useDispatch();

    const { loading, suggestedUser } = useSelector((state) => state.suggestedUsers)
    const { isAuthenticated, user } = useSelector((state) => state.user)
    const { populearUserloading, populearUser } = useSelector((state) => state.populearUsers)
    const { PostOfFollowing, PostOfFollowingloading } = useSelector((state) => state.postOfFollowing)
    const { populerPostsloading, Message } = useSelector((state) => state.populerPostsReducer)

    useEffect(() => {
        dispatch(getPopulearPosts());
        dispatch(getFollowingPost());
        dispatch(suggestedUsers());
    }, [dispatch])


    return (
        PostOfFollowingloading !== false ? <><div className='d-flex align-items justify-content h1'><Loading2 /></div></> : <>
            <div className='home'>
                <div className="homemid">

                    <div className="story">
                    </div>

                    <div className="homepostes">
                        {PostOfFollowing && PostOfFollowing.length > 0 ? <>
                            {
                                PostOfFollowing.map((e, i) => (
                                    <Posts key={i}
                                        owner={e.owner._id}
                                        ownerProfileImg={e.owner.avater.url}
                                        ownerId={e.owner.UserId}
                                        ownerName={e.owner.name}
                                        location={e.location}
                                        posttime='10'
                                        postImg={e.image.url}
                                        like={e.likes}
                                        caption={e.caption}
                                        comments={e.comments}
                                        PostId={e._id}
                                        followUnfollowbtn="unfollow"
                                        Notifactionsocket={Notifactionsocket}
                                    />
                                ))
                            }
                        </> : <>
                            {populerPostsloading ? <Loading2 /> : <>
                                {Message?.posts?.map((e, i) => (
                                    <Posts key={i}
                                        owner={e.owner._id}
                                        ownerProfileImg={e.owner.avater.url}
                                        ownerId={e.owner.UserId}
                                        ownerName={e.owner.name}
                                        location={e.location}
                                        posttime='10'
                                        postImg={e.image.url}
                                        like={e.likes}
                                        caption={e.caption}
                                        comments={e.comments}
                                        PostId={e._id}
                                        followUnfollowbtn="unfollow"
                                        Notifactionsocket={Notifactionsocket}
                                    />
                                ))}
                            </>}
                        </>}
                    </div>




                </div>

                {loading && populearUserloading ? <Loading2 /> :
                    <div className="homerigth">

                        <div className="homeProfile">
                            {isAuthenticated && user?.user ? <><Link to={`/account/User/${user.user.UserId}`}>
                                <User postImage={user.user.avater?.url} UserName={user.user?.name} UserId={user.user?.UserId} LinkBtn="" />
                            </Link></> : <></>}
                        </div>


                        <div className='SuggestedForYou'>
                            <p>Suggested for you</p>
                            <Link>see All</Link>
                        </div>


                        <div className="suggestionsPost">
                            {
                                suggestedUser?.usres?.length > 0 && isAuthenticated ? suggestedUser.usres.map((e, i) => (
                                    <Link to={`/account/User/${e.UserId}`} key={i}>
                                        <User postImage={e.avater.url} UserName={e.name} UserId={e.UserId} LinkBtn="follow" _id={e._id} />
                                    </Link>
                                )) : <>
                                    {
                                        populearUser?.usres?.length > 0 ? populearUser.usres.map((e, i) => {
                                            return <>
                                                {user?.user?._id === e._id ? <></> : <>
                                                    <Link to={`/account/User/${e.UserId}`} key={i}>
                                                        <User postImage={e.avater.url} UserName={e.name} UserId={e.UserId} LinkBtn="follow" _id={e._id} />
                                                    </Link>
                                                </>}
                                            </>
                                        }) : <></>
                                    }
                                </>
                            }
                        </div>
                    </div>
                }

            </div >
        </>
    )
}

export default Home
