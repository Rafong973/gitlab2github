// 请将所有配置补充完整，不需要的配置请直接删除
module.exports = {
    sql: {    // 数据库配置，默认使用mysql
        client: '',
        host: '', 
        user: '',
        password: '',
        database: '',
        port: 3306,
        tableName: ''  //表名
    },
    sock5: '',  // 代理配置，默认使用Sock5协议
    gitlab: {
        url: '', //gitlab服务域名,
        token: '', //token
        version: '/api/v4', //api版本
    },
    github: {
        url: 'https://api.github.com',
        orgs: '', //组织或者用户名，如果是个人仓库，请使用用户名
        userName: '', //用户名, 生成token的用户
        token: '', //
    },
};
