const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const filePath = process.env.FILE_PATH || './data/donation.json';
if (!fs.existsSync(filePath)) {
  // 确保目录存在
  const dirPath = path.dirname(filePath);
  fs.mkdirSync(dirPath, { recursive: true });
  // 目录已创建，写入文件
  fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
}

router.post('/', function (req, res) {
  try {
    const { name, pay, amount, message = "" } = req.body;
    if (!name || !pay || !amount) {
      res.status(400).send({
        code: 400,
        message: '缺少必要字段'
      });
      return;
    }
    if (typeof name !== 'string' || name.length > 100) {
      res.status(400).send({
        code: 400,
        message: '昵称非法'
      });
      return;
    }
    if (pay !== 'wechat' && pay !== 'alipay') {
      res.status(400).send({
        code: 400,
        message: '支付类型非法'
      });
      return;
    }
    if (typeof amount !== 'number' || amount < 0.01 || amount > 9999999) {
      res.status(400).send({
        code: 400,
        message: '支付金额非法'
      });
      return;
    }
    if (typeof message !== 'string' || message.length > 500) {
      res.status(400).send({
        code: 400,
        message: '留言内容非法'
      });
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.push({ ...req.body, createdAt: Date.now() });
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
    res.send({
      code: 200,
      message: 'OK'
    });
  } catch (e) {
    console.error('save donation error.', e);
    res.status(500).send({
      code: 500,
      message: e.message || 'Internal Server Error'
    });
  }
});

router.get('/', function (req, res) {
  try {
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const data = sortJsonArray(rawData, req.query?.sortField || 'createdAt', req.query?.sortType || 'desc');
    res.send({ code: 200, data });
  } catch (e) {
    console.error('get donation error.', e);
    res.status(500).send({
      code: 500,
      message: e.message || 'Internal Server Error'
    });
  }
});

module.exports = router;


/**
 * 根据指定字段和排序方式对 JSON 数组进行排序
 * @param {Array} jsonArray - 要排序的 JSON 数组
 * @param {string} field - 排序的字段名
 * @param {string} order - 排序方式，可选 "asc"（升序）或 "desc"（降序）
 * @returns {Array} - 排序后的数组
 */
function sortJsonArray(jsonArray, field, order = "asc") {
  if (!Array.isArray(jsonArray)) {
    throw new Error("输入的数据必须是数组");
  }

  return jsonArray.sort((a, b) => {
    if (a[field] === undefined || b[field] === undefined) {
      throw new Error(`字段 [${field}] 不存在`);
    }

    const valueA = a[field];
    const valueB = b[field];

    if (order === "asc") {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else if (order === "desc") {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    } else {
      throw new Error('排序方式必须是 "asc" 或 "desc"');
    }
  });
}