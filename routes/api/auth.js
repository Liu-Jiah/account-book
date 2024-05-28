const express = require('express');
const UserModel = require('../../models/UserModel')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/config')

const router = express.Router();


router.post('/login', (req, res) => {
    const { username, password } = req.body

    UserModel.findOne({ username: username, password: md5(password) }, (err, data) => {
        if(err){
            res.json({
                code: '2001',
                msg: '数据库读取失败',
                data: null
            })
            return;
        }

        if(!data){
            return res.json({
                code: '2002',
                msg: '用户名或密码错误',
                data: null
            })
        }
        const token = jwt.sign({
            username:data.username,
            _id : data._id
        }, secret, {
            expiresIn: 60 * 60 *24 * 7
        })

        res.json({
            code: '0000',
            msg: '登陆成功',
            data: token
        })
    })
})

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'})
    })
})

module.exports = router