let cart_page_selector = document.querySelector(".cart_page_selector")
let unpay_list_selector = document.createElement("div")
let history_order_list_selector = document.createElement("div")
let box = document.createElement("div")
let all_price = 0
unpay_list_selector.setAttribute("class", "unpay_list_selector")
unpay_list_selector.textContent = "未結帳清單"
history_order_list_selector.setAttribute("class", "history_order_list_selector")
history_order_list_selector.textContent = "歷史清單"
cart_page_selector.appendChild(unpay_list_selector)
cart_page_selector.appendChild(history_order_list_selector)
cart_page_selector.appendChild(box)

cart_init()


// 取得購物車資訊，並建立未結帳訂單與歷史訂單頁面，最後監聽按鈕
async function cart_init() {
    let token = await get_member_information_by_access_token_in_cookie()
    if (token.error == true) {
        location = location.href = "/"
    }
    let order_list = await cart_get_order_list_number_in_cart()
    if (order_list.message.length != 0) {
        cart_generate_list_all(order_list)
        generate_histort_order_list(order_list)
    } else {
        let message = document.getElementById("message")
        let order_list_input_information = document.getElementById("order_list_input_information")
        order_list_input_information.setAttribute("class", "order_list_input_information")
        order_list_input_information.style.display = "none"
        message.innerHTML = "沒有訂單"
    }
    add_listener()
    let allPriceText = document.getElementById("allPriceText")
    allPriceText.textContent = all_price
}

// 生成歷史訂單
async function generate_histort_order_list() {
    let cart_history_list = document.querySelector(".cart_history_list")
    let bill_list = await fetch("/api/bill_list", { method: "get" }).then((data) => data.json()).then((data) => { return data })
    console.log(JSON.parse(bill_list))
    bill_list = JSON.parse(bill_list)
    let bill_list_keys = Object.keys(bill_list)
    console.log(bill_list_keys)
    let bill_list_value = Object.values(bill_list)
    console.log(bill_list_value)
    let bill_list_entries = Object.entries(bill_list)
    console.log(bill_list_entries)
    console.log(bill_list_entries[0])
    for (let i = bill_list_entries.length - 1; i >= 0; i--) {
        let one_bill = bill_list_entries[i]
        let bill_number = one_bill[0]
        for (let j = 1; j < one_bill.length; j++) {
            let order_list_array = one_bill[j]
            let one_bill_block = document.createElement("div")
            one_bill_block.setAttribute("class", "list1")
            one_bill_block.textContent = "訂單編號 : " + bill_number
            cart_history_list.appendChild(one_bill_block)
            for (let k = 0; k < order_list_array.length; k++) {
                let url = order_list_array[k].image_url
                let name = order_list_array[k].product_name
                let price = order_list_array[k].price
                let quantity = order_list_array[k].quantity
                let count = price * quantity
                let operate = "更多"
                generate_card(one_bill_block, url, name, price, quantity, count, operate)
            }
        }
    }
}



// 取得該使用者的所有訂單紀錄
function cart_get_order_list_number_in_cart() {
    return new Promise((ressolve, reject) => {
        fetch("/api/cart", {
            method: "get"
        }).then((res) => res.json())
            .then((data) => {
                ressolve(data)
            })
            .catch(err => { reject(err) })
    })
}

// 生成未結帳的頁面訊息
function cart_generate_list_all(order_list) {
    let cart_list = document.querySelector(".cart_list")
    cart_list.innerHTML = ""
    let column_title = document.createElement("div")
    column_title.setAttribute("class", "column_title")
    let name1 = document.createElement("div")
    name1.textContent = "商品"
    let price1 = document.createElement("div")
    price1.textContent = "單價"
    let quantity1 = document.createElement("div")
    quantity1.textContent = "數量"
    let count1 = document.createElement("div")
    count1.textContent = "總計"
    let operate = document.createElement("div")
    operate.textContent = "操作"
    cart_list.appendChild(column_title)
    column_title.appendChild(name1)
    column_title.appendChild(price1)
    column_title.appendChild(quantity1)
    column_title.appendChild(count1)
    column_title.appendChild(operate)
    let list = document.createElement("div")
    list.setAttribute("class", "list")
    cart_list.appendChild(list)
    let card_count = 0
    for (let i = 0; i < order_list.message.length; i++) {
        if (order_list.message[i].bill_number == "0") {
            all_price = all_price + order_list.message[i].price * order_list.message[i].quantity
            card_count++
            let order_list_input_information = document.getElementById("order_list_input_information")
            order_list_input_information.style.display = "block"
            let cart_card = document.createElement("div")
            cart_card.setAttribute("class", "cart_card")
            let card_title = document.createElement("div")
            card_title.setAttribute("class", "card_title")
            let card_content = document.createElement("div")
            card_content.setAttribute("class", "card_content")
            let product_info = document.createElement("div")
            product_info.setAttribute("class", "product_info")
            let cart_product_image = document.createElement("div")
            cart_product_image.setAttribute("class", "cart_product_image")
            cart_product_image.style.backgroundImage = `url("${order_list.message[i].image_url}")`
            let cart_product_text = document.createElement("div")
            cart_product_text.setAttribute("class", "cart_product_text")
            console.log(order_list.message[i].product_name)
            let cart_product_name = document.createElement("div")
            cart_product_name.setAttribute("class", "cart_product_name")
            cart_product_name.textContent = order_list.message[i].product_name
            let remart_lable = document.createElement("div")
            remart_lable.setAttribute("class", "remart_lable")
            remart_lable.textContent = "備註:"
            let remark = document.createElement("input")
            remark.setAttribute("class", "remark")
            let product_price = document.createElement("div")
            product_price.setAttribute("class", "product_price")
            product_price.textContent = "$" + order_list.message[i].price
            let product_quantity = document.createElement("div")
            product_quantity.setAttribute("class", "product_quantity")
            product_quantity.textContent = order_list.message[i].quantity
            let product_price_cal = document.createElement("div")
            product_price_cal.setAttribute("class", "product_price_cal")
            product_price_cal.textContent = "$" + order_list.message[i].quantity * order_list.message[i].price
            let cart_operate = document.createElement("div")
            cart_operate.setAttribute("class", "cart_operate")
            let order_list_delete = document.createElement("div")
            order_list_delete.setAttribute("class", "order_list_delete")
            order_list_delete.setAttribute("order_id", order_list.message[i].order_list_id)
            order_list_delete.textContent = "刪除"
            order_list_delete.addEventListener("click", async () => {
                console.log("按下刪除，order_list_id = ", order_list.message[i].order_list_id)
                let fd = new FormData()
                fd.append("order_list_id", order_list.message[i].order_list_id)
                let delete_rel = await fetch("/api/orders", {
                    method: "delete",
                    body: fd
                }).then(res => res.json()).then((data) => { location = location })
            })
            list.appendChild(cart_card)
            cart_card.appendChild(card_title)
            cart_card.appendChild(card_content)
            card_content.appendChild(product_info)
            product_info.appendChild(cart_product_image)
            product_info.appendChild(cart_product_text)
            cart_product_text.appendChild(cart_product_name)
            cart_product_text.appendChild(remart_lable)
            cart_product_text.appendChild(remark)
            card_content.appendChild(product_price)
            card_content.appendChild(product_quantity)
            card_content.appendChild(product_price_cal)
            card_content.appendChild(cart_operate)
            cart_operate.appendChild(order_list_delete)
        }
    }
    if (card_count == 0) {
        let cart_list = document.querySelector(".cart_list")
        cart_list.style.display = "none"
        let message = document.getElementById("message")
        message.textContent = "購物車內暫無訂單"
        let order_list_input_information = document.getElementById("order_list_input_information")
        order_list_input_information.style.display = "none"
    }
}

// 生成單一訂單頁面
function generate_card(outline, url, name, price, quantity, count, operate) {
    let cart_card = document.createElement("div")
    cart_card.setAttribute("class", "cart_card")
    let card_title = document.createElement("div")
    card_title.setAttribute("class", "card_title")
    let card_content = document.createElement("div")
    card_content.setAttribute("class", "card_content")
    let product_info = document.createElement("div")
    product_info.setAttribute("class", "product_info")
    let cart_product_image = document.createElement("div")
    cart_product_image.setAttribute("class", "cart_product_image")
    cart_product_image.style.backgroundImage = `url("${url}")`
    let cart_product_text = document.createElement("div")
    cart_product_text.setAttribute("class", "cart_product_text")
    let cart_product_name = document.createElement("div")
    cart_product_name.setAttribute("class", "cart_product_name")
    cart_product_name.textContent = name
    let remart_lable = document.createElement("div")
    remart_lable.setAttribute("class", "remart_lable")
    let remark = document.createElement("div")
    let product_price = document.createElement("div")
    product_price.setAttribute("class", "product_price")
    product_price.textContent = "$" + price
    let product_quantity = document.createElement("div")
    product_quantity.setAttribute("class", "product_quantity")
    product_quantity.textContent = quantity
    let product_price_cal = document.createElement("div")
    product_price_cal.setAttribute("class", "product_price_cal")
    product_price_cal.textContent = "$" + price * quantity
    let cart_operate = document.createElement("div")
    cart_operate.setAttribute("class", "cart_operate")
    let order_list_delete = document.createElement("div")
    order_list_delete.setAttribute("class", "order_list_delete")
    order_list_delete.textContent = operate
    outline.appendChild(cart_card)
    cart_card.appendChild(card_title)
    cart_card.appendChild(card_content)
    card_content.appendChild(product_info)
    product_info.appendChild(cart_product_image)
    product_info.appendChild(cart_product_text)
    cart_product_text.appendChild(cart_product_name)
    cart_product_text.appendChild(remart_lable)
    cart_product_text.appendChild(remark)
    card_content.appendChild(product_price)
    card_content.appendChild(product_quantity)
    card_content.appendChild(product_price_cal)
    card_content.appendChild(cart_operate)
    cart_operate.appendChild(order_list_delete)
}

// 監聽register_page、login_page的display，決定filter的出現或隱藏，使用MutationObserver動態監聽DOM
function add_listener() {
    let backgroundFilter = window.document.getElementById("backgroundFilter")
    let history_order_list_selector = document.querySelector(".history_order_list_selector")
    let unpay_list_selector = document.querySelector(".unpay_list_selector")
    let order_list_input_information = document.getElementById("order_list_input_information")
    let cart_history_list = document.querySelector(".cart_history_list")
    let cart_list = document.querySelector(".cart_list")
    let message = document.getElementById("message")
    const observer_order_list_input_information = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            console.log(cart_list.style.display)
            if (cart_list.style.display == "none") {
                order_list_input_information.style.display = 'none'
            } else {
                order_list_input_information.style.display = "block"
            }
        })
    })
    observer_order_list_input_information.observe(cart_list, {
        attributes: true
    })
    history_order_list_selector.addEventListener("click", () => {
        cart_history_list.style.display = "block"
        cart_list.style.display = "none"
        message.style.display = "none"
    })
    unpay_list_selector.addEventListener("click", () => {
        cart_history_list.style.display = "none"
        cart_list.style.display = "block"
        message.style.display = "block"
    })
}