/**
 * 
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
module.exports = (success, error) => {
    // 判断 error，为其设置一个默认值
    if(typeof error !== 'function'){
        error = () => {
            console.log('连接失败');
        }
    }
    // 1. 安装 mongoose
    // 2. 导入 Mongoose
    // const { default: mongoose } = require("mongoose")
    const mongoose = require("mongoose")

    // mongoose.set('strictQuery', true)
    // 导入 配置文件
    const {DBHOST, DBPORT, DBNAME} = require('../config/config');

    // 3. 连接 mongodb
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    // 4. 设置回调
    // 设置连接成功的回调函数
    mongoose.connection.once('open', () => {
        success();
    })

    // 设置连接错误的回调函数
    mongoose.connection.on('error', () => {
        error();
    })
    // 设置连接关闭的回调函数
    mongoose.connection.on('close', () => {
        console.log('连接关闭');
    })
}