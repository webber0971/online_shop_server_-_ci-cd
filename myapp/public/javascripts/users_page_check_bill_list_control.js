let show_bill_list = document.querySelector(".show_bill_list")
let product_quantity_list = document.querySelector(".product_quantity_list")
let check_bill_list_page_box = document.querySelector(".check_bill_list_page_box")
show_bill_list.addEventListener("click", () => {
    check_bill_list_page_box.style.display = "block"
    selling_chart.style.display = "none"
})
product_quantity_list.addEventListener("click", () => {
    check_bill_list_page_box.style.display = "none"
    selling_chart.style.display = "block"
})