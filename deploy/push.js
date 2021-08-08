const shell = require('shelljs');
const pwd = process.cwd();
const argv = process.argv;

const commit = argv[2];

async function run(){
    let cp = await shell.exec(`cp -rf ${pwd}/config.template.js ${pwd}/config/index.js`);
    if(cp.stderr.indexOf('No such file') > -1) throw('没有指定文件');
    await shell.exec('git checkout -b develop')
    await shell.exec('git add .')
    await shell.exec(`git commit -m ${commit}`);
    await shell.exec('git push origin develop');
    console.log('提交成功');
    process.exit();
}

run();