let staff_report_unfinished_bill_list_info = document.querySelector(".staff_report_unfinished_bill_list_info")
let staff_report_finished_bill_list_info = document.querySelector(".staff_report_finished_bill_list_info")


get_all_bill_list()

async function get_all_bill_list() {
    let list = await fetch("/users/api/unfinished_bill", { method: "get" }).then((res) => res.json()).then((data) => { return data })
    bill_list = JSON.parse(list)
    let bill_list_keys = Object.keys(bill_list)
    let bill_list_value = Object.values(bill_list)
    let bill_list_entries = Object.entries(bill_list)
    for (let i = bill_list_entries.length - 1; i >= 0; i--) {
        let one_bill_info = bill_list_entries[i]
        let list
        if (one_bill_info[1][0].bill_status != "已完成") {
            list = staff_report_unfinished_bill_list_info
        } else {
            list = staff_report_finished_bill_list_info
        }
        build_one_bill_box(list, one_bill_info)
    }

}


function build_one_bill_box(list, one_bill_info) {
    let one_bill_price = 0
    let now_status = ""
    let one_bill = document.createElement("div")
    one_bill.setAttribute("class", "staff_report_one_bill")
    let bill_number = document.createElement("div")
    bill_number.textContent = one_bill_info[0]
    let bill_content = document.createElement("div")
    for (let i = 0; i < one_bill_info[1].length; i++) {
        let one_order = document.createElement("div")
        one_order.textContent = one_bill_info[1][i].product_name + "*" + one_bill_info[1][i].quantity
        one_bill_price = one_bill_price + one_bill_info[1][i].quantity * one_bill_info[1][i].price
        now_status = one_bill_info[1][i].bill_status
        bill_content.appendChild(one_order)
    }
    let bill_price = document.createElement("div")
    bill_price.textContent = "$" + one_bill_price
    let bill_status = document.createElement("div")
    let bill_status_selector = document.createElement("select")
    let selector_id = one_bill_info[0]
    bill_status_selector.setAttribute("id", selector_id)
    let bill_status_selector_0 = document.createElement("option")
    bill_status_selector_0.textContent = now_status
    let bill_status_selector_1 = document.createElement("option")
    bill_status_selector_1.textContent = "未處理"
    let bill_status_selector_2 = document.createElement("option")
    bill_status_selector_2.textContent = "處理中"
    let bill_status_selector_3 = document.createElement("option")
    bill_status_selector_3.textContent = "配送中"
    let bill_status_selector_4 = document.createElement("option")
    bill_status_selector_4.textContent = "已完成"
    let bill_submit = document.createElement("div")
    bill_submit.setAttribute("class", "bill_submit")
    bill_submit.setAttribute("selector_id", selector_id)
    bill_submit.textContent = "提交"
    list.appendChild(one_bill)
    one_bill.appendChild(bill_number)
    one_bill.appendChild(bill_content)
    one_bill.appendChild(bill_price)
    one_bill.appendChild(bill_status)
    bill_status.appendChild(bill_status_selector)
    bill_status_selector.appendChild(bill_status_selector_0)
    bill_status_selector.appendChild(bill_status_selector_1)
    bill_status_selector.appendChild(bill_status_selector_2)
    bill_status_selector.appendChild(bill_status_selector_3)
    bill_status_selector.appendChild(bill_status_selector_4)
    one_bill.appendChild(bill_submit)
    let br = document.createElement("hr")
    br.setAttribute("class", "br")
    list.appendChild(br)
    bill_submit.addEventListener("click", () => {
        let bill_number = bill_submit.getAttribute("selector_id")
        console.log(bill_number)
        let get_status = document.getElementById(bill_number)
        console.log(get_status.value)
        let fd = new FormData()
        fd.append("bill_number", bill_number)
        fd.append("bill_status", get_status.value)
        fetch("/users/api/bill", {
            method: "put",
            body: fd
        }).then((res) => res.json())
            .then(
                (data) => {
                    console.log(data)
                    alert("狀態更改成功")
                    location = location
                })
            .catch(err => { console.log(err) })

    })

}

