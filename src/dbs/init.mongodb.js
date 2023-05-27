'use strict'

const mongoose = require('mongoose')
const { db: { host, port, name }} = require('../configs/configs.mongodb')
// const connectString = `mongodb+srv://ecommerce:ecommerce@ecommerce.zugoutb.mongodb.net/shopDEV`;
const connectString = `mongodb://root:andrew@${host}:${port}/`;
// mongodb://root:andrew@localhost:27017/
// const connectString = `mongodb://localhost:27018/shopDEV`
const { countConnect } = require('../helpers/check.connect')
class Database {
    constructor(){
        this.connect()
    }
    // connect
    connect(){
        if (1 == 0){
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }
        mongoose.connect(connectString, {
            // nhóm kết nối là tập hợp các kết nối của CSDL có thể tái sử dụng được, được duy trì bởi database
            // Ví dụ khi ứng dụng yêu cầu kết nối với CSDL, thì mongoose sẽ kiểm tra nhóm kết nối xem có kết nối nào không? Thì có 50 kết nối. Nếu có thì sẽ sử dụng kết nối này cho một yêu cầu mới. Nếu không có kết nối nào thì mongoose sẽ tạo 1 kết nối và thêm vào trong nhóm
            // Vậy lợi ích khi chúng ta sử dụng poolsize => cải thiện hiệu suất, khả năng mở rộng của ứng, giảm chi phí và đóng kết nối CSDL
            // Nếu vượt quá kết nối Poolsize thì sao? Mongoose sẽ cho xếp hàng và đợi các kết nối xong thì mới cho vào sử dụng.
            maxPoolSize: 50
        }).then(_ => {
            console.log('connectString:', connectString),
            console.log('Connected Mongodb Success PRO', countConnect())
        })   
        .catch(err => console.log('Error Connect!', connectString));
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb

