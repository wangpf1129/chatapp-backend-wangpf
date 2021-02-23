const dbServer = require('./dbserver')

module.exports = function (io) {
  const users ={ } // socket注册用户
  const groups ={ } // socket注册群

  io.on('connection',(socket)=>{
    // console.log('socket.io连接成功')
    //用户登录注册
    socket.on('login',id=>{
      // console.log(socket.id)
      // 回复客户端
      socket.name = id
      // 获取socket注册后的id，并存起来
      users[id] = socket.id
      socket.emit('login',socket.id)
    })

    // 用户一对一消息发送
    socket.on('message',(msg,fromID,toID)=>{
      // console.log(msg)
      //修改好友最后通讯时间 
      dbServer.friendLastTime({uID:fromID,fID:toID})
      // 存储一对一消息
      dbServer.insertMessage(fromID,toID,msg.message,msg.messageTypes)
      // 发送给对方
     if(users[toID]){
       socket.to(users[toID]).emit('message',msg,fromID,0)
     }
     socket.emit('message',msg,toID,1)
    })

    //  用户离开
    socket.on('disconnecting',()=>{
      if(users.hasOwnProperty(socket.name)){
        delete users[socket.name]
        console.log(socket.id+'离开')
      }
    })

    // 加入群
    socket.on('group',data =>{
      // data 为 前端传过来的群ID
      // console.log('群'+data);
      socket.join(data)
    })

    // 接收群消息,发送
    socket.on('groupMessage',(msg,fromID,groupID,name,img)=>{
      // 存储一对一消息
      // console.log(msg,fromID,groupID,name,img);
      dbServer.insertGroupMessage(groupID,fromID,msg.message,msg.messageTypes)
      // 群内广播消息
      socket.to(groupID).emit('groupMessage',msg,groupID,name,img)

      // 回复客户端
      socket.name = groupID
      // 获取socket注册后的id，并存起来
      groups[groupID] = socket.id
      //  用户离开
      socket.on('disconnecting',()=>{
        if(groups.hasOwnProperty(socket.name)){
          delete groups[socket.name]
          console.log(socket.id+'离开')
        }
      })
    })
  })
}