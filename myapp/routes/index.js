var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require("dotenv").config()  //導入 dotenv 可讀取.env 檔 
const { expressjwt: expressJwt } = require('express-jwt')//导入 express-jwt 包 // nodejs jwt -- https://cloud.tencent.com/developer/article/1540741  // nodejs jsonwebtoken -- https://hackmd.io/@Aquamay/Sy9WtWDQq
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser") // 使用cookie-parser取得與解析request
const nodecache = require('node-cache')  // 使用 node-cache isomorphic-fetch 加速存取，降低訪問rds頻率
const connect_to_database = require("./controllers/connect_to_database")
const { response, request } = require('express')
const multer = require("multer");
const url = require("url")
const querystring = require("querystring");
const { copyFileSync } = require('fs');


// 全域常數
const jwt_secretkey = process.env.JWT_SECURITYKEY
const appCache = new nodecache();  // const appCache = new nodecache({ stdTTL : 3599}); stdTTL 為快取存在時間，單位為秒
let upload = multer() //安裝 multer 解析 mutlipart bodies , 數據安裝在 body 中可以用 body-parser 包及 multer包
const connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE
});

console.log(process.env.RDS_HOST)

console.log("連接上資料庫.")

router.use(cookieParser())
router.use(expressJwt({
  secret: jwt_secretkey,
  algorithms: ['HS256'],
  //用 getToken 屬性，設定從 cookie 中取得 要比對的 access_token
  getToken: (request) => {
    if ("access_token" in request.cookies) {
      return request.cookies["access_token"]
    } else {
      return null
    }
  }
}).unless({ path: ["/entrance", "/users/api/requestUploadToS3", "/paypal", "/api/member", "/", "/test/cookie", "/api/selling_products_info", "/auth/google", "/auth/google/callback", "/success", "/auth/facebook", "/cart"] }))
// .unless({用正则指定不需要访问权限的路径}) 

const html_controller = require("./controllers/html_controller")
const api_controller = require("./controllers/api_controller")

html_controller(router)
api_controller(router, upload, connect_to_database, connection_pool, appCache, jwt, jwt_secretkey, url, querystring)






module.exports = router;
