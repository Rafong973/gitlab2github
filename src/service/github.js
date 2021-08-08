const pwd = process.cwd();
const shell = require('shelljs');
const fs = require('fs');

const DB = require('../db/index');
const { createRepo, updateRepoThemeRequest } = require('../api/github');
const { tableName } = require('../../config/index').sql;
const { clear } = require('../../config/index');


// 获取列表
const getProjectList = async () => {
    let list = await DB(tableName)
        .where('status', 0);
    if (list && list.length) {
        for (let i in list) {
            let item = list[i];
            await cloneRepo(item);
        }
    }else{
        console.log('没有符合条件的仓库');
    }
    process.exit();
};

// 克隆并进入仓库
const cloneRepo = (item) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                if (!item || typeof item != 'object') return resolve();

                console.log('准备Clone仓库：' + item.name);

                const { name, gitlab_ssh_url, gitlab_http_url} = item;
                const remote_url = gitlab_ssh_url || gitlab_http_url;

                if (
                    !remote_url
                ) return resolve();
            
                await shell.exec(`cd ${pwd}/repos && rm -rf ${name}`);
                console.log('准备克隆仓库');
                await shell.exec(
                    `cd ${pwd}/repos && git clone ${remote_url}`
                );
                
                await fs.accessSync(`${pwd}/repos/${item.name}`);
                
            } catch (error) {
                console.error('克隆过程失败：' + item.name);
                return resolve(error);
            }
            await getRepoInfo(item);
            if(clear){
                await shell.exec(`rm -rf ${pwd}/repos/${item.name}`)
                console.log('本地仓库清除成功');
            }
            resolve();
        },
        (error) => {
            console.log(error);
        }
    );
};


// 获取旧仓库信息
const getRepoInfo = async (item) => {
    return new Promise(async (resolve) => {
        const { name, status, id, gitlabBranch } = item;
        // 
        let branchList = JSON.parse(gitlabBranch || '[]');
        if(!branchList || !branchList.length){
            await recordRepoState(item);
            return resolve();
        }
        for (let i in branchList) {
            let branch = branchList[i];
            await shell.exec(
                `cd ${pwd}/repos/${name} && git checkout -b ${branch.name}`
            );
        }
        await changeRemote(item);
        resolve();
    });
};

// 更改仓库remote并提交新仓库
const changeRemote = (item) => {
    console.log('更改仓库名称');
    return new Promise(async (resolve, reject) => {
        try {
            const { name, description } = item;
            console.log('创建新分支');
            let result = await createRepo(name, description);
            const { ssh_url: github_ssh_url, svn_url: github_http_url, id: github_id } = result.data;
            item.github_ssh_url = github_http_url;
            item.github_ssh_url = github_ssh_url;
            item.github_id = github_id;

            console.log('设置新仓库');
            await shell.exec(`cd ${pwd}/repos/${name} && git remote rm origin`);
            await shell.exec(`cd ${pwd}/repos/${name} && git remote add origin ${github_ssh_url}`);
            await shell.exec(`cd ${pwd}/repos/${name} && git push -u origin --all`);
            
            await updateRepoTheme(item);
            await recordRepoState(item);

            resolve();
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

// 更改仓库主题
const updateRepoTheme = (item) => {
    return new Promise(async (resolve) => {
        if (!item || !item.namespace) return;
        const { namespace: space, name } = item;
        let namespace = {};
        try {
            namespace = JSON.parse(space);
        } catch (error) {
            return resolve();;
        }
        let { name: space_name, full_path } = namespace;
        let names = [];
        try {
            let reg = new RegExp('^[0-9a-zA-Z_-]{1,}$');
            if (reg.test(full_path)) names = [full_path];
            if (reg.test(space_name)) naems = [space_name];
            await updateRepoThemeRequest(name, names);
            console.log('更新主题完成');
        } catch (error) {
            console.log(error);
        }
        resolve();
    });
};

// 记录仓库已迁移状态
const recordRepoState = (item)=>{
    return new Promise(async resolve=>{
        const { github_http_url, github_ssh_url, id, github_id } = item;
        await DB(tableName).where({ id }).update({
            github_http_url,
            github_ssh_url,
            github_id,
            status: 1
        });
        console.log('记录仓库迁移状态');
        resolve();
    })
    
}


module.exports = {
    createRepo,
    getProjectList,
};
