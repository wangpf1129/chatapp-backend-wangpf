// 引用发送邮件插件
const nodeMailer = require('nodemailer')
// 引入证书文件
const credential = require('../config/credentials')

// 创建传输方式
const transporter = nodeMailer.createTransport({
  service: 'qq',
  auth: {
    user: credential.qq.user,
    pass: credential.qq.pass
  }
})

// 注册发送邮件给用户
exports.emailSignUp = function (email, res) {
  // 发送信息的内容
  let options = {
    from: '1204981117@qq.com',
    to: email,
    subject: '感谢您在yiKe注册',
    html: `<span>yiKe欢迎您的加入！</span>
           <a href="https://github.com/wwwpppfffzzz">点击进入我的主页</a>`
  }

  // 发送邮件
  transporter.sendMail(options, function (err, msg) {
    if (err) {
      res.send(err)
      // console.log(err)
    } else {
      res.send('邮箱发送成功!')
      // console.log('邮箱发送成功')
    }
  })
}