let staff_report_unfinished_bill_selector = document.querySelector(".staff_report_unfinished_bill_selector")
let staff_report_finished_bill_selector = document.querySelector(".staff_report_finished_bill_selector")

// let staff_report_unfinished_bill_list_info = document.querySelector(".staff_report_unfinished_bill_list_info")
// let staff_report_finished_bill_list_info = document.querySelector(".staff_report_finished_bill_list_info")

staff_report_unfinished_bill_selector.addEventListener("click", () => { staff_report_unfinished_bill_list_info.style.display = "block" })
staff_report_finished_bill_selector.addEventListener("click", () => { staff_report_finished_bill_list_info.style.display = "block" })

only_show_one_page(staff_report_unfinished_bill_list_info, staff_report_finished_bill_list_info)


// 動態觀察，決定顯示頁面
function only_show_one_page(staff_report_unfinished_bill_list_info, staff_report_finished_bill_list_info) {
    const observer_staff_report_unfinished_bill_list_info = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            console.log(staff_report_unfinished_bill_list_info.style.display)
            if (staff_report_unfinished_bill_list_info.style.display != "none") {
                staff_report_finished_bill_list_info.style.display = 'none'
            }
        })
    })
    observer_staff_report_unfinished_bill_list_info.observe(staff_report_unfinished_bill_list_info, {
        attributes: true
    })
    const observer_staff_report_finished_bill_list_info = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            console.log(staff_report_finished_bill_list_info.style.display)
            if (staff_report_finished_bill_list_info.style.display != "none") {
                staff_report_unfinished_bill_list_info.style.display = 'none'
            }
        })
    })
    observer_staff_report_finished_bill_list_info.observe(staff_report_finished_bill_list_info, {
        attributes: true
    })

}