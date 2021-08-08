#  Gitlab迁移Github解决方案
这是一套Gitlab仓库批量迁移到Github的解决方案。
功能十分单一，基本实现原理就是将Gitlab项目批量Clone到本地，再修改远程仓库地址，重新Push，保留所有分支，**但不保留提交记录！！**

# 使用方法
这里提供简单的使用方法，更多使用方法直接看源码，源码写得十分简单，基本可以看懂。
我会在本文最后提供迁移方案Flow图。

**如果有什么bug或者想要优化源码的，请添加我微信：rafong_**

## 前序
开始前，我解释下项目的目录作用，我喜欢用目录树，直接写无序列
- delopy  部署和执行脚本
- app.js  执行入口
- config  配置文件
- repos  仓库临时存放位置
- src    源码
    - api API接口
    - db  数据库
    - service 业务函数
    - utils 工具类



## 准备
- Mysql，迁移过程中，使用数据库作为记录状态
- Gitlab SSH key、Token
- Github SSH key、Token
- 足够大的存储空间
- 可用的Proxy，使用Sock5协议，Push仓库到Github使用

仓库的Clone和Push需要使用Git协议，使用HTTP/HTTPS协议失败率很高，所以需要配置SSH Key；
Proxy的协议也需要使用Sock5，HTTP/HTTPS协议失败率同样很高。不信算了。


## 开始
准备好Mysql和Node环境，并且创建一个数据库；接着填写config中的配置文件，在终端执行代码以下代码：
``` zsh
$ yarn add package.json

$ node app.js
```
就这么简单，过程执行错误会自动停止，继续执行就好了，每个仓库完成后都会记录状态的，不需要担心。


# 实现方法

![alt Flow图](https://statics.meiway.cc/gitlab2github/flow.jpg)
