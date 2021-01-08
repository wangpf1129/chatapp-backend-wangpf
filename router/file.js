// 引入附件上传 插件
const multer = require('multer')

const mkdir = require('../dao/mkdir')
// 控制文件存储
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // url 为前端保存哪个文件中， 比如： 好友头像图片保存在 好友文件里， 群头像就保存在群文件里
    // 因此我们需要动态去创建不存在的目录
    let url = req.body.url
    // 动态创建目录
    mkdir.mkdir(`../public/${url}`, (error) => {
      throw error
    })
    // 要是相对路径 ： `./public/${url}`
    cb(null, `./public/${url}`)
  },
  filename: function (req, file, cb) {
    // 正则匹配后缀名
    let type = file.originalname.replace(/.+\./, '.')
    let name = req.body.name
    cb(null, name + type)
  }
})

let upload = multer({storage: storage})

module.exports = upload

