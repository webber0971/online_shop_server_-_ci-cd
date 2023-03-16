let photosCount = 0
let displayPhotoIndex = 0
let allPhotoUrlList = []
let userName = ""
let allPrice = 0
let orderIdList = []
let unpay_order_id_list = []
build_orderIdList()
let loadingWrapper = window.document.getElementById("loading-wrapper1")
somethingFadeout(0, 3, loadingWrapper)
let card_number=window.document.getElementById("card-number")
card_number.style.backgroundColor="white"
let tappay_expiration_date = window.document.getElementById("tappay-expiration-date")
tappay_expiration_date.style.backgroundColor="white"
let tappay_cvv = window.document.getElementById("tappay-cvv")
tappay_cvv.style.backgroundColor="white"


// 將選定的element依照時間淡出("等待執行時間,"淡出過程的時間","所選定的element")
async function somethingFadeout(waitiTime, time, selectElement) { //單位都是秒
    // let loadingWrapper=window.document.getElementById("loading-wrapper")
    await window.setTimeout(function () {
        let index = 1
        let cycleTime = time / 500 / 1000
        let loadingImage = window.setInterval(function () {
            if (index <= 0) {
                selectElement.style.display = "none"
                window.clearInterval(loadingImage)
            }
            index = index - 0.002
            selectElement.style.opacity = index
        }, cycleTime)
    }, waitiTime * 1000)
}



function build_orderIdList() {
    return new Promise((ressolve, reject) => {
        fetch("/api/cart", {
            method: "get"
        }).then((res) => res.json())
            .then((data) => {
                for (let i = 0; i < data.message.length; i++) {
                    if (data.message[i].bill_number == 0) {
                        unpay_order_id_list.push(data.message[i].order_list_id)
                        allPrice = allPrice + data.message[i].price * data.message[i].quantity
                    }
                    orderIdList.push(data.message[i].order_list_id)
                }
                ressolve(data)
            })
            .catch(err => { reject(err) })
    })
}


TPDirect.setupSDK(126995, 'app_cijd3ehqZJy7gMOxU66OlobyZJqakm7GmyHZxmbKbaoz4ldketgWEliXFDVG', 'sandbox')
TPDirect.card.setup({
    fields: {
        number: {
            element: window.document.getElementById("card-number"),
            placeholder: '**** **** **** ****',
        },
        expirationDate: {
            element: document.getElementById("tappay-expiration-date"),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: document.getElementById("tappay-cvv"),
            placeholder: '後三碼'
        }
    },
    styles: {
        'input': {
            'color': 'gray',
            // 'background_color':"gray"
        },
        'input.ccv': {
            'font-size': '15px',
            'display': 'inline-block'
        },
        ':focus': {
            'color': 'green'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
    /* Disable / enable submit button depend on update.canGetPrime  */
    /* ============================================================ */

    // update.canGetPrime === true
    //     --> you can call TPDirect.card.getPrime()
    // const submitButton = document.querySelector('button[type="submit"]')
    if (update.canGetPrime) {
        // // submitButton.removeAttribute('disabled')
        // $('button[type="submit"]').removeAttr('disabled')
        document.getElementById("submitPayment").removeAttribute("disabled")
    } else {
        // submitButton.setAttribute('disabled', true)
        // $('button[type="submit"]').attr('disabled', true)
        document.getElementById("submitPayment").setAttribute("disabled", true)
    }


    /* Change card type display when card type change */
    /* ============================================== */

    // cardTypes = ['visa', 'mastercard', ...]
    var newType = update.cardType === 'unknown' ? '' : update.cardType
    $('#cardtype').text(newType)



    /* Change form-group style when tappay field status change */
    /* ======================================================= */

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
    } else {
        setNumberFormGroupToNormal('.card-number-group')
    }

    if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date-group')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date-group')
    } else {
        setNumberFormGroupToNormal('.expiration-date-group')
    }

    if (update.status.ccv === 2) {
        setNumberFormGroupToError('.ccv-group')
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.ccv-group')
    } else {
        setNumberFormGroupToNormal('.ccv-group')
    }
})
$('#send_order_to_paypal').on('submit', function (event) {
    event.preventDefault()
    console.log(TPDirect.card)
    let address = document.getElementById("address").value
    let userName = document.getElementById("userName").value
    let userPhoneNumber = document.getElementById("userPhoneNumber").value
    console.log(userName)
    // 確認聯絡人姓名不為空
    if (userName == "") {
        alert("userName不可為空")
        return
    }
    // 確認電話格式是否正確
    let re = /^09[0-9]{8}$/
    if (!re.test(userPhoneNumber)) {
        alert("電話格式錯誤")
        return
    }
    let loadingWrapper = window.document.getElementById("loading-wrapper")
    loadingWrapper.style.display = "block"
    // fix keyboard issue in iOS device
    forceBlurIos()
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)
    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        loadingWrapper.style.display = "none"
        alert('can not get prime')
        return
    }
    // Get prime
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            loadingWrapper.style.display = "none"
            alert('get prime error ' + result.msg)
            return
        }
        console.log(result.card.prime)
        console.log(unpay_order_id_list)
        // alert('get prime 成功，prime: ' + result.card.prime)
        // send prime to server                
        let requestBody = {
            "prime": result.card.prime,
            "order": {
                "price": allPrice,
                "trip": unpay_order_id_list,
                "contact": {
                    "name": userName,
                    "address": address,
                    "phone": userPhoneNumber
                }
            }
        }
        fetch("/api/orders", {
            headers: { 'Content-Type': 'application/json' },
            method: "post",
            body: JSON.stringify(requestBody)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if ("error" in data) {
                    console.log(data)
                    loadingWrapper.style.display = "none"
                    alert(data["message"])
                    somethingFadeout(4, loadingWrapper)
                    loadingWrapper.style.display = "none"
                }
                else {
                    if (data["payment"]["status"] == 0) {
                        console.log(data.payment.bill_number)
                        somethingFadeout(0, 3, loadingWrapper)
                        // //頁面內容更新
                        location = location

                        // url="/thankyou?number="+data["data"]["number"]
                        // location.href=url                            
                    } else {
                        loadingWrapper.style.display = "none"
                        console.log(data)
                    }

                }
            })
    })
})

function setNumberFormGroupToError(selector) {
    $(selector).addClass('has-error')
    $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    $(selector).removeClass('has-error')
    $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
    $(selector).removeClass('has-error')
    $(selector).removeClass('has-success')
}

function forceBlurIos() {
    if (!isIos()) {
        return
    }
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input)
    input.focus()
    input.parentNode.removeChild(input)
}
function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
