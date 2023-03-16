let user_id=""
init_entrance_page()
let entrance_online_shop_home_page = "客人專用頁面，可以訂購、刪除餐點，以及購物車與查詢歷史訂單。此外右下角還有聊天功能，可以即時與店家聯繫 !"
let entrance_user_page_text = "店長、員工可以從後台查詢 訂單列表、銷售統計、上傳新品、更改品項狀態、員工回報訂單進度 !"
let entrance_chat_room = "聊天室，方便店家可以同時回復所有顧客訊息，類似 line official account manager 的聊天功能。同時會員們也可以互加好友聊天 !"
let entrance_1v1_video_call = "1 對 1 即時視訊功能 !"
let entrance_welcome_text = document.querySelector(".entrance_welcome_text")

// 入口頁面初始化
function init_entrance_page(){
    use_member_info_to_build_top_right()
    add_entrance_button_listener()
    loopVideo()
}

// 判斷右上角顯示卡
async function use_member_info_to_build_top_right(){
    let member_info 
    member_info = await get_member_information_by_access_token_in_cookie()
    console.log(member_info)
    if(member_info.error){
        user_id="none"
    }else{
        user_id=member_info
    }
}

// 藉由 cookie 取得登入的會員資料
function get_member_information_by_access_token_in_cookie(){
    return new Promise((resolve,reject)=>{
        fetch("/api/member",{
            method:"get",
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            get_order_list_number_in_cart()
            resolve(data)
        }).catch(error=>{
            console.log("error",error)
            reject(error)
        })
    })
}

// 按鈕加上監聽事件
function add_entrance_button_listener(){
    let home_page = document.querySelector(".home_page")
    let user_page = document.querySelector(".user_page")
    let chat_room_entrance = document.querySelector(".chat_room_entrance")
    let video_chat = document.querySelector(".video_chat_entrance")
    let entrance_page_customer_login_button = document.getElementById("entrance_page_customer_login_button")
    let entrance_page_admin_login_button = document.getElementById("entrance_page_admin_login_button")

    entrance_page_admin_login_button.addEventListener("click",()=>{
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
            login_email.value="admin"
            login_password.value = "admin"
        }else{
            let url = "/users"
            OpenInNewTab(url)
        }
    })
    entrance_page_customer_login_button.addEventListener("click",()=>{
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
            login_email.value="customer1"
            login_password.value = "customer1"
        }else{
            let url = "/"
            OpenInNewTab(url)
        }
    })

    home_page.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            let url = "/"
            OpenInNewTab(url)
        }
    })
    home_page.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_online_shop_home_page
    })
    user_page.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            let url = "/users"
            OpenInNewTab(url)
        }
    })
    user_page.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_user_page_text
    })
    chat_room_entrance.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            let url = "/users/users_chat_page"
            OpenInNewTab(url)
        }
    })
    chat_room_entrance.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_chat_room
    })
    video_chat.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            let room_name = _uuid()
            console.log(room_name)
            let url = "/users/video_room/"+String(room_name)
            OpenInNewTab(url)
        }
    })
    video_chat.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_1v1_video_call
    })
}

// 產生不重複編號
function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// 開新分頁
function OpenInNewTab(url) {
    var newTab = window.open(url, '_blank');
    newTab.location;
}

function loopVideo(){
    let vList = ["https://d3ce9biuqz84nv.cloudfront.net/user_page.mp4","https://d3ce9biuqz84nv.cloudfront.net/real_time_text_message.mp4","https://d3ce9biuqz84nv.cloudfront.net/video_call.mp4","https://d3ce9biuqz84nv.cloudfront.net/client_buy_flow.mp4"]
    let vLen = vList.length
    let curr = 0
    let myvideo = document.getElementById("video_details")
    myvideo.onended = function(){
        myvideo.src = vList[curr]
        myvideo.load()
        myvideo.play()
        curr++
        if(curr>=vLen){
            curr = 0
        }
    }
}