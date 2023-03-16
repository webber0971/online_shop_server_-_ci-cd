let board = document.querySelector(".board")
build_project_card_process()

// 取得所有商品訊息與生成頁面
async function build_project_card_process() {
    let all_products_information = await get_projects_info()
    all_products_information = all_products_information.info
    build_project_card(all_products_information)
}

// 取得商品資訊
function get_projects_info() {
    return new Promise((resolve, rejection) => {
        fetch("/api/selling_products_info", {
            method: "get",
        })
            .then((res) => res.json())
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                rejection(error)
            })
    })
}

// 產生商品卡片
function build_project_card(info) {
    for (let i = 0; i < info.length; i++) {
        let temp_product = info[i]
        let card = document.createElement("div")
        card.setAttribute("class", "card")
        let food_picture = document.createElement("div")
        food_picture.setAttribute("class", "food_picture")
        food_picture.style.backgroundImage = `url("${temp_product.image_url}")`
        let food_info = document.createElement("div")
        food_info.setAttribute("class", "food_info")
        let food_name = document.createElement("div")
        food_name.setAttribute("class", "food_name")
        food_name.innerHTML = temp_product.product_name
        let buy_card = document.createElement("div")
        buy_card.setAttribute("class", "buy_card")
        let count_bar = document.createElement("div")
        count_bar.setAttribute("class", "count_bar")
        let cut = document.createElement("input")
        let cut_id = "cut" + String(i)
        cut.setAttribute("id", cut_id)
        cut.setAttribute("type", "button")
        cut.setAttribute("value", "-")
        cut.setAttribute("class", "cut")
        let num = document.createElement("input")
        let num_id = "num" + String(temp_product.product_id)
        let item_id = temp_product.product_id
        num.setAttribute("id", num_id)
        num.setAttribute("type", "text")
        num.setAttribute("value", "0")
        num.setAttribute("class", "num")
        num.setAttribute("item_id", item_id)
        let add = document.createElement("input")
        let add_id = "add" + String(i)
        add.setAttribute("id", add_id)
        add.setAttribute("type", "button")
        add.setAttribute("value", "+")
        add.setAttribute("class", "add")
        let submit_img = document.createElement("img")
        let submit_img_id = "submit_img" + String(i)
        submit_img.setAttribute("id", submit_img_id)
        submit_img.setAttribute("class", "submit_img")
        submit_img.setAttribute("src", "/images/cart.png")
        board.appendChild(card)
        card.appendChild(food_picture)
        card.appendChild(food_info)
        food_info.appendChild(buy_card)
        food_info.appendChild(submit_img)
        buy_card.appendChild(food_name)
        buy_card.appendChild(count_bar)
        count_bar.appendChild(cut)
        count_bar.appendChild(num)
        count_bar.appendChild(add)
        //監聽 參數傳入
        $(function () {
            var count = 0;
            $(`#${cut_id}`).click(function () {
                count = $(`#${num_id}`).val();
                if ($(`#${num_id}`).val() == 0) {
                    return
                } else {
                    count--
                }
                $(`#${num_id}`).val(count)
            })
            $(`#${add_id}`).click(function () {
                count = $(`#${num_id}`).val()
                count++
                $(`#${num_id}`).val(count)
            })
            $(`#${submit_img_id}`).click(function () {
                image_click_event()
                function image_click_event() {
                    $(`#${submit_img_id}`).off("click")
                    let item_temp = document.getElementById(num_id)
                    if (count != 0) {
                        add_to_the_cart_and_init_num(item_temp)
                    } else {
                        $(`#${submit_img_id}`).on("click", image_click_event)
                    }
                }
                async function add_to_the_cart_and_init_num(item_temp) {
                    try {
                        let get = await add_to_the_cart(item_temp.getAttribute("item_id"), count)
                        if (get.error == true) {
                            let login_page = document.querySelector(".login_page")
                            login_page.style.display = "block"
                        } else {
                            $(`#${num_id}`).val(0)
                            $(`#${submit_img_id}`).on("click", image_click_event)
                            get_order_list_number_in_cart()
                            count = 0
                        }
                    }
                    catch {
                        $(`#${submit_img_id}`).on("click", image_click_event)
                        let login_page = document.querySelector(".login_page")
                        login_page.style.display = "block"
                    }
                }
            })
        })
    }
}

// 更新購物車按鈕上的數字
function add_to_the_cart(product_id, quantity) {
    return new Promise((resolve, rejection) => {
        let fd = new FormData()
        fd.append("product_id", product_id)
        fd.append("quantity", quantity)
        fetch("/api/cart", {
            method: "post",
            body: fd
        })
            .then((res) => res.json())
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                rejection(error)
            })
    })
}

