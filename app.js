//1. 引入包
const express = require('express');
// 2. 创建服务器应用程序  也就是原来的 http.createServer
const app = express();
// 引入 token
const jwt = require('./dao/jwt')
// 引入 body插件
const bodyParser = require('body-parser')
// 引入 router.js 模块
const router = require('./router/index')

//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "origin,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Credentials",true)
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
      // 这段仅仅是为了方便返回json
  res.header("Content-Type", "application/json;charset=utf-8");
  if(req.method === 'OPTIONS'){
    // 让 options请求快速返回
    res.sendStatus(200)
  }else{
    next()
  }
});


// 以get的请求方式来 请求 /
app.get('/', (req, res) => {
  res.send('后端。。。');
})

// 配置 body-parser
// 只要加入下面俩行代码，则在req 请求对象上会多出来一个属性: body
// 也就是说你就可以直接通过 req.body 来获取表单 POST 请求体数据了
// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))


// token 判断
app.use(function (req,res,next) {
  if(typeof (req.body.token) != 'undefined'){
    // 处理token
    let token = req.body.token
    let tokenMatch = jwt.verifyToken(token)
    if(tokenMatch === 1){
      // 通过验证
      next()
    }else{
      // 验证不通过
      res.send({status:300})
    }
  }else {
    next()
  }
})


// 挂载路由
app.use(router)



// 404页面处理
app.use(function (req, res, next) {
  let err = new Error('Not Found.. 404!')
  err.status = 404;
  next(err)
})

// 错误处理
app.use(function (err, req, res, next) {
  res.status(500 || err.status).send(err.message)
})


// 相当于 之前的 server.linten
app.listen(3000, () => console.log(`服务器已启动 端口：http://localhost:3000/`))