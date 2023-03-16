let client_id = ""
let client_connect_to_server = document.querySelector(".client_connect_to_server")
client_connect_to_server.setAttribute("class", "client_connect_to_server")
let client_chat_room_open_button = document.createElement("div")
client_chat_room_open_button.setAttribute("class", "client_chat_room_open_button")
client_chat_room_open_button.textContent = "聊聊"
client_connect_to_server.appendChild(client_chat_room_open_button)
let client_chat_room = document.createElement("div")
client_chat_room.setAttribute("class", "client_chat_room")
client_connect_to_server.appendChild(client_chat_room)
let history_chat_information_box = document.createElement("div")
history_chat_information_box.setAttribute("class", "history_chat_information_box")
let history_chat_information = document.createElement("div")
history_chat_information.setAttribute("class", "history_chat_information")
let send_chat_information_form_box = document.createElement("div")
send_chat_information_form_box.setAttribute("class", "send_chat_information_form_box")
let send_chat_information_form = document.createElement("form")
send_chat_information_form.setAttribute("class", "send_chat_information_form")
let chat_bar_input = document.createElement("input")
chat_bar_input.setAttribute("class", "chat_bar_input")
let chat_bar_button = document.createElement("button")
chat_bar_button.setAttribute("class", "chat_bar_button")
chat_bar_button.textContent = "send"
client_chat_room.appendChild(history_chat_information_box)
history_chat_information_box.appendChild(history_chat_information)
history_chat_information_box.appendChild(send_chat_information_form_box)
send_chat_information_form_box.appendChild(send_chat_information_form)
send_chat_information_form.appendChild(chat_bar_input)
send_chat_information_form.appendChild(chat_bar_button)

init_chat_room(client_id)

// 監聽按鈕事件
client_chat_room_open_button.addEventListener("click", () => {
    if (client_chat_room.style.display == "none" || client_chat_room.style.display == "") {
        client_chat_room.style.display = "block"
        history_chat_information.scrollTo(0, history_chat_information.scrollHeight)
    } else {
        history_chat_information.scrollTo(0, history_chat_information.scrollHeight)
        client_chat_room.style.display = "none"
    }
})

// 聊天室內容初始化
async function init_chat_room(client_id) {
    insert_message_to_message_room()
    client_id = await get_member_information_by_access_token_in_cookie()
    websocker(client_id)
}

// 連上 websocket server 即時取得聊天內容
function websocker(client_id) {
    let socket = io("https://onlineshop.foodpass.club/")
    socket.emit("enter_room", client_id)
    socket.on("user_entered", (client_id) => {
        console.log("server 回傳", client_id)
    })
    socket.on("chat message", function (msg) {
        console.log(msg)
        let one_message = document.createElement("div")
        let item = document.createElement("li")
        let next_line = document.createElement("br")
        if (msg.get_id == 1 && msg.send_id == client_id) {
            one_message.setAttribute("class", "one_clinet_message")
            item.setAttribute("class", "message_client")
            item.textContent = msg.chat_information
            history_chat_information.appendChild(one_message)
            history_chat_information.appendChild(next_line)
            one_message.appendChild(item)
            history_chat_information.scrollTo(0, history_chat_information.scrollHeight)
        }
        if (msg.get_id == client_id && msg.send_id == 1) {
            one_message.setAttribute("class", "one_admin_message")
            item.setAttribute("class", "message_admin")
            item.textContent = msg.chat_information
            history_chat_information.appendChild(one_message)
            history_chat_information.appendChild(next_line)
            one_message.appendChild(item)
            history_chat_information.scrollTo(0, history_chat_information.scrollHeight)
        }
    })
    send_chat_information_form.addEventListener("submit", function (e) {
        e.preventDefault()
        let message_text = chat_bar_input.value
        if (client_id == undefined) {
            let login_page = document.querySelector(".login_page")
            login_page.style.display = "block"
        } else {
            if (chat_bar_input.value != "") {
                let admin_id = 1
                let message = { get_id: admin_id, send_id: client_id, chat_information: message_text }
                socket.emit("chat message", message)
                chat_bar_input.value = ""
                let fd = new FormData()
                fd.append("information", message_text)
                fd.append("get_id", admin_id)
                fetch("/api/chat_message", { method: "post", body: fd }).then((res) => res.json()).then((data) => { console.log(data) }).catch(err => console.log(err))
            }
        }
    })
}



// 取得memeber id
function get_member_information_by_access_token_in_cookie() {
    return new Promise((resolve, reject) => {
        fetch("/api/member", {
            method: "get",
        })
            .then((res) => res.json())
            .then((data) => {
                client_id = data.member_id
                get_order_list_number_in_cart()
                resolve(data.member_id)
            }).catch(error => {
                console.log("error", error)
                reject(error)
            })
    })
}


// 顯示聊天室歷史紀錄
async function insert_message_to_message_room() {
    let message = await fetch("/api/client/chat_message", { method: "get" }).then((res) => res.json())
        .then((data) => {
            let history_chat_information = document.querySelector(".history_chat_information")
            for (let i = 0; i < data.message.length; i++) {
                let one_message = document.createElement("div")
                let item = document.createElement("li")
                let next_line = document.createElement("br")
                if (data.message[i].send_id == "1") {
                    one_message.setAttribute("class", "one_admin_message")
                    item.setAttribute("class", "message_admin")
                } else {
                    one_message.setAttribute("class", "one_clinet_message")
                    item.setAttribute("class", "message_client")
                }
                item.textContent = data.message[i].information
                history_chat_information.appendChild(one_message)
                history_chat_information.appendChild(next_line)
                one_message.appendChild(item)
                history_chat_information.scrollTo(0, history_chat_information.scrollHeight)
            }
            history_chat_information.scrollTo(0, history_chat_information.scrollHeight)
        })
}

