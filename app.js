const createTable = require('./src/db/module');
const { getRepoList } = require('./src/service/gitlab');
const { checkService } = require('./src/api/common');
const { checkConfig } = require('./src/utils/index');
const { getProjectList } = require('./src/service/github');

async function start() {
    try {
        console.log('正在检查配置文件');

        if (!checkConfig()) {
            throw '请检查配置文件';
        } else console.log('配置文件正常');

        console.log('检查服务是否正常');
        await checkService();
        await createTable();
        await getRepoList();
        await getProjectList();
        console.log('任务完成');
    } catch (error) {
        console.log(error);
        console.log('任务失败');
    }

    process.exit();
}

start();
