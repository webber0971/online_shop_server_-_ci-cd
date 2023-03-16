
//按鈕
let check_order_list_selector = document.querySelector(".check_order_list_selector")
let chat_with_client_selector = document.querySelector(".chat_with_client_selector")
let upload_new_products_selector = document.querySelector(".upload_new_products_selector")
let staff_upload_schedule_selector = document.querySelector(".staff_upload_schedule_selector")
// 訊息頁
let check_bill_list_page = document.querySelector(".check_bill_list_page")
let upload_and_delete_new_products = document.querySelector(".upload_and_delete_new_products")
let staff_report = document.querySelector(".staff_report")
check_order_list_selector.addEventListener("click", () => {
    check_bill_list_page.style.display = "block"
})
chat_with_client_selector.addEventListener("click", () => {
    url = "/users/users_chat_page"
    OpenInNewTab(url)
    function OpenInNewTab(url) {
        var newTab = window.open(url, '_blank');
        newTab.location;
    }
})
upload_new_products_selector.addEventListener("click", () => {
    upload_and_delete_new_products.style.display = "grid"
})
staff_upload_schedule_selector.addEventListener("click", () => {
    staff_report.style.display = "block"
})
only_show_one_page(check_bill_list_page, upload_and_delete_new_products, staff_report)





// 選擇顯示頁面
function only_show_one_page(check_bill_list_page, upload_and_delete_new_products, staff_report) {
    const observer_check_bill_list_page = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            if (check_bill_list_page.style.display != "none") {
                upload_and_delete_new_products.style.display = 'none'
                staff_report.style.display = "none"
            }
        })
    })
    observer_check_bill_list_page.observe(check_bill_list_page, {
        attributes: true
    })
    const observer_upload_and_delete_new_products = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            if (upload_and_delete_new_products.style.display != "none") {
                check_bill_list_page.style.display = 'none'
                staff_report.style.display = "none"
            }
        })
    })
    observer_upload_and_delete_new_products.observe(upload_and_delete_new_products, {
        attributes: true
    })
    const observer_staff_report = new MutationObserver((mutations) => {
        mutations.forEach((record) => {
            if (staff_report.style.display != "none") {
                check_bill_list_page.style.display = 'none'
                upload_and_delete_new_products.style.display = "none"
            }
        })
    })
    observer_staff_report.observe(staff_report, {
        attributes: true
    })
}




