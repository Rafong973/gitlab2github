const axios = require('axios');
const SocksProxyAgent = require('socks-proxy-agent');

const { github, gitlab, sock5  } = require('../../config');
const httpsAgent = sock5 ? new SocksProxyAgent(sock5) : {};

const gitHhubToken = Buffer.from(
    `${github.userName}:${github.token}`,
    'utf-8'
).toString('base64');
const gitHubHeaders = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${gitHhubToken}`,
};

const gitLabHeaders = {
    'Private-Token': gitlab.token,
};

const githubRequest = (path = '', data = {}, method = 'GET', headers = gitHubHeaders)=>{
    return axios({
        method,
        url: github.url + path,
        headers,
        data,
        httpsAgent,
    });
}


const gitlabRequest = (path = '', data = {}, method = 'GET') => {
    return axios({
        method,
        url: gitlab.url + gitlab.version + path,
        headers: gitLabHeaders,
        data,
    });
}

const checkService = ()=>{
    console.log('正在检查服务');
    return new Promise(async (resolve)=>{
        let github = await githubRequest();
        let gitlab = await githubRequest();
        if(github.status === 200 && gitlab.status === 200){
            console.log('服务正常');
            return resolve();
        }else{
            throw '服务异常，请检查GitHub或者Gitlab服务';
        }
    },error=>{
        throw '服务异常，请检查代理';
    })
}

module.exports = {
    githubRequest,
    gitlabRequest,
    checkService,
    gitHubHeaders
}