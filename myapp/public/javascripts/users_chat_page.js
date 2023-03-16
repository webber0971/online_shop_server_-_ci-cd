
let client_list_box = document.querySelector(".client_list_box")
let add_friend_box = document.querySelector(".add_friend_box")
let users_chat_room_box = document.querySelector(".users_chat_room_box")
let users_chat_room_box_content = document.querySelector(".users_chat_room_box_content")
let send_chat_information_form = document.getElementById("form")
let add_friend_form = document.getElementById("add_friend_form")
let go_to_chat_room_list_button = document.getElementById("go_to_chat_room_list_button")
let phone_call_button = document.getElementById("phone_call_button")
let search_history_text_button = document.getElementById("search_history_text_button")
let processed_selector = document.getElementById("processed_selector")
let pending_selector = document.getElementById("pending_selector")
let add_friend_button = document.getElementById("add_friend_button")
let filter_unread = document.getElementById("filter_unread")
let filter_pending = document.getElementById("filter_pending")
let filter_processed = document.getElementById("filter_processed")
let filter_all = document.getElementById("filter_all")
let filter_show_text = document.getElementById("filter_show_text")
let list = document.querySelector(".list")
let chat_bar_input = document.getElementById("input")
let client_selector_list = document.querySelector(".client_selector_list")
let user_info = ""
let is_init = true
let socket = io("https://onlineshop.foodpass.club/")

init()

async function init() {
    // 取得user基本資料
    user_info = await fetch("/api/member", { method: "get" }).then(res => res.json()).then((data) => {
        send_chat_information_form.setAttribute("user_id", data.member_id)
        return data
    })
    console.log(user_info)
    // 連上聊天室 server
    refresh_chat_room_selector_list()
    websocker()
    add_some_button_listener()
}


// 刷新聊天室 client list 順序、狀態
async function refresh_chat_room_selector_list() {
    let user_id = send_chat_information_form.getAttribute("user_id")
    let url = "/users/api/get_all_friends_status_list_by_member_id/?user_id=" + String(user_id)
    let get_all_friends_status_by_member_id = await fetch(url, { method: "get" }).then(res => res.json()).then((data) => { return data })
    let client_id = send_chat_information_form.getAttribute("client_id")
    let focus_room_selector_id = "one_client_chat_room_selector" + String(client_id)
    client_selector_list.textContent = ""
    for (let i = 0; i < get_all_friends_status_by_member_id.message.length; i++) {
        let client_id = get_all_friends_status_by_member_id.message[i].send_id
        let client_name = get_all_friends_status_by_member_id.message[i].name
        let read_message_id = get_all_friends_status_by_member_id.message[i].read_message_id
        let unread_message_id = get_all_friends_status_by_member_id.message[i].unread_message_id
        let client_chat_status = ""
        if (read_message_id == null) {
            read_message_id = 0
        }
        if (unread_message_id == null) {
            unread_message_id = 0
        }
        if (parseInt(read_message_id) >= parseInt(unread_message_id)) {
            client_chat_status = "已讀"
        } else {
            client_chat_status = "未讀"
        }
        let client_latest_message_time = get_all_friends_status_by_member_id.message[i].latest_time.substring(0, 10)
        let process_status = get_all_friends_status_by_member_id.message[i].process_status
        generate_one_client_chat_room_selector(client_id, client_name, client_chat_status, client_latest_message_time, process_status, read_message_id, unread_message_id)
    }
    let focus_room_selector = document.getElementById(focus_room_selector_id)
    if (focus_room_selector != null) {
        focus_room_selector.setAttribute("class", "one_client_chat_room_selector_focus")
    } else {
        console.log("尚未選擇對象")
    }

}



// 監聽 待處理、處理完畢、搜尋 按鈕
// process_status filter
function add_some_button_listener() {
    $("#selector_list_search").on("input", function () {
        var text = $(this).val().trim()
        let array_list = document.querySelectorAll(".one_client_chat_room_selector")
        for (let i = 0; i < array_list.length; i++) {
            array_list[i].style.display = "grid"
            if (!array_list[i].getAttribute("name").includes(text)) {
                array_list[i].style.display = "none"
            }
        }
    })

    phone_call_button.addEventListener("click", async () => {
        // check_bll_list_page.style.display="block"
        let user_id = send_chat_information_form.getAttribute("user_id")
        let friend_id = send_chat_information_form.getAttribute("client_id")
        // 在訊息欄發出通話請求
        url = "/users/rooms/new/?user_id=" + user_id + "&friend_id=" + friend_id
        console.log(url)
        console.log(user_id, friend_id)
        if (user_id != null && friend_id != null) {
            OpenInNewTab(url)
        }
        function OpenInNewTab(url) {
            var newTab = window.open(url, '_blank');
            newTab.location;
        }
        // 在對話內容提送出發出通話請求訊息
        let message_text = "發出通話請求"
        send_message_to_socket_server_and_upload_to_db(socket, user_id, friend_id, message_text)
        await sleep(100)
        refresh_chat_room_selector_list()
        console.log("發出通話請求")

    })
    add_friend_button.addEventListener("click", () => {
        if (add_friend_box.style.display == "none") {
            add_friend_box.style.display = "flex"
            client_list_box.style.display = "none"
        } else {
            add_friend_box.style.display = "none"
            client_list_box.style.display = "block"
        }
    })
    go_to_chat_room_list_button.addEventListener("click", () => {
        console.log(client_list_box.style.display)
        if (client_list_box.style.display == "block" || client_list_box.style.display == "") {
            add_friend_box.style.display = "flex"
            client_list_box.style.display = "none"
        } else {
            add_friend_box.style.display = "none"
            client_list_box.style.display = "block"
        }
    })
    pending_selector.addEventListener("click", () => {
        let client_id = send_chat_information_form.getAttribute("client_id")
        let client_room_selector_process_status_id = "one_client_chat_room_selector_process_status" + String(client_id)
        let one_client_chat_room_selector_id = "one_client_chat_room_selector" + String(client_id)
        let one_client_chat_room_selector_cell = document.getElementById(one_client_chat_room_selector_id)
        let process_text = document.getElementById(client_room_selector_process_status_id)
        let new_status = ""
        if (process_text.textContent == "待處理") {
            new_status = null
            one_client_chat_room_selector_cell.setAttribute("process_status", new_status)
            process_text.textContent = new_status
            process_text.style.display = "none"
        } else {
            new_status = "待處理"
            process_text.textContent = new_status
            one_client_chat_room_selector_cell.setAttribute("process_status", new_status)
            process_text.setAttribute("class", "one_client_chat_room_selector_process_status")
            process_text.style.display = "block"
        }
        update_member_process_status(client_id, new_status)
    })

    processed_selector.addEventListener("click", () => {
        let client_id = send_chat_information_form.getAttribute("client_id")
        let client_room_selector_process_status_id = "one_client_chat_room_selector_process_status" + String(client_id)
        let process_text = document.getElementById(client_room_selector_process_status_id)
        let one_client_chat_room_selector_id = "one_client_chat_room_selector" + String(client_id)
        let one_client_chat_room_selector_cell = document.getElementById(one_client_chat_room_selector_id)
        let new_status = ""
        if (process_text.textContent == "處理完畢") {
            new_status = null
            one_client_chat_room_selector_cell.setAttribute("process_status", new_status)
            process_text.textContent = new_status
            process_text.style.display = "none"
        } else {
            new_status = "處理完畢"
            process_text.textContent = new_status
            one_client_chat_room_selector_cell.setAttribute("process_status", new_status)
            process_text.setAttribute("class", "one_client_chat_room_selector_processed_status")
            process_text.style.display = "block"
        }
        update_member_process_status(client_id, new_status)
    })
    filter_unread.addEventListener("click", async () => {
        list.style.display = "none"
        let array_list = document.querySelectorAll(".one_client_chat_room_selector")
        for (let i = 0; i < array_list.length; i++) {
            array_list[i].style.display = "grid"
            if (array_list[i].getAttribute("read_unread") == "已讀") {
                array_list[i].style.display = "none"
            }
        }
    })
    filter_pending.addEventListener("click", async () => {
        list.style.display = "none"
        let array_list = document.querySelectorAll(".one_client_chat_room_selector")
        for (let i = 0; i < array_list.length; i++) {
            array_list[i].style.display = "grid"
            if (array_list[i].getAttribute("process_status") != "待處理") {
                array_list[i].style.display = "none"
            }
        }
    })
    filter_processed.addEventListener("click", async () => {
        list.style.display = "none"
        let array_list = document.querySelectorAll(".one_client_chat_room_selector")
        for (let i = 0; i < array_list.length; i++) {
            array_list[i].style.display = "grid"
            if (array_list[i].getAttribute("process_status") != "處理完畢") {
                array_list[i].style.display = "none"
            }
        }
    })
    filter_all.addEventListener("click", async () => {
        list.style.display = "none"
        let array_list = document.querySelectorAll(".one_client_chat_room_selector")
        for (let i = 0; i < array_list.length; i++) {
            array_list[i].style.display = "grid"
        }
    })
    filter_show_text.addEventListener("click", () => {
        if (list.style.display == "block") {
            list.style.display = "none"
        } else {
            list.style.display = "block"
        }
    })
}

// 更新好友的process_status
async function update_member_process_status(client_id, new_status) {
    let fd = new FormData()
    fd.append("process_status", new_status)
    fd.append("client_id", client_id)
    fd.append("user_id", send_chat_information_form.getAttribute("user_id"))
    let update_message = await fetch("/users/api/update_member_process_status", {
        method: "put",
        body: fd
    }).then((res) => { res.json() }).then((data) => { console.log(data) })
}


// 產生單一 client 狀態
function generate_one_client_chat_room_selector(client_id, client_name, client_chat_status, client_latest_message_time, process_status, read_message_id, unread_message_id) {
    let one_client_chat_room_selector = document.createElement("div")
    let one_client_chat_room_selector_id = "one_client_chat_room_selector" + String(client_id)
    one_client_chat_room_selector.setAttribute("name", client_name)
    one_client_chat_room_selector.setAttribute("id", one_client_chat_room_selector_id)
    one_client_chat_room_selector.setAttribute("process_status", process_status)
    one_client_chat_room_selector.setAttribute("read_unread", client_chat_status)
    one_client_chat_room_selector.setAttribute("class", "one_client_chat_room_selector")
    one_client_chat_room_selector.addEventListener("click", () => {
        console.log(client_id)
        generate_info_of_users_chat_room_box(client_id, client_name)
        update_read_message_id(client_id, read_message_id, unread_message_id)
        renew_chat_room_background_color(one_client_chat_room_selector)
        one_client_chat_room_selector_chat_status.style.display = "none"
    })
    let one_client_chat_room_selector_name = document.createElement("div")
    one_client_chat_room_selector_name.setAttribute("class", "one_client_chat_room_selector_name")
    one_client_chat_room_selector_name.textContent = client_name
    let one_client_chat_room_selector_process_status = document.createElement("div")
    let one_client_chat_room_selector_process_status_id = "one_client_chat_room_selector_process_status" + String(client_id)
    one_client_chat_room_selector_process_status.setAttribute("id", one_client_chat_room_selector_process_status_id)
    one_client_chat_room_selector_process_status.setAttribute("class", "one_client_chat_room_selector_process_status")
    if (process_status == "待處理") {
        one_client_chat_room_selector_process_status.style.display = "block"
        one_client_chat_room_selector_process_status.textContent = process_status
    } else if (process_status == "處理完畢") {
        one_client_chat_room_selector_process_status.setAttribute("class", "one_client_chat_room_selector_processed_status")
        one_client_chat_room_selector_process_status.style.display = "block"
        one_client_chat_room_selector_process_status.textContent = process_status
    }
    let one_client_chat_room_selector_date_and_status = document.createElement("div")
    let one_client_chat_room_selector_latest_massage_time = document.createElement("div")
    one_client_chat_room_selector_latest_massage_time.setAttribute("class", "one_client_chat_room_selector_latest_massage_time")
    one_client_chat_room_selector_latest_massage_time.textContent = client_latest_message_time
    let one_client_chat_room_selector_chat_status = document.createElement("div")
    one_client_chat_room_selector_chat_status.setAttribute("class", "one_client_chat_room_selector_chat_status")
    one_client_chat_room_selector_chat_status.textContent = ""
    if (client_chat_status == "已讀") {
        one_client_chat_room_selector_chat_status.style.display = "none"
    }
    client_selector_list.appendChild(one_client_chat_room_selector)
    one_client_chat_room_selector.appendChild(one_client_chat_room_selector_name)
    one_client_chat_room_selector_name.appendChild(one_client_chat_room_selector_process_status)
    one_client_chat_room_selector.appendChild(one_client_chat_room_selector_date_and_status)
    one_client_chat_room_selector_date_and_status.appendChild(one_client_chat_room_selector_latest_massage_time)
    one_client_chat_room_selector_date_and_status.appendChild(one_client_chat_room_selector_chat_status)
}

function renew_chat_room_background_color(one_client_chat_room_selector) {
    let array_list = document.querySelectorAll(".one_client_chat_room_selector_focus")
    for (let i = 0; i < array_list.length; i++) {
        array_list[i].setAttribute("class", "one_client_chat_room_selector")
    }
    one_client_chat_room_selector.setAttribute("class", "one_client_chat_room_selector_focus")
}

function update_read_message_id(client_id, read_message_id, unread_message_id) {
    if (unread_message_id > read_message_id) {
        let user_id = send_chat_information_form.getAttribute("user_id")
        let fd = new FormData()
        fd.append("client_id", client_id)
        fd.append("user_id", user_id)
        fd.append("unread_message_id", unread_message_id)
        let url = "/users/api/update_read_message_id_in_status_list"
        fetch(url, {
            method: "put",
            body: fd
        }).then((res) => { res.json() }).then(data => { console.log(data) })
    }
}

// 用選定的client 取得歷史訊息，並生成歷史對話紀錄
async function generate_info_of_users_chat_room_box(client_id, client_name) {
    let client_name_box = document.querySelector(".client_name_box")
    client_name_box.textContent = client_name
    send_chat_information_form.setAttribute("client_id", client_id)
    let user_id = send_chat_information_form.getAttribute("user_id")
    let focos_cliene_id = send_chat_information_form.getAttribute("client_id")
    users_chat_room_box_content.textContent = ".....loading"
    url = "/users/api/client/chat_message?member_id=" + String(focos_cliene_id) + "&user_id=" + String(user_id)
    let message1 = await fetch(url, { method: "get" }).then(res => res.json()).then((data) => { return data })
    users_chat_room_box_content.textContent = ""
    for (let i = 0; i < message1.message.length; i++) {
        let one_message = document.createElement("div")
        let item = document.createElement("div")
        if (message1.message[i].send_id == user_id) {
            one_message.setAttribute("class", "one_admin_message")
            item.setAttribute("class", "message_admin")
        } else {
            one_message.setAttribute("class", "one_client_message")
            item.setAttribute("class", "message_client")
        }
        item.textContent = message1.message[i].information
        users_chat_room_box_content.appendChild(one_message)
        one_message.appendChild(item)
        users_chat_room_box_content.scrollTo(0, users_chat_room_box_content.scrollHeight)
    }
    users_chat_room_box_content.scrollTo(0, users_chat_room_box_content.scrollHeight)
}



// 使用 websocket 連上聊天專用server
function websocker() {
    // let socket = io("http://localhost:3000/")
    // let socket = io("https://onlineshop.foodpass.club/")
    let user_id = send_chat_information_form.getAttribute("user_id")
    socket.emit("enter_room", user_id)
    socket.on("user_entered", (user_id) => {
        console.log("server 回傳", user_id)
    })
    socket.on("chat message", async function (msg) {
        let user_id = send_chat_information_form.getAttribute("user_id")
        let focos_client_id = send_chat_information_form.getAttribute("client_id")
        let one_message = document.createElement("div")
        let one_message_text = document.createElement("div")
        if (msg.get_id == user_id && msg.send_id == focos_client_id) {
            one_message.setAttribute("class", "one_client_message")
            one_message_text.setAttribute("class", "message_client")
            one_message_text.textContent = msg.chat_information
        } else if (msg.get_id == focos_client_id && msg.send_id == user_id) {
            one_message.setAttribute("class", "one_admin_message")
            one_message_text.setAttribute("class", "message_admin")
            one_message_text.textContent = msg.chat_information
        } else {
            if (is_init) {
                refresh_chat_room_selector_list()
                is_init = false
                console.log("第一次更新")
            } else {
                await sleep(1000)
                refresh_chat_room_selector_list()
                console.log("第N次刷新")
            }
        }
        users_chat_room_box_content.appendChild(one_message)
        one_message.appendChild(one_message_text)
        users_chat_room_box_content.scrollTo(0, users_chat_room_box_content.scrollHeight)
        if (msg.get_id == user_id && msg.send_id == focos_client_id) {
            // 如果剛好在這個對象的頁面，更改member_chat_status = "已讀"
            let fd = new FormData()
            fd.append("member_id", focos_client_id)
            await sleep(2000)
            fetch("/users/api/update_member_chat_status", {
                method: "put",
                body: fd
            }).then((res) => res.json()).then((data) => { console.log(data) })
        }
    })
    send_chat_information_form.addEventListener("submit", async function (e) {
        e.preventDefault()
        let user_id = send_chat_information_form.getAttribute("user_id")
        let focos_cliene_id = send_chat_information_form.getAttribute("client_id")
        let message_text = chat_bar_input.value
        if (message_text != "") {
            send_message_to_socket_server_and_upload_to_db(socket, user_id, focos_cliene_id, message_text)
        }
        await sleep(100)
        refresh_chat_room_selector_list()
        console.log("傳訊息,刷新")
    })
    add_friend_form.addEventListener("submit", async function (e) {
        e.preventDefault()
        let add_friend_result = document.getElementById("add_friend_result")
        let add_friend_id_input = document.getElementById("add_friend_id_input")
        let friend_id = add_friend_id_input.value
        let url = "/users/api/search_member_id_exit/?member_id=" + String(friend_id)
        add_friend_id_input.value = ""
        console.log(url)
        let res1 = await fetch(url, {
            method: "get"
        }).then((res) => res.json())
            .then(async (data) => {
                if (data.message.length == 0) {
                    add_friend_result.style.display = "block"
                    add_friend_result.textContent = "查無此人"
                } else {
                    add_friend_result.style.display = "block"
                    add_friend_result.textContent = "好友 " + data.message[0].name + " 新增成功"
                    let user_id = send_chat_information_form.getAttribute("user_id")
                    let focos_cliene_id = friend_id
                    let message_text = "哈囉 ~ ~"
                    send_message_to_socket_server_and_upload_to_db(socket, user_id, focos_cliene_id, message_text)
                    await sleep(100)
                    refresh_chat_room_selector_list()
                    console.log("新增好友成功")
                }
            })
    })
}

// 使用 socket 傳送聊天內容，並更新db中的聊天歷史紀錄
function send_message_to_socket_server_and_upload_to_db(socket, user_id, focos_cliene_id, message_text) {
    if (focos_cliene_id == undefined) {
        console.log(focos_cliene_id)
    } else {
        let message = { get_id: focos_cliene_id, send_id: user_id, chat_information: message_text }
        socket.emit("chat message", message)
        chat_bar_input.value = ""
        let fd = new FormData()
        fd.append("get_id", focos_cliene_id)
        fd.append("information", message_text)
        fetch("/api/chat_message", { method: "post", body: fd }).then((res) => res.json()).then((data) => { console.log(data) }).catch(err => console.log(err))
    }
}

// 等待 db 更新
function sleep(n = 0) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, n);
    });
}