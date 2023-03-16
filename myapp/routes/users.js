let express = require('express');
let router = express.Router();
let mysql = require('mysql');
const multer = require("multer");
const nodecache = require('node-cache')
let upload = multer()
const connect_to_database = require("./controllers/connect_to_database")
const url = require("url")
const querystring = require("querystring");
// const e = require('express');

const redis = require('ioredis');
const client = redis.createClient({
  //   url: "redis://127.0.0.1:6379"
      // url:redisUrl
      host:"redis1"   //這好的
});


// 測試 redis 是否可用
client.set("test", "kkek", (error, reply) => {
  if (error) console.log(error,"存入失敗")
  else console.log(reply,"存入成功")
  })

console.log(client.get("test",(error,reply)=>{
  if(error){
      console.log("00==00",error)
  }else{
      console.log("連接測試成功，用key 為 test 取得資料...")
      console.log(reply)
  }
}))



// const jwt_secretkey = process.env.JWT_SECURITYKEY
// const appCache = new nodecache();  // const appCache = new nodecache({ stdTTL : 3599}); stdTTL 為快取存在時間，單位為秒
const connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users_page', { layout: false });
});
router.get("/kkk", (req, res) => {
  res.json({
    "帳號": "admit"
  })
})

router.get('/users_chat_page', function (req, res, next) {
  // res.send('respond with a resource');
  res.render('users_chat_page', { layout: false });
});

router.get("/rooms/new", upload.array(), (req, res) => {
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  let user_id = "5l"
  let friend_id = "777"
  let room_name = ""
  console.log(parsedQs)
  if ("user_id" in parsedQs) {
    user_id = parsedQs.user_id
  }
  if ("friend_id" in parsedQs) {
    friend_id = parsedQs.friend_id
  }
  if (parseInt(user_id) < parseInt(friend_id)) {
    room_name = user_id + "&" + friend_id
  } else {
    room_name = friend_id + "&" + user_id
  }
  console.log("room_name", room_name)
  console.log("user_id:", user_id)
  console.log("friend_id:", friend_id)
  res.redirect(`/users/video_room/${room_name}`)
})

router.get("/video_room/:room", (req, res) => {
  res.render("video_room", { layout: false, ROOM_ID: req.params.room })
})

router.get("/api/requestUploadToS3", (req, res) => {
  const AWS = require('aws-sdk/');
  const uuid = require("uuid")
  let key = uuid.v1()
  console.log(key)
  AWS.config.update({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_PASSWORD
  });
  const S3Bucket = new AWS.S3()
  getUrl(S3Bucket)
  async function getUrl(S3Bucket) {
    const s3Params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: 'image/*'
    }
    let imageUrl = "https://d3ce9biuqz84nv.cloudfront.net/" + String(key)
    const url = await S3Bucket.getSignedUrlPromise("putObject", s3Params)
    res.json({ url: url, imageUrl: imageUrl })
  }
})

router.put("/api/bill", upload.array(), (req, res) => {
  let bill_number = req.body["bill_number"]
  let bill_status = req.body["bill_status"]
  update_bill_status(connection_pool, bill_number, bill_status)
  async function update_bill_status(connection_pool, bill_number, bill_status) {
    let update_product_status = await connect_to_database.update_bill_status(connection_pool, bill_number, bill_status)
    res.json({ message: update_product_status })
  }
})

router.get("/api/unfinished_bill", (req, res) => {
  get_all_bill_list_(connection_pool, res)
  async function get_all_bill_list_(connection_pool, res) {
    let get_order_list = await connect_to_database.get_all_bill_list(connection_pool)
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
    res.statusCode = 200
    console.log(jsonString)
    res.json(jsonString)
  }
})

router.get("/api/all_bill", (req, res) => {
  get_all_bill_for_chart(connection_pool, res)
  async function get_all_bill_for_chart(connection_pool, res) {
    let get = await connect_to_database.get_all_bill_list(connection_pool)
    console.log(get.length)
    let product_name_array = []
    for (let i = 0; i < get.length; i++) {
      if (!product_name_array.includes(get[i].product_name)) {
        product_name_array.push(get[i].product_name)
      }
    }
    let myMap = new Map()
    for (let i = 0; i < product_name_array.length; i++) {
      myMap.set(product_name_array[i], 0)
    }
    for (let i = 0; i < get.length; i++) {
      let count = myMap.get(get[i].product_name) + get[i].quantity
      myMap.set(get[i].product_name, count)
    }
    let obj = Object.fromEntries(myMap)
    let jsonString = JSON.stringify(obj)
    res.statusCode = 200
    console.log(jsonString)
    res.json(jsonString)
  }
})
// 取得有和user在聊天的所有聊天對象
router.get("/api/client_send_message_array", upload.array(), (req, res) => {
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  let user_id = "5l"
  console.log(parsedQs)
  if ("user_id" in parsedQs) {
    user_id = parsedQs.user_id
  }
  get_client_send_message_array(connection_pool, user_id)
  async function get_client_send_message_array(connection_pool, user_id) {
    console.log("user_id = ", user_id)
    let get_client_send_message_array = await connect_to_database.get_all_chat_message_by_user_id(connection_pool, user_id)
    let client_chat_order_array = []
    for (i = 0; i < get_client_send_message_array.length; i++) {
      let client_id = 0
      let chat_status
      if (get_client_send_message_array[i].get_id == user_id) {
        client_id = get_client_send_message_array[i].send_id
      } else if (get_client_send_message_array[i].send_id == user_id) {
        client_id = get_client_send_message_array[i].get_id
      }
      if (!client_chat_order_array.includes(client_id)) {
        client_chat_order_array.push(client_id)
      }
    }
    console.log(client_chat_order_array)
    res.json({ message: client_chat_order_array })
  }
})

router.get("/api/users_get_chat_message", upload.array(), (req, res) => {
  console.log("---------")
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  console.log("====")
  let get_id = 0
  if ("client_id" in parsedQs) {
    get_id = parsedQs.client_id
  }
  console.log(get_id)
  users_get_one_client_chat_message1(connection_pool, get_id)
  async function users_get_one_client_chat_message1(connection_pool, get_id) {
    let member_id = 1
    console.log(get_id)
    let get_chat_message = await connect_to_database.get_chat_message(connection_pool, member_id, get_id)
    console.log(get_chat_message)
    res.json({ message: get_chat_message })
  }
})

router.get("/api/use_member_id_to_get_member_information_for_chat_room", (req, res) => {
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  let member_id = ""
  if ("member_id" in parsedQs) {
    member_id = parsedQs.member_id
  } else {
    res.json({ error: true })
  }
  users_get_member_chat_status_by_member_id(member_id)
  async function users_get_member_chat_status_by_member_id(member_id) {
    let get_chat_message_by_member_id = await connect_to_database.get_member_info_by_member_id(connection_pool, member_id)
    console.log(get_chat_message_by_member_id)
    res.json({ message: get_chat_message_by_member_id })
  }
})

router.get("/api/get_all_member_information_about_chat_status", (req, res) => {
  users_get_all_member_chat_status(connection_pool)
  async function users_get_all_member_chat_status(connection_pool) {
    let get_chat_message_by_member_id = await connect_to_database.get_all_member_chat_info(connection_pool)
    // console.log(get_chat_message_by_member_id)
    res.json({ message: get_chat_message_by_member_id })
  }
})

router.get("/api/get_all_friends_status_list_by_member_id", upload.array(), (req, res) => {
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  let user_id = ""
  if ("user_id" in parsedQs) {
    user_id = parsedQs.user_id
  } else {
    res.json({ error: true })
  }
  console.log("lelelelel", user_id)
  user_get_all_firends_status_1(connection_pool, user_id, res)
  async function user_get_all_firends_status_1(connection_pool, user_id, res) {
    let friends_status = await connect_to_database.user_get_all_firends_status(connection_pool, user_id)
    res.json({ message: friends_status })
  }
})

router.put("/api/update_member_chat_status", upload.array(), (req, res) => {
  let member_id = req.body["member_id"]
  let chat_status = "已讀"
  update_member_chat_status1(connection_pool, member_id, chat_status)
  async function update_member_chat_status1(connection_pool, member_id, chat_status) {
    let update_member_chat_status = await connect_to_database.update_member_chat_status(connection_pool, member_id, chat_status)
    console.log(update_member_chat_status)
    res.statusCode = 200
    res.json({ message: update_member_chat_status })
  }
})

router.get("/api/client/chat_message", (req, res) => {
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  let member_id = ""
  let user_id = ""
  if ("member_id" in parsedQs) {
    member_id = parsedQs.member_id
  } else {
    res.json({ error: true })
  }
  if ("user_id" in parsedQs) {
    user_id = parsedQs.user_id
  } else {
    res.json({ error: true })
  }
  get_id = user_id
  console.log(member_id)
  console.log(get_id)
  client_get_chat_message(connection_pool, member_id, get_id)
  async function client_get_chat_message(connection_pool, member_id, get_id) {
    let get_chat_message = await connect_to_database.get_chat_message(connection_pool, member_id, get_id)
    let member_chat_status = "已讀"
    console.log("使用的client_id : ", member_id)
    let update_member_chat_status = await connect_to_database.update_member_chat_status(connection_pool, member_id, member_chat_status)
    console.log(update_member_chat_status)
    res.statusCode = 200
    res.json({ message: get_chat_message })
  }
})

router.put("/api/update_member_process_status", upload.array(), (req, res) => {
  let client_id = req.body["client_id"]
  let user_id = req.body["user_id"]
  let process_status = req.body["process_status"]
  update_member_process_status1(connection_pool, client_id, user_id, process_status)
  async function update_member_process_status1(connection_pool, client_id, user_id, process_status) {
    let update_member_chat_status2 = await connect_to_database.update_status_list_process_status(connection_pool, client_id, user_id, process_status)
    res.json({ message: update_member_chat_status2 })
  }
})

router.put("/api/update_read_message_id_in_status_list", upload.array(), (req, res) => {
  let client_id = req.body["client_id"]
  let user_id = req.body["user_id"]
  let unread_message_id = req.body["unread_message_id"]
  update_read_message_id_in_status_list_1(connection_pool, client_id, user_id, unread_message_id)
  async function update_read_message_id_in_status_list_1(connection_pool, client_id, user_id, unread_message_id) {
    let update_read_message_id_in_status_list_2 = await connect_to_database.update_read_message_id_in_status_list(connection_pool, client_id, user_id, unread_message_id)
    res.json({ message: update_read_message_id_in_status_list_2 })
  }
})

router.get("/api/search_member_id_exit", (req, res) => {
  let rawurl = req.url
  let parserUrl = url.parse(rawurl)
  let parsedQs = querystring.parse(parserUrl.query)
  let member_id = ""
  if ("member_id" in parsedQs) {
    member_id = parsedQs.member_id
  } else {
    res.json({ error: true })
  }
  search_member_by_member_id(connection_pool, member_id)
  async function search_member_by_member_id(connection_pool, member_id) {
    let search_member_by_member_id_1 = await connect_to_database.check_member_id_exited(connection_pool, member_id)
    console.log(search_member_by_member_id_1)
    res.json({ message: search_member_by_member_id_1 })
  }
})


module.exports = router;
