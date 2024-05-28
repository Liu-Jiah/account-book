// 导入 express
const express = require('express');
// 导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
// 导入检测登录中间件
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

// 创建路由对象
const router = express.Router();

router.get('/', checkLoginMiddleware, (req, res) => {
  res.redirect('/account')
})

/* 记账本的列表 */
router.get('/account', checkLoginMiddleware, (req, res) => {
  // const accounts = db.get('accounts').value()
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.status(500).send('读取失败')
      return;
    }
    res.render('list', { accounts: data, moment})
  })
});

// 添加记录
router.get('/account/create', checkLoginMiddleware, (req, res) => {
  res.render('create')
});

// 新增记录
router.post('/account', checkLoginMiddleware, (req, res) => {
  AccountModel.create({
    ...req.body,
    // 修改 time 的值
    time: moment(req.body.time).toDate()
  },(err, data) => {
    if(err){
      res.status(500).send('插入失败');
      return;
    }
    res.render('success', { msg: '添加成功哦', url: '/account' })
  })
  // .then((data) => {
  //   res.render('success', { msg: '添加成功哦', url: '/account' })
  //   mongoose.disconnect();
  // })
  // 成功提醒
});

// 删除记录
router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  // 获取 params 的 id 参数
  let id = req.params.id;
  // 删除
  AccountModel.deleteOne({_id: id}, (err, data) => {
    if(err){
      res.status(500).send('删除失败')
    }
    // 提醒
    res.render('success', { msg: '删除成功', url: '/account' })
  })
})

module.exports = router;