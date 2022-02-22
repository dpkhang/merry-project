import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/api'

export default function getAPI(method, url, data = null, token = null) {
    return axios({
        method: method,
        url: url,
        headers:  token && `Authorization: Bearer ${token}`,
        data: data
    })
    .then(res=>{
        return {
            timeout: 1,
            status : res.status,
            data: res.data
        }
    })
    .catch(err=>{
        return {
            status: err.response.status,
            message: 'Errors happened!',
            err
        }
    })
}

//APIs get start
async function verifiEmail (email) {
    const data = {
        email: email
    }
    const result = await getAPI('POST', '/check-email', data)
    // eslint-disable-next-line default-case
    switch (result.status) {
        case 200:
            return result.data
        
        case 404:
            return {error: "Chưa nhập email"}
        
        case 500:
            return {error: "Có lỗi xảy ra, xin vui lòng thử lại"}
    }
}


//APIs get chats list
async function getListChat(userId) {
    const result = await getAPI('GET', `/chat/list-chat/${userId}`)
    return result
}

//APIs get friends list
async function getFriendsList(userId) {
    const result = await getAPI('GET', `/friends/${userId}`)
    return result
}

//APIs get groups list
async function getGroupsList(userId) {
    const result = await getAPI('GET', `/groups/${userId}`)
    return result
}


export {
    verifiEmail,
    getListChat,
    getFriendsList,
    getGroupsList
}