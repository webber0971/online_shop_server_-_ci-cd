const express = require('express');
var mysql = require('mysql');
const jwt = require("jsonwebtoken")
const passport = require("passport")
const Googlestrategy = require("passport-google-oauth").OAuth2Strategy
const session = require("express-session")
const cookieParser = require("cookie-parser");
const connect_to_database = require("./connect_to_database");
const jwt_secretkey = "secret123"
let connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE
});
const router = express.Router();

router.use(cookieParser())

router.use(session({
  secret: "keyboard",
  resave: false,
  saveUninitialized: true
}))

passport.use(new Googlestrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // callbackURL:"http://localhost:5000/auth/google/callback"  //本機開發用
  callbackURL: "http://test8812.foodpass.club/auth/google/callback" //上線要改成這段
},
  function (accessToken, refreshToken, profile, done) {
    console.log(profile) //database code here
    return done(null, profile) //(err,user) 
  }
))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})
router.use(passport.initialize())
router.use(passport.session())
router.get("/", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }))


router.get("/success", (req, res) => {
  console.log(req.user)
  res.json({
    status: "success",
    message: "login success",
    user: req.user
  })
})

router.get("/callback",
  passport.authenticate("google", {
    // successRedirect:"http://localhost:5000/entrance",
    failureRedirect: "/login"
  }),
  function (request, response) {
    let name = request.user.displayName
    let email = request.user.id
    let password = "google_login"
    check_and_build_new_account(connection_pool, name, email, password)

    async function check_and_build_new_account(connection_pool, name, email, password) {
      let check_account = await connect_to_database.check_account(connection_pool, email)
      if (check_account.length != 0) {
        login(connection_pool, email, password)
      } else {
        let build_account = await connect_to_database.build_new_account(connection_pool, name, email, password)
        login(connection_pool, email, password)
      }
    }
    //use email to get member info from table and check password
    async function login(connection_pool, email, password) {
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
            .redirect("/entrance")
        } else {
          response.json({
            "message": "password error"
          })
        }
      }
    }
  }
)


module.exports = router;