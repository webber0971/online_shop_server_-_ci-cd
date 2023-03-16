let upload = document.getElementById("file-uploader")
upload.addEventListener("change", handleFiles, false);
let submit = document.getElementById("submitMessage")
submit.addEventListener("click", uploadMessage, false)
let submit_update_product_info = document.getElementById("submit_update_product_info")
submit_update_product_info.addEventListener("click", update_product_status, false)


async function uploadMessage(event) {
    event.preventDefault()
    let url = ""
    // 判斷是否有要上傳圖片
    if (upload.value != "") {
        //取得presigned url (送get request到後端)
        url = await getPresignedUrl()
        //如果有檔案則使用 presigned url 上傳檔案至s3
        let getUrl = await usePresignedUrlUploadFileToS3(url)
        // 將imageUrl(setUrl) 及 訊息內容傳至伺服器(post request api)
        await sendImageAndMessageContentToServer((url.imageUrl))
    } else {
        //將訊息內容傳至伺服器(post request api)
        console.log("資料不完整")
    }
}

//取得presigned url
function getPresignedUrl() {
    return new Promise((resolve, reject) => {
        type = upload.files[0].name.slice(-4)
        url = "users/api/requestUploadToS3"
        fetch(url, {
            method: "get",
        })
            .then((res) => res.json())
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
// 使用presigned url 上傳檔案
function usePresignedUrlUploadFileToS3(url) {
    return new Promise((resolve, reject) => {
        let form = new FormData()
        form.append("image", upload.files)
        fetch(url.url, {
            method: "put",
            body: upload.files[0]
        })
            .then((res) => res.text())
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 將留言及圖片URL上傳到伺服器端，伺服器端會自動更新到RDS
function sendImageAndMessageContentToServer(imageUrl) {
    return new Promise((resolve, reject) => {
        let product_name = document.getElementById("upload_product_name").value
        let product_price = document.getElementById("upload_product_price").value
        let product_status = document.getElementById("upload_product_status").value
        let fd = new FormData()
        fd.append("image_url", imageUrl)
        fd.append("product_name", product_name)
        fd.append("product_price", product_price)
        fd.append("product_status", product_status)
        fetch("/api/products", {
            method: "post",
            body: fd
        })
            .then((res) => res.json())
            .then((data) => {
                alert("上傳成功")
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}



function handleFiles() {
    let name = String(this.files[0].name)
    readURL(this)
}
function readURL(input) {
    var reader = new FileReader()
    reader.onload = function (e) {
        document.getElementById("preview").src = e.target.result
    }
    reader.readAsDataURL(input.files[0])
}
function printAllMessage() {
    fetch("url", {
        method: "get"
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
}



// 更新產品狀態
function update_product_status(imageUrl) {
    return new Promise((resolve, reject) => {
        let update_product_id = document.getElementById("update_product_id").value
        let update_product_status = document.getElementById("update_product_status").value
        let fd = new FormData()
        fd.append("update_product_id", update_product_id)
        fd.append("update_product_status", update_product_status)
        fetch("/api/products", {
            method: "put",
            body: fd
        })
            .then((res) => res.json())
            .then((data) => {
                alert("更新成功")
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}