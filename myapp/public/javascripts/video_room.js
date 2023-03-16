// 前端實作程式碼
// import {io} from "socket.io-client"
// import Peer from "peerjs"

// const socket =io()
// let socket = io("http://localhost:3000/")
let socket = io("https://onlineshop.foodpass.club/")
const room_id = document.querySelector("#room_id").dataset.id
// const myPeer = new Peer({ host: "13.114.149.85", port: 9000 })
const myPeer = new Peer(undefined, { host: "foodpass.club", port: 443, secure: true })


const videoGrid = document.querySelector(".video-container")
let ROOM_ID = document.getElementById("room_number").textContent
let friend_id = ""
let video_button_open = document.querySelector(".video_button_open")
let video_button_close = document.querySelector(".video_button_close")
let mic_button_open = document.querySelector(".mic_button_open")
let mic_button_close = document.querySelector(".mic_button_close")
let mic_button = document.getElementById("mic_button")
let my_stream = ""

add_button_listener()
observe_video_and_audio_status()



console.log("ROOM_ID", ROOM_ID)

const myVideo = document.createElement('video')
myVideo.width = "200"
myVideo.height = "150"
myVideo.muted = true
const peers = {}

myPeer.on('open', id => {
    console.log("open")
    console.log("user_id", id)
    console.log("room_id", ROOM_ID)
    socket.emit('join-room', ROOM_ID, id)
})

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    my_stream = stream
    console.log("this my stream =", stream)
    addMyVideoStream(myVideo, stream)
    console.log("建立自己的畫面")

    console.log(videoGrid.childNodes, "-------")


    observe_video_and_audio_status()

    myPeer.on('call', call => {
        console.log("收到返回的 call 邀請")
        console.log(call)
        friend_id = call.peer
        console.log("房主的id = ", friend_id)
        call.answer(stream)
        const video = document.createElement('video')
        video.setAttribute("class", "friend_video")
        // video.width = "550"
        // video.height= "440"
        call.on('stream', userVideoStream => {
            console.log("this is other stream")
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        friend_id = userId
        console.log("friend_id 變更")
        console.log(userId, "+")
        setTimeout(connectToNewUser, 500, userId, stream)
    })
}).catch((err) => { console.log("取得鏡頭失敗") })

socket.on('user-disconnected', userId => {
    console.log(userId, "-")
    videoGrid.innerHTML = ""
    socket.close()
    myPeer.destroy()
    if (peers[userId]) peers[userId].close()
})


async function connectToNewUser(userId, stream) {
    console.log("收到別人的user_id = ", userId)
    console.log("自己的的 stream = ", stream)
    console.log("用call發出請求")
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    // await sleep(1000)
    call.on('stream', userVideoStream => {
        console.log("別人的 stream =")
        video.setAttribute("class", "friend_video")
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        console.log("close")
        video.remove()
    })

    peers[userId] = call
    console.log(peers.length)
}


function add_button_listener() {
    let video_button = document.getElementById("video_button")
    let hang_up_button = document.getElementById("hang_up_button")

    video_button.addEventListener("click", () => {
        console.log("video_button_open = ", video_button_open.style.display)
        if (video_button_open.style.display == "none") {
            video_button_open.style.display = "block"
            video_button_close.style.display = "none"
        } else {
            video_button_open.style.display = "none"
            video_button_close.style.display = "block"
        }
    })
    mic_button.addEventListener("click", () => {
        console.log("mic")
        console.log("mic_button_open = ", mic_button_open.style.display)
        if (mic_button_open.style.display == "none") {
            mic_button_open.style.display = "block"
            mic_button_close.style.display = "none"
        } else {
            mic_button_open.style.display = "none"
            mic_button_close.style.display = "block"
        }
    })
    hang_up_button.addEventListener("click", () => {
        console.log("hang_on")
        // socket.emit("disconnect")
        location.href = "https://test8812.foodpass.club/users/users_chat_page"
        socket.close()
        myPeer.destroy() // 段開 peerjs 連線
    })
}



// function restart_video(media_status) {
//     myPeer.on('open', id => {
//         console.log("open")
//         console.log("user_id", id)
//         console.log("room_id", ROOM_ID)
//         socket.emit('join-room', ROOM_ID, id)
//     })
//     let my_new_stream = navigator.mediaDevices.getUserMedia(media_status).then(stream => {
//         console.log("this my stream =", stream)
//         addMyVideoStream(myVideo, stream)
//         console.log("建立自己的畫面")
//         console.log("friend_id = ",friend_id)
//         send_new_stream_to_friend(friend_id,stream)
//         return stream
//     })
// }

// async function send_new_stream_to_friend(userId, stream) {
//     console.log("要重新發送stream的friend_id = ", userId)
//     console.log("要重新發送的 stream = ", stream)
//     console.log("用call發出請求")
//     myPeer.call(userId, stream)  //重新發送peer.call 可以指定id 發送新的stream
// }




function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    if (videoGrid.childNodes.length == 0) {
        videoGrid.append(video)
    } else {
        videoGrid.innerHTML = ""
        videoGrid.append(video)
    }
}

function addMyVideoStream(video, stream) {
    let myVideoContainer = document.querySelector(".my_video_container")
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    myVideoContainer.append(video)
}


function sleep(n = 0) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, n);
    });
}


// 監聽 螢幕 與 麥克風的開關狀態
function observe_video_and_audio_status() {
    const observe_video_button = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            // let video_status=""
            // let radio_status= ""
            if (video_button_close.style.display != "block") {
                console.log("視訊開啟中")
                video_status = true
                my_stream.getVideoTracks()[0].enabled = true
            } else {
                console.log("視訊關閉中")
                video_status = false
                my_stream.getVideoTracks()[0].enabled = false
            }
            // console.log(mic_button_open.style.display)
            // if(mic_button_close.style.display != "block"){
            //     radio_status =true
            // }else{
            //     radio_status=false
            // }
            // console.log("video_status :",video_status)
            // console.log("radio_status :",radio_status)
            // let media_status = {video:video_status , audio:radio_status}
            // restart_video(media_status)
        })
    })
    observe_video_button.observe(video_button_open, {
        attributes: true
    })

    const observe_mic_button = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            // let video_status=""
            // let radio_status= ""
            // if(video_button_close.style.display != "block"){
            //     video_status = true
            // }else{
            //     video_status= false
            // }
            if (mic_button_close.style.display != "block") {
                console.log("麥克風開啟中")
                my_stream.getAudioTracks()[0].enabled = true
                radio_status = true
            } else {
                console.log("麥克風關閉中")
                my_stream.getAudioTracks()[0].enabled = false
                radio_status = false
            }
            // console.log("video_status :",video_status)
            // console.log("radio_status :",radio_status)
            // let media_status = {video:video_status , audio:radio_status}
            // if(video_status == false && radio_status== false){
            //     // restart_video_novideo_noradio(media_status)
            //     myPeer.call(friend_id,"")
            // }else{
            //     restart_video(media_status)
            // }
        })
    })
    observe_mic_button.observe(mic_button_open, {
        attributes: true
    })
}