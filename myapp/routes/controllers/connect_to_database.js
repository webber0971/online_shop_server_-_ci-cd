// connect to databases check if the email exists
function check_account(connection_pool, email) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            }
            else {
                sql = "select * from member where email = (?)"
                val = email
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }

                })
            }
        })
    })

}

//build a new account
function build_new_account(connection_pool, name, email, password) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            }
            else {
                sql = "insert into member(name,email,password) values (?)"
                val = [name, email, password]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get member table information with email and password
function get_member_info(connection_pool, email) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from member where email = (?)"
                val = email
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get member table information with member_id 
function get_member_info_by_member_id(connection_pool, member_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select member_id,name,chat_status,latest_message_time from member where member_id = (?)"
                val = member_id
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// check member_id exited
function check_member_id_exited(connection_pool, member_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select name from member where member_id = (?)"
                val = member_id
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

function get_all_member_chat_info(connection_pool) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select member_id,name,chat_status,latest_message_time,process_status from member"
                connection.query(sql, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// upload new product to products table
function upload_product(connection_pool, product_name, product_image_url, product_information) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "insert into products(product_name,image_url,information) values (?)"
                val = [product_name, product_image_url, product_information]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all products information where status == "上架"
function get_products_information_their_status_is_selling(connection_pool) {
    console.log("ekeeeeee")
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                console.log("pppppp")
                sql = "select * from products where status = '上架中' "
                connection.query(sql, (err, res) => {
                    connection.release()
                    if (err) {
                        console.log(err)
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

//upload new order_list to order_list table
function upload_order_list(connection_pool, member_id, product_id, quantity, bill_number) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "insert into order_list(member_id,product_id,quantity,bill_number) values (?)"
                bill_number = 0
                val = [member_id, product_id, quantity, bill_number]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// delete order_list by order_list_id
function delete_order_list_by_order_list_id(connection_pool, order_list_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "delete from order_list where order_list_id = (?)"
                bill_number = 0
                val = [order_list_id]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all order_list by member_id
function get_order_list_with_memeber_id(connection_pool, member_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from order_list where member_id = (?)"
                bill_number = 0
                val = [member_id]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        console.log("錯誤1")
                        reject("sql錯誤")
                    } else {
                        console.log("錯誤2")
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all order_list by member_id and bill_number=0(not pay)
function get_order_list_inner_join_products_with_memeber_id_and_bill_number(connection_pool, member_id, billnumber = "0") {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from order_list inner join products on order_list.product_id = products.product_id where order_list.member_id = (?) and order_list.bill_number = (?)"
                val = [member_id, billnumber]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        console.log("救命")
                        console.log(err)
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all order_list join prodicts by member_id
function get_info_order_list_inner_join_products_with_memeber_id(connection_pool, member_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from order_list inner join products on order_list.product_id = products.product_id where order_list.member_id = (?)"
                bill_number = 0
                val = [member_id]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}


function update_bill_number(connection_pool, order_list_id, bill_number) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update order_list set bill_number = (?) where order_list_id = (?)"
                val = [bill_number, order_list_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}



function update_bill_status(connection_pool, bill_number, bill_status) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update bill_list set bill_status = (?) where bill_number = (?)"
                val = [bill_status, bill_number]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// insert bill number in bill list
function insert_bill_list(connection_pool, bill_number, member_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "insert into bill_list(bill_number,member_id) values (?)"
                val = [bill_number, member_id]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

async function check_and_build_new_account(connection_pool, name, email, password) {
    let check_account1 = await check_account(connection_pool, email)
    if (check_account1.length != 0) {
        response.json({
            "error": true,
            "message": "email重複，帳號建立失敗"
        })
    } else {
        let build_account = await build_new_account(connection_pool, name, email, password)
        response.json({
            "message": build_account
        })
    }
}

function get_bill_list(connection_pool, member_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from order_list inner join bill_list on order_list.bill_number = bill_list.bill_number  inner join products on order_list.product_id = products.product_id where bill_list.member_id = (?)"
                bill_number = 0
                val = [member_id]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all bill
function get_all_bill_list(connection_pool) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from order_list inner join bill_list on order_list.bill_number = bill_list.bill_number  inner join products on order_list.product_id = products.product_id"
                connection.query(sql, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

function get_chat_message(connection_pool, member_id, get_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from chat_message where (send_id = (?) or send_id = (?)) and (get_id = (?) or get_id = (?)) order by message_id asc"
                val = [member_id, get_id, member_id, get_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        console.log(res)
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all message
function get_all_chat_message(connection_pool) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from chat_message order by message_id desc"
                connection.query(sql, (err, res) => {
                    connection.release()
                    if (err) {
                        console.log(err)
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}
// get all message by user_id
function get_all_chat_message_by_user_id(connection_pool, user_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select * from chat_message where send_id = (?) or get_id = (?)  order by message_id desc"
                val = [user_id, user_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        console.log(err)
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// 紀錄聊天內容，並在第一次聊天時 插入 status_list 紀錄狀態
function insert_chat_message(connection_pool, send_id, get_id, information, local_date) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "insert into chat_message(send_id,get_id,information,date) values (?)"
                val = [send_id, get_id, information, local_date]
                connection.query(sql, [val], (err, res) => {
                    if (err) {
                        connection.release()
                        reject("sql錯誤")
                    } else {
                        console.log("存入db")
                        message_id = String(res.insertId)
                        send_id = String(send_id)
                        get_id = String(get_id)
                        local_date = String(local_date)

                        sql = "update status_list set unread_message_id = (?),latest_time = (?) where send_id = (?) and get_id = (?)"
                        val = [message_id, local_date, send_id, get_id]
                        let status_1 = connection.query(sql, val, (err, res) => {
                            if (err) {
                                return err
                            } else {
                                if (res.affectedRows == 0) {
                                    console.log("eeooeoe")
                                    sql = "insert into status_list(send_id,get_id,unread_message_id,latest_time) values (?)"
                                    val = [send_id, get_id, message_id, local_date]
                                    connection.query(sql, [val], (err, res) => {
                                        if (err) {
                                            console.log(err)
                                            return err
                                        } else {
                                            return res
                                        }
                                    })
                                }
                                return res
                            }
                        })
                        sql = "update status_list set read_message_id = (?),latest_time = (?) where send_id = (?) and get_id = (?)"
                        val = [message_id, local_date, get_id, send_id]
                        let status_2 = connection.query(sql, val, (err, res) => {
                            if (err) {
                                return err
                            } else {
                                if (res.affectedRows == 0) {
                                    console.log("eeooeoe")
                                    sql = "insert into status_list(send_id,get_id,read_message_id,latest_time) values (?)"
                                    val = [get_id, send_id, message_id, local_date]
                                    connection.query(sql, [val], (err, res) => {
                                        if (err) {
                                            console.log(err)
                                            return err
                                        } else {
                                            return res
                                        }
                                    })
                                }
                                return res
                            }
                        })
                        connection.release()
                        resolve(res)
                    }
                })
            }
        })
    })
}

// insert new production information to db
function insert_new_product(connection_pool, image_url, product_name, product_price, product_status) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "insert into products(product_name,image_url,status,price) values (?)"
                val = [product_name, image_url, product_status, product_price]
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        console.log("存入db")
                        resolve(res)
                    }
                })
            }
        })
    })
}

function update_product_status(connection_pool, prodict_id, product_status) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update products set status = (?) where product_id = (?)"
                val = [product_status, prodict_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        console.log(err)
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}


function update_member_chat_status(connection_pool, send_id, member_chat_status) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update member set chat_status = (?) where member_id = (?)"
                val = [member_chat_status, send_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}


function update_member_process_status(connection_pool, client_id, process_status) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update member set process_status = (?) where member_id = (?)"
                val = [process_status, client_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

// update_status_list_process_status
function update_status_list_process_status(connection_pool, friend_id, user_id, process_status) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update status_list set process_status = (?) where get_id = (?) and send_id = (?)"
                val = [process_status, user_id, friend_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}

function user_get_all_firends_status(connection_pool, user_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "select send_id,get_id,read_message_id,unread_message_id,status_list.process_status,latest_time,name from status_list inner join member on status_list.send_id = member.member_id where status_list.get_id = (?) order by status_list.latest_time desc"
                val = user_id
                connection.query(sql, [val], (err, res) => {
                    connection.release()
                    if (err) {
                        console.log(err)
                        reject("sql錯誤")
                    } else {
                        console.log(res)
                        resolve(res)
                    }
                })
            }
        })
    })
}

function update_read_message_id_in_status_list(connection_pool, friend_id, user_id, unread_message_id) {
    return new Promise((resolve, reject) => {
        connection_pool.getConnection((err, connection) => {
            if (err) {
                console.log("連線失敗")
                reject("連線失敗")
            } else {
                sql = "update status_list set read_message_id = (?) where get_id = (?) and send_id = (?)"
                val = [unread_message_id, user_id, friend_id]
                connection.query(sql, val, (err, res) => {
                    connection.release()
                    if (err) {
                        reject("sql錯誤")
                    } else {
                        resolve(res)
                    }
                })
            }
        })
    })
}




module.exports.check_account = check_account
module.exports.build_new_account = build_new_account
module.exports.get_member_info = get_member_info
module.exports.upload_product = upload_product
module.exports.get_products_information_their_status_is_selling = get_products_information_their_status_is_selling
module.exports.upload_order_list = upload_order_list
module.exports.get_order_list_with_memeber_id = get_order_list_with_memeber_id
module.exports.check_and_build_new_account = check_and_build_new_account
module.exports.get_info_order_list_inner_join_products_with_memeber_id = get_info_order_list_inner_join_products_with_memeber_id
module.exports.get_order_list_inner_join_products_with_memeber_id_and_bill_number = get_order_list_inner_join_products_with_memeber_id_and_bill_number
module.exports.update_bill_number = update_bill_number
module.exports.insert_bill_list = insert_bill_list
module.exports.get_bill_list = get_bill_list
module.exports.get_chat_message = get_chat_message
module.exports.insert_chat_message = insert_chat_message
module.exports.insert_new_product = insert_new_product
module.exports.update_product_status = update_product_status
module.exports.get_all_bill_list = get_all_bill_list
module.exports.update_bill_status = update_bill_status
module.exports.get_all_chat_message = get_all_chat_message
module.exports.get_member_info_by_member_id = get_member_info_by_member_id
module.exports.get_all_member_chat_info = get_all_member_chat_info
module.exports.update_member_chat_status = update_member_chat_status
module.exports.update_member_process_status = update_member_process_status
module.exports.get_all_chat_message_by_user_id = get_all_chat_message_by_user_id
module.exports.update_status_list_process_status = update_status_list_process_status
module.exports.user_get_all_firends_status = user_get_all_firends_status
module.exports.update_read_message_id_in_status_list = update_read_message_id_in_status_list
module.exports.check_member_id_exited = check_member_id_exited
module.exports.delete_order_list_by_order_list_id = delete_order_list_by_order_list_id