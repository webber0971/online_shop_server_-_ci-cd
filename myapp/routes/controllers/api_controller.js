const { request, response } = require('express')

module.exports = (router, upload, connect_to_database, connection_pool, appCache, jwt, jwt_secretkey, url, querystring) => {
  /////// member api
  // build a new account
  router.post("/api/member", upload.array(), (request, response) => {
    let name = request.body["name"]
    let email = request.body["email"]
    let password = request.body["password"]

    check_and_build_new_account(connection_pool, name, email, password)

    async function check_and_build_new_account(connection_pool, name, email, password) {
      let check_account = await connect_to_database.check_account(connection_pool, email)
      if (check_account.length != 0) {
        response.json({
          "error": true,
          "message": "email重複，帳號建立失敗"
        })
      } else {
        let build_account = await connect_to_database.build_new_account(connection_pool, name, email, password)
        response.json({
          "message": build_account
        })
      }
    }
  })
  // login
  router.put("/api/member", upload.array(), (request, response) => {
    let email = request.body["email"]
    let password = request.body["password"]
    login(connection_pool, email, password)
    //use email to get member info from table and check password
    async function login(connection_pool, email) {
      let get_member_info = await connect_to_database.get_member_info(connection_pool, email)
      if (get_member_info.length == 0) {
        response.json({
          "message": "login fail"
        })
      } else {
        if (get_member_info[0].password == password) {
          const payload = {
            email: get_member_info[0].email,
            member_id: get_member_info[0].member_id,
            name: get_member_info[0].name
          }
          const token = jwt.sign(payload, jwt_secretkey, { expiresIn: "1d" })
          response
            .cookie("access_token", token)
            .json({
              "status": "ok",
              data: {
                data: { token: token }
              }
            })
        } else {
          response.json({
            "message": "password error"
          })
        }
      }
    }
  })


  // //////////////////////
  // login with google
  const googleRouter = require('../controllers/google_auth');
  router.use('/auth/google', googleRouter);
  // login with fb
  const facebookRouter = require('../controllers/facebook_auth');
  router.use('/auth/facebook', facebookRouter);



  // use access token to get member information
  router.get("/api/member", (request, response) => {
    let temp_token = request.cookies.access_token
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        response.statusCode = 200
        response.json(payload)
      }
    })
  })
  // logout and delete cookie in web
  router.delete("/api/member", (request, response) => {
    // request.logout()
    response
      .cookie("access_token", { expires: Date.now() }) // 間到期時間設為現在
      .json({
        "message": "登出成功"
      })
  })


  /////// products api
  // get products_information from table products where status = 上架中
  router.get("/api/selling_products_info", (request, response) => {
    console.log("kkekeekek")
    if (appCache.has("selling_products_info")) {
      response.json({ "info": appCache.get("selling_products_info") })
    } else {
      get_products_information_their_status_is_selling_1(connect_to_database, request, response)
    }
    async function get_products_information_their_status_is_selling_1(connect_to_database, request, response) {
      let all_products_information = await connect_to_database.get_products_information_their_status_is_selling(connection_pool)
      console.log("取得商品訊息")
      appCache.set("selling_products_info", all_products_information)
      response.json({ "info": all_products_information })
    }
  })

  ////// bill_list api
  // get bill_list by member_id
  router.get("/api/bill_list", upload.array(), (request, response) => {
    let temp_token = request.cookies.access_token
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        let member_id = payload.member_id
        get_bill_list_by_memberId(connection_pool, member_id, response)

        async function get_bill_list_by_memberId(connection_pool, member_id, response) {
          let get_order_list = await connect_to_database.get_bill_list(connection_pool, member_id)
          let bill_number_array = []
          for (let i = 0; i < get_order_list.length; i++) {
            if (!bill_number_array.includes(get_order_list[i].bill_number)) {
              bill_number_array.push(get_order_list[i].bill_number)
            }
          }
          let myMap = new Map()
          for (let i = 0; i < bill_number_array.length; i++) {
            myMap.set(bill_number_array[i], [])
          }
          for (let i = 0; i < get_order_list.length; i++) {
            myMap.get(String(get_order_list[i].bill_number)).push(get_order_list[i])
          }
          let obj = Object.fromEntries(myMap)
          let jsonString = JSON.stringify(obj)
          response.statusCode = 200
          response.json(jsonString)
        }
      }
    })
  })


  /////// orders api
  // upload column bill_number in order_list table and insert a new raw in bill_list table
  router.post("/api/orders", upload.array(), (request, response) => {
    let prime = request.body.prime
    let temp_token = request.cookies.access_token
    let member_email = ""
    let member_id = ""
    let member_name = ""
    let amount = request.body.order.price
    let order_list = request.body.order.trip
    let address = request.body.order.contact.address
    let member_phone = request.body.order.contact.phone
    let order_list_string = ""
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        member_id = payload.member_id
        member_name = payload.name
        member_email = payload.email
      }
    })
    for (let i = 0; i < order_list.length; i++) {
      order_list_string = order_list_string + " " + order_list[i]
    }
    let url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    let headers = {
      'Content-Type': 'application/json',
      'x-api-key': 'partner_GhEedd0oFO42dBxPBp7qWJzRM6Qb6V4h5WPnKkDw0PbYRlTofSamRqEq'
    }
    let post_data = {
      "prime": prime,
      "partner_key": "partner_GhEedd0oFO42dBxPBp7qWJzRM6Qb6V4h5WPnKkDw0PbYRlTofSamRqEq",
      "merchant_id": "webber0971_ESUN",
      "amount": amount,
      "currency": "TWD",
      "details": order_list_string,
      "cardholder": {
        "phone_number": member_phone,
        "name": member_name,
        "email": member_email
      },
      "remember": false
    }


    update_bill_number_flow(connection_pool, order_list, response)

    async function update_bill_number_flow(connection_pool, order_list, response) {
      let ans = await fetch(url, { method: "post", headers: headers, body: JSON.stringify(post_data) })
        .then((res) => res.json())
        .then((data) => {
          return data
        }).catch((err) => {
          return err
        })
      if (ans.status == 0) {
        let bill_number = ans.rec_trade_id
        let check_account = await connect_to_database.insert_bill_list(connection_pool, bill_number, member_id)
        for (let i = 0; i < order_list.length; i++) {
          //更新訂單狀態
          let check_account = await connect_to_database.update_bill_number(connection_pool, order_list[i], bill_number)
        }
        response.statusCode = 200
        response.json({ "msg": "success", "payment": { "status": 0, "bill_number": bill_number } })
      } else {
        response.statusCode = 500
        response.json({ "error": true, "message": ans })
      }
    }
  })
  
  // delete order_list by order_list_id
  router.delete("/api/orders",upload.array(),(request,response)=>{
    let temp_token = request.cookies.access_token
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        let member_id = payload.member_id
        let order_list_id = request.body["order_list_id"]
        delete_order_list_by_order_list_id(connection_pool,order_list_id, response)
        async function delete_order_list_by_order_list_id(connection_pool, order_list_id, response) {
          let delete_order_list = await connect_to_database.delete_order_list_by_order_list_id(connection_pool,order_list_id)
          response.statusCode = 200
          response.json({ message: delete_order_list })
        }
      }
    })

  })



  ////// cart api
  // 加入購物車
  router.post("/api/cart", upload.array(), (request, response) => {
    let temp_token = request.cookies.access_token
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        let member_id = payload.member_id
        let product_id = request.body["product_id"]
        let quantity = request.body["quantity"]
        let bill_number = 0
        add_order_list_into_cart(connection_pool, member_id, product_id, quantity, bill_number, response)
        async function add_order_list_into_cart(connection_pool, member_id, product_id, quantity, bill_number, response) {
          let upload_order_list = await connect_to_database.upload_order_list(connection_pool, member_id, product_id, quantity, bill_number)
          response.statusCode = 200
          response.json({ message: upload_order_list })
        }
      }
    })
  })
  // get all order_list by member_id and bill_number
  router.get("/api/cart", upload.array(), (request, response) => {
    let rawurl = request.url
    let parserUrl = url.parse(rawurl)
    let parsedQs = querystring.parse(parserUrl.query)
    let bill_number = 0
    if ("billNumber" in parsedQs) {
      bill_number = parsedQs.billNumber
    }
    let temp_token = request.cookies.access_token
    let res=jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        let member_id = payload.member_id
        get_all_order_in_cart(connection_pool, member_id, bill_number, response)

        async function get_all_order_in_cart(connection_pool, member_id, bill_number, response) {
          let get_order_list = await connect_to_database.get_order_list_inner_join_products_with_memeber_id_and_bill_number(connection_pool, member_id, bill_number)
          response.statusCode = 200
          response.json({ message: get_order_list })
        }
      }
    })
  })


  ////// chat api
  // client 端取得聊天資料
  router.get("/api/client/chat_message", upload.array(), (request, response) => {
    let temp_token = request.cookies.access_token
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        let member_id = payload.member_id
        let get_id = 1 //admin
        client_get_chat_message(connection_pool, member_id, get_id)
        async function client_get_chat_message(connection_pool, member_id, get_id) {
          let get_chat_message = await connect_to_database.get_chat_message(connection_pool, member_id, get_id)
          response.statusCode = 200
          response.json({ message: get_chat_message })
        }
      }
    })
  })
  // 記錄新的聊天訊息
  const moment = require("moment") // 將 javascript 時間改成 mysql datatime 格式
  router.post("/api/chat_message", upload.array(), (request, response) => {
    let temp_token = request.cookies.access_token
    jwt.verify(temp_token, jwt_secretkey, (err, payload) => {
      if (err) {
        response.json({
          error: true,
          "message": "token無效，解開jwt失敗"
        })
      } else {
        let local_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        console.log("時間 : ",local_date)
        console.log(local_date)
        let send_id = payload.member_id
        let get_id = request.body["get_id"] //admin = 1
        let information = request.body["information"]
        client_insert_chat_message(connection_pool, send_id, get_id, information,local_date)
        async function client_insert_chat_message(connection_pool, send_id, get_id, information,local_date) {
          let insert_chat_message = await connect_to_database.insert_chat_message(connection_pool, send_id, get_id, information,local_date)
          if(get_id == 1 ){
            let member_chat_status = "未讀"
            let update_member_chat_status = await connect_to_database.update_member_chat_status(connection_pool, send_id,member_chat_status)
          }
          console.log(insert_chat_message.insertId)
          console.log("333_insert_chat_message")
          response.statusCode = 200
          response.json({ message: insert_chat_message })
        }
      }
    })
  })


  router.put("/api/products", upload.array(), (req, res) => {
    let product_id = req.body["update_product_id"]
    let product_status = req.body["update_product_status"]
    console.log(appCache)
    console.log("------------------========================")
    update_product_status(connection_pool, product_id, product_status)
    async function update_product_status(connection_pool, product_id, product_status) {
      let update_product_status = await connect_to_database.update_product_status(connection_pool, product_id, product_status)
      let all_products_information = await connect_to_database.get_products_information_their_status_is_selling(connection_pool)
      console.log("取得商品訊息")
      appCache.set("selling_products_info", all_products_information)
      res.json({ message: update_product_status })
    }
  })

  router.post("/api/products", upload.array(), (req, res) => {
    let image_url = req.body["image_url"]
    let product_name = req.body["product_name"]
    let product_price = req.body["product_price"]
    let product_status = req.body["product_status"]
    console.log(image_url)
    insert_new_product(connection_pool, image_url, product_name, product_price, product_status)
    async function insert_new_product(connection_pool, image_url, product_name, product_price, product_status) {
      let insert_new_product = await connect_to_database.insert_new_product(connection_pool, image_url, product_name, product_price, product_status)
      let all_products_information = await connect_to_database.get_products_information_their_status_is_selling(connection_pool)
      console.log("取得商品訊息")
      appCache.set("selling_products_info", all_products_information)
      res.json({ message: insert_new_product })
    }
  })

}