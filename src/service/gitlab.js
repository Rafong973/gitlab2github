const DB = require('../db');
const { getProjectCount } = require('../api/gitlab');
const { gitlabRequest } = require('../api/common');
const { tableName } = require('../../config/index').sql;


// 获取所有项目
const getRepoList = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let { max, total, per } = await getProjectCount();
            let databaseCount = await DB(tableName).count('id');
            if(databaseCount[0] && (databaseCount[0]['count(`id`)'] >= total)) return resolve();
            for (let i = 0; i < 1; i++) {
                let res = await gitlabRequest(
                    `/projects?page=${i + 1}&per_page=${
                        i + 1 == max ? total % 20 : per
                    }`
                );
                // 插入数据库
                await insertDB(res.data);
            }
            resolve(true);
            console.log('Gitlab仓库记录完成');
        } catch (error) {
            console.log(error);
            reject();
            throw '执行失败，无法获取gitlab仓库信息';
        }
    });
};

// 插入数据库
const insertDB = async (list) => {
    return new Promise(async (resolve, reject) => {
        if (!list || !Array.isArray(list) || !list.length) return resolve();
        for (let index in list) {
            const item = list[index];
            const { name } = item;
            try {
                let queryResult = await DB(tableName).where({ name }).select('id');
                if (!queryResult || !queryResult.length) {
                    let value = filterModule(item);
                    await DB(tableName).insert(value);
                } else {
                    // console.log('已存在');
                }
                resolve();
            } catch (error) {
                console.log(error);
                reject(error);
            }
        }
    });
};

const getItemBranch = (item) => {
    return new Promise(async (resolve, reject) => {
        if (!item || !item.gitlab_id) return reject(false);
        let { gitlab_id } = item;
        let res = await gitlabRequest(`/projects/${gitlab_id}/repository/branches`);
        if (res && res.data) {
            let insertResult = await table
                .where({ gitlab_id })
                .update({ gitlabBranch: JSON.stringify(res.data || []) });
            if (!insertResult) return reject();
        } else {
            reject(false);
        }
        resolve(true);
    });
};

const updateBranch = () => {
    return new Promise(async (resolve, reject) => {
        let list = await DB(tableName).whereNotNull('id');
        if (list && list.length) {
            for (let index in list) {
                let item = list[index];
                await getItemBranch(item);
            }
        }
        resolve();
        console.log('导入分支成功');
        process.exit();
    });
};

const filterModule = (item) => {
    if (!item || typeof item != 'object') return;

    let {
        description,
        tag_list,
        namespace,
        default_branch,
        name,
        http_url_to_repo,
        id,
        ssh_url_to_repo,
        github_id,
    } = item;
    tag_list = JSON.stringify(tag_list);
    namespace = JSON.stringify(namespace);
    return {
        name,
        description,
        tag: tag_list,
        namespace,
        default_branch,
        gitlab_http_url: http_url_to_repo,
        gitlab_ssh_url: ssh_url_to_repo,
        status: 0,
        gitlab_id: id,
        github_id,
    };
};

module.exports = {
    getRepoList,
};
