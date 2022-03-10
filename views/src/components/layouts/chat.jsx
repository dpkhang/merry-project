import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme, showFeature } from '../../redux/actions/taskbar'
import { updateShowOrderFeature } from '../../redux/actions/extension'
import { useNavigate } from 'react-router-dom'
import TaskBar from '../partials/chat/task-bar/task-bar'
import Tab from '../partials/chat/tabs/Tab'
import AddedFriendDialog  from '../partials/chat/add-friends/add-friends'
import Feature from '../partials/chat/tools/feature/feature'
import CreateGroup from '../partials/chat/create-group/create-group'
import Profile from '../partials/chat/profile/profile'
import Center from '../partials/chat/center/center'
import Loader from '../partials/chat/tools/loader/loader'
import './chat.scss'
import { getFriendsList, getListChat, getGroupsList } from '../APIs/ConnectAPI'
import { addFriendAfterAccept, addFriendRequest, saveChatList, saveFriendsList } from '../../redux/actions/friends'
import { addGroup, saveGroupsList,  } from '../../redux/actions/groups'
import { getConnection, getLogout, sendConnection } from '../Sockets/home'
import { saveUserOffline, saveUserOnline } from '../../redux/actions/user'
import { getRoom, getTextMessageChat } from '../Sockets/socket-chat'
import { getAddGroup } from '../Sockets/socket-group'
import { getAcceptFriend, getAddFriend } from '../Sockets/socket-friend'
import { saveCurrentChat, saveMassage } from '../../redux/actions/message'

function Chat() {
    const theme = useSelector(state => state.taskbar.theme)
    const display = useSelector(state => state.taskbar.addedForm)
    const feature = useSelector(state => state.taskbar.feature)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    //handles
    const handleClick = (e)=> {
        if(!e.target.classList.value.match(/tab-friend-feature-item-show/) ) {
            const display = showFeature({...feature, isShow: 0})
            dispatch(display)
        }

        //hide order feature in extension component
        const hideOrderFeatureExtension = updateShowOrderFeature(null)
        dispatch(hideOrderFeatureExtension)
    }

    useEffect(()=>{
        (async function() {
            let themeLocal = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light-theme'
            let themeState = setTheme(themeLocal)
            dispatch(themeState)
            //call chat list API
            const chatsList = await getListChat(localStorage.getItem('userId'))
            if(chatsList && chatsList.status === 200) {
                console.log(chatsList)
                let chatListAction = saveChatList(chatsList.data.data)
                dispatch(chatListAction)
            } 
            //call friends list API
            const friendsList = await getFriendsList(localStorage.getItem('userId'))
            if(friendsList && friendsList.status === 200) {
                let friendsListAction = saveFriendsList(friendsList.data.data)
                dispatch(friendsListAction)
            }

            const groupsList = await getGroupsList(localStorage.getItem('userId'))
            if(groupsList && groupsList.status === 200) {
                let groupsListAction = saveGroupsList(groupsList.data.data)
                console.log(groupsList)
                dispatch(groupsListAction)
            }
            
            //socket connection
            //send connection
            sendConnection(localStorage.getItem('userId'))
            //listen connection
            getConnection((data)=> {
                if(data.userId !== localStorage.getItem('userId')) {
                    const userOnline = saveUserOnline(data.userId)
                    dispatch(userOnline)
                }
            })

            //logout 
            getLogout((data)=> {
                if(data.userId !== localStorage.getItem('userId')) {
                    const userOffline = saveUserOffline(data.userId)
                    dispatch(userOffline)
                }
            })

            //getRoom
            getRoom((data)=> {
                console.log(data)
            })

            //getAddGroup
            getAddGroup((data)=> {
                const addGroupAction = addGroup(data)
                dispatch(addGroupAction)
                const currentChat = saveCurrentChat({receiverId: data.groupId, name: data.groupName, image: data.image})
                dispatch(currentChat)
            })

            getAddFriend(data => {
                const friendRequest = addFriendRequest(data)
                dispatch(friendRequest)
            })

            getTextMessageChat((data)=> {
                // setMessage(data)
                const message = saveMassage(data)
                dispatch(message)
            })

            getAcceptFriend(data=> {
                const friend = addFriendAfterAccept(data)
                dispatch(friend)
            })


        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        document.getElementsByClassName('chat-wrapper')[0].setAttribute('data-theme', theme)
    }, [theme])

    useEffect(()=>{
        if(!localStorage.getItem('accessToken')) {
            navigate('/')
        }
    })

    return (
        <div className="chat-wrapper" onClick={handleClick}>
            {/* <Loader></Loader> */}
            {
                display === 1 ? 
                <AddedFriendDialog></AddedFriendDialog> 
                : 
                display === 2 ?
                <CreateGroup></CreateGroup> 
                : 
                display === 3 ? 
                <Profile></Profile>
                :
                ''
            }
            <TaskBar></TaskBar>
            <Tab></Tab>
            <Center></Center>
            {
                feature.isShow ? <Feature offset={feature.offset} group={feature.group}>{feature.group ? 'Rời nhóm' : 'Xóa bạn'}</Feature> : ''
            } 
        </div>
    );
}

export default Chat