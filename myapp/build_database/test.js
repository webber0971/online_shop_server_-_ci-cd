var mysql = require('mysql');
const connect_to_database = require("../routes/controllers/connect_to_database")
require("dotenv").config()

var connection_pool = mysql.createPool({
    connectionLimit:10,
    host     : process.env.RDS_HOST,
    user     : process.env.RDS_USER,
    password : process.env.RDS_PASSWORD,
    database : process.env.RDS_DATABASE
});
// check_account_1(connect_to_database)
// get_products_information_their_status_is_selling_1(connect_to_database)
upload_product_1(connect_to_database)


// 上傳新品
async function upload_product_1(connect_to_database){
    let name_temp="青花椒烤雞"
    let image_url = "https://d3ce9biuqz84nv.cloudfront.net/quick-and-easy-meal-planner-128684-2.jpg"
    let info = ""
    let check_account = await connect_to_database.upload_product(connection_pool,name_temp,image_url,info)
    console.log(check_account)
}

// 取得所有產品資料，其狀態為上架
async function get_products_information_their_status_is_selling_1(connect_to_database){
    let all_products_information = await connect_to_database.get_products_information_their_status_is_selling(connection_pool)
    // console.log(all_products_information.length)
    

    // result_json(all_products_information,all_products_information.length)

    function result_json(object,lenght){
        // object=object[1]
        console.log(lenght)
        let res=[]
        for(let i =0;i<lenght;i++){
            // console.log(object[i])
            // console.log(object[i]);
            res[i]=object[i]
        }
        console.log(res)
    } 

}


// // 取得連線池的連線
// connection_pool.getConnection((err,connection)=>{
//     if(err){
//         // 取得可用連線出錯
//         console.log("連線失敗")
//     }else{
//         // 成功取得可用連線
//         // 使用取得的連線
//         // sql="show databases"
//         sql = "select * from member where name = (?)"
//         val = "ttt"
//         connection.query(sql,[val],(err,res)=>{
//             // 使用連線查詢完資料
//             console.log(err)
//             console.log(res)
//             // 釋放連線
//             connection.release()
//             // 不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用

//         })
//     }
// })



// connection.end();