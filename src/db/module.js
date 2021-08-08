const DB = require('./index.js');
const { sql } = require('../../config');
const { tableName } = sql;

const structure = {
    name: {
        type: 'string',
        length: 100,
        comment: '仓库名'
    },
    description: {
        type: 'string',
        length: 255,
        comment: '仓库描述'
    },
    tag: {
        type: 'json',
        comment: '仓库标签，仅限Gitlab'
    },
    namespace: {
        type: 'json',
        comment: '命名空间（群组），仅限Gitlab'
    },
    gitlab_id: {
        type: 'integer',
        length: 50,
        comment: 'Gitlab仓库id'
    },
    github_id: {
        type: 'integer',
        length: 50,
        comment: 'Github仓库id'
    },
    default_branch: {
        type: 'string',
        length: 50,
        comment: '仓库默认分支'
    },
    gitlab_http_url: {
        type: 'string',
        length: 255,
        comment: 'Gitlab仓库http url'
    },
    gitlab_ssh_url: {
        type: 'string',
        length: 255,
        comment: 'Gitlab仓库ssh url'
    },
    github_http_url: {
        type: 'string',
        length: 255,
        comment: 'Github仓库http url'
    },
    github_ssh_url: {
        type: 'string',
        length: 255,
        comment: 'Github仓库ssh url'
    },
    status: {
        type: 'integer',
        length: 10,
        comment: '迁移状态'
    },
};

const createTable = () => {
    return new Promise(async (resolve, reject) => {
        if(!tableName) return reject('请填写表名');
        console.log('正在检查数据库');
        let has = await DB.schema.hasTable(tableName);
        if (!has) {
            console.log('正在新建数据表');
            await DB.schema.createTable(tableName, (table)=>{
                table.increments('id').primary().comment('id');
                Object.keys(structure).forEach(key=>{
                    const { type, length, comment } = structure[key];
                    table[type](key, length ? length : '').comment(comment);
                })
            });
        }
        console.log('数据库正常');
        resolve();
    });
};

module.exports = createTable;
