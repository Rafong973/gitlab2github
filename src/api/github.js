const { github } = require('../../config');
const { githubRequest, gitHubHeaders } = require('./common');


// 创建Repo
const createRepo = async (name = '', description) => {
    if (!name) return console.error('请输入Repo Name');
    let checkeRepo = await getRepoItem(name);
    if (checkeRepo) return checkeRepo;
    return githubRequest(
        `/orgs/${github.orgs}/repos`,
        {
            name,
            description,
            private: true,
        },
        'POST'
    );
};


// 获取单个仓库信息
const getRepoItem = async (repo = '') => {
    console.log('检查仓库是否存在');
    return new Promise((resolve) => {
        return githubRequest(`/repos/${github.orgs}/${repo}`).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                resolve('');
            }
        );
    });
};

// 更新主题
const updateRepoThemeRequest = async (repo, names = []) => {
    console.log('更新主题');
    return new Promise((resolve) => {
        if (!names || !Array.isArray(names)) return resolve();
        const putHeader = Object.assign(gitHubHeaders, {
            Accept: 'application/vnd.github.mercy-preview+json',
        });
        githubRequest(
            `/repos/${github.orgs}/${repo}/topics`,
            {
                names,
            },
            'PUT',
            putHeader
        ).finally((f) => {
            resolve();
        });
    });
};

//获取指定仓库分支
const getRepoBranches = (repo)=>{
    return new Promise(resolve=>{
        if(!repo) return resolve('');
        githubRequest(`/repos/${github.orgs}/${repo}/branches`).then(result=>{
            resolve(result)
        },error=>{
            resolve(error);
        })
    })
}

const getRepoProjects = async ()=>{
    return new Promise(resolve=>{
        githubRequest(`/orgs/${github.orgs}/repos`).then(result=>{
            
        })
    })
}


module.exports = {
    createRepo,
    getRepoItem,
    updateRepoThemeRequest,
    getRepoBranches
};
