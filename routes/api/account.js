const express = require('express');
const router = express.Router();
// 导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
// 导入 token 中间件
const checkLoginMiddleware = require('../../middlewares/checkTokenMiddleware');

/* 记账本的列表 */
router.get('/account', checkLoginMiddleware,(req, res) => {
    // const accounts = db.get('accounts').value()
    AccountModel.find().sort({ time: -1 }).exec((err, data) => {
      if (err) {
        return res.json({
          code: '1001',
          msg: '读取失败',
          data: null
        })
      }
      res.json({
        // 响应编码
        code: '0000',
        // 响应的信息
        msg: '读取成功',
        // 响应的数据
        data: data
      })
    })
});

// 新增记录
router.post('/account', checkLoginMiddleware, (req, res) => {
  AccountModel.create({
    ...req.body,
    // 修改 time 的值
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if (err) {
      res.json({
        code: '1001',
        msg: "添加失败",
        data: null
      })
      return;
    }
    res.json({
      code: '0000',
      msg: '创建成功',
      data: data
    })
  })
});

// 删除记录
router.delete('/account/:id', checkLoginMiddleware, (req, res) => {
  // 获取 params 的 id 参数
  let id = req.params.id;
  // 删除
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.json({
        code: '1001',
        msg: '删除失败',
        data: null
      })
      return;
    }
    // 提醒
    res.json({
      code: '0000',
      msg: '删除成功',
      data: {}
    })
  })
})

// 查询单个账单信息
router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  let { id } = req.params;
  AccountModel.findById(id, (err, data) => {
    if (err) {
      return res.json({
        code: '1001',
        msg: '查询失败',
        data: {}
      })
    }
    res.json({
      code: '0000',
      msg: '查询成功',
      data
    })
  })
})

// 更新单条账单信息
router.patch('/account/:id', checkLoginMiddleware, (req, res) => {
  let { id } = req.params;
  AccountModel.updateOne({ _id: id }, req.body, (err, data) => {
    if (err) {
      return res.json({
        code: '1005',
        msg: '更新失败',
        data: null
      })
    }
    res.json({
      code: '0000',
      msg: '更新成功',
      data: data
    })
  })
})

module.exports = router;
