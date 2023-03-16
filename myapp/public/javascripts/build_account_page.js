let account = document.querySelector(".account")
console.log("account page")

//登入頁面
let login_page = document.createElement("div")
let login_exit_button = document.createElement("img")
login_exit_button.setAttribute("class", "login_exit_button")
login_exit_button.src = "/images/close.png"
login_page.setAttribute("class", "login_page")
let login_title = document.createElement("div")
let title = document.createElement("h1")
title.setAttribute("class", "title")
title.innerHTML = "會員登入帳號"
let login_form = document.createElement("form")
let login_email = document.createElement("input")
login_email.setAttribute("type", "text")
login_email.setAttribute("placeholder", "請輸入email")
let login_password = document.createElement("input")
login_password.setAttribute("type", "password")
login_password.setAttribute("placeholder", "請輸入密碼")
let login_submit = document.createElement("input")
login_submit.setAttribute("value", "submit提交")
login_submit.setAttribute("type", "submit")
let login_result = document.createElement("div")
login_result.setAttribute("class","login_result")
let go_to_regitser_page = document.createElement("div")
go_to_regitser_page.textContent = "點此註冊"
go_to_regitser_page.setAttribute("class", "go_to_regitser_page")
let login_with_third = document.createElement("div")
login_with_third.setAttribute("class", "login_with_third")
let block = document.createElement("div")
let google_login_href = document.createElement("a")
// google_login_href.setAttribute("href","http://localhost:5000/auth/google") // 本機測試用
google_login_href.setAttribute("href", "http://test8812.foodpass.club/auth/google")
let google_login_image = document.createElement("img")
google_login_image.setAttribute("class", "google_login_image")
let fb_login_href = document.createElement("a")
// fb_login_href.setAttribute("href","http://localhost:5000/auth/facebook")
fb_login_href.setAttribute("href", "http://test8812.foodpass.club/auth/facebook")
fb_login_href.setAttribute("class", "fb_login_href")
let fb_login_image = document.createElement("img")
fb_login_image.setAttribute("class", "fb_login_image")
account.appendChild(login_page)
login_page.appendChild(login_form)
login_page.append(login_exit_button)
login_form.appendChild(login_title)
login_title.appendChild(title)
login_page.appendChild(login_form)
login_form.appendChild(login_email)
login_form.appendChild(login_password)
login_form.appendChild(login_submit)
login_form.appendChild(login_result)
login_page.appendChild(go_to_regitser_page)
login_page.appendChild(login_with_third)
login_with_third.appendChild(block)
login_with_third.appendChild(google_login_href)
google_login_href.appendChild(google_login_image)
login_with_third.appendChild(fb_login_href)
fb_login_href.appendChild(fb_login_image)
go_to_regitser_page.addEventListener("click", () => {
    login_page.style.display = "none"
    register_page.style.display = "block"
})
login_exit_button.addEventListener("click", () => {
    login_page.style.display = "none"
    register_page.style.display = "none"
})
// 建立註冊頁面
let register_page = document.createElement("div")
register_page.setAttribute("class", "register_page")
let register_exit_button = document.createElement("img")
register_exit_button.setAttribute("class", "register_exit_button")
register_exit_button.src = "/images/close.png"
let register_form = document.createElement("form")
let register_title_bar = document.createElement("div")
register_title_bar.setAttribute("class", "register_title_bar")
let register_title = document.createElement("h1")
register_title.setAttribute("class", "register_title")
register_title.textContent = "註冊會員帳號"
let register_name = document.createElement("input")
register_name.setAttribute("type", "text")
register_name.setAttribute("placeholder", "輸入姓名")
let register_email = document.createElement("input")
register_email.setAttribute("type", "text")
register_email.setAttribute("placeholder", "請輸入email")
let register_password = document.createElement("input")
register_password.setAttribute("type", "password")
register_password.setAttribute("placeholder", "請輸入密碼")
let register_submit = document.createElement("input")
register_submit.setAttribute("type", "submit")
register_submit.setAttribute("value", "提交帳號申請")
let error_message = document.createElement("div")
error_message.setAttribute("class", "register_error_message")
let go_to_login_page = document.createElement("div")
go_to_login_page.textContent = "點此切換回登入頁面"
go_to_login_page.setAttribute("class", "go_to_login_page")
account.appendChild(register_page)
register_page.appendChild(register_form)
register_page.appendChild(register_exit_button)
register_form.appendChild(register_title_bar)
register_title_bar.appendChild(register_title)
register_form.appendChild(register_name)
register_form.appendChild(register_email)
register_form.appendChild(register_password)
register_form.appendChild(register_submit)
register_page.appendChild(go_to_login_page)
register_page.appendChild(error_message)
go_to_login_page.addEventListener("click", () => {
    register_page.style.display = "none"
    login_page.style.display = "block"
})
register_exit_button.addEventListener("click", () => {
    login_page.style.display = "none"
    register_page.style.display = "none"
})

let logout = document.getElementById("logout")
logout.addEventListener("click", () => {
    console.log("按下登出鍵")
    fetch("/api/member", {
        method: "delete",
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            location = location
        })
})


// 監聽頁面上的註冊、登入按鍵
let register = document.getElementById("register")
register.addEventListener("click", () => {
    login_page.style.display = "none"
    register_page.style.display = "block"
})

let login = document.getElementById("login")
login.addEventListener("click", () => {
    login_page.style.display = "block"
    register_page.style.display = "none"
})

// 監聽register_page、login_page的display，決定filter的出現或隱藏，使用MutationObserver動態監聽DOM
let backgroundFilter = window.document.getElementById("backgroundFilter")
const observer_login_page = new MutationObserver((mutations) => {
    mutations.forEach((record) => {
        console.log(login_page.style.display)
        if (register_page.style.display != "none" || login_page.style.display != "none") {
            backgroundFilter.style.display = 'flex'
        } else {
            backgroundFilter.style.display = "none"
        }
    })
})
observer_login_page.observe(login_page, {
    attributes: true
})
const observer_register_page = new MutationObserver((mutations) => {
    mutations.forEach((record) => {
        console.log(register_page.style.display)
        if (register_page.style.display != "none" || login_page.style.display != "none") {
            backgroundFilter.style.display = 'flex'
        } else {
            backgroundFilter.style.display = "none"
        }
    })
})
observer_register_page.observe(register_page, {
    attributes: true
})

// 監聽註冊頁面提交按鍵
register_submit.addEventListener("click", (event) => {
    event.preventDefault()
    let fd = new FormData()
    fd.append("name", register_name.value)
    fd.append("email", register_email.value)
    fd.append("password", register_password.value)
    fetch("/api/member", {
        method: "post",
        body: fd
    })
        .then((res) => res.json())
        .then(async (data) => {
            if ("error" in data) {
                console.log(data)
                error_message.textContent = data.message
            } else {
                error_message.textContent = "帳號建立成功!"
                await sleep(1000)

                register_page.style.display = "none"
                login_page.style.display = "block"
            }
        })
})
// 監聽登入頁面提交按鍵
login_submit.addEventListener("click", (event) => {
    event.preventDefault()
    let fd = new FormData()
    fd.append("email", login_email.value)
    fd.append("password", login_password.value)
    fetch("/api/member", {
        method: "put",
        body: fd
    })
        .then((res) => res.json())
        .then(async (data) => {
            console.log(data)
            if (data.status == "ok") {
                alert = "登入成功!"
                login_result.textContent = "登入成功"
                await sleep(1000)
                location = location
            }
        })
})





function sleep(n = 0) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, n);
    });
}
