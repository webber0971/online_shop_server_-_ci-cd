console.log("heeee")
var mysql = require('mysql');
require("dotenv").config()


var connection_pool = mysql.createPool({
    connectionLimit:10,
    host     : process.env.RDS_HOST,
    user     : process.env.RDS_USER,
    password : process.env.RDS_PASSWORD,
    database : process.env.RDS_DATABASE
});

// 取得連線池的連線
connection_pool.getConnection((err,connection)=>{
    if(err){
        // 取得可用連線出錯
        console.log("連線失敗04")
    }else{
        // 成功取得可用連線
        // 使用取得的連線
        sql="create table `products`(`product_id` int auto_increment primary key comment '商品ID',`product_name` varchar(255),`image_url` varchar(255),`information` varchar(255))"
        connection.query(sql,(err,res)=>{
            // 使用連線查詢完資料
            console.log(err)
            console.log(res)
            console.log("table products 建立完成")
            // 釋放連線
            connection.release()
            // 不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用

        })
    }
})



// connection_pool.end();