
const { gitlabRequest } = require('./common');

// 获取项目总数
const getProjectCount = async () => {
    return new Promise((resolve, reject) => {
        try {
            gitlabRequest('/projects').then(
                (res) => {
                    const {
                        'x-total': total,
                        'x-total-pages': max,
                        'x-per-page': per,
                    } = res.headers;
                    console.log('已取得Gitlab仓库总数，准备拉取');
                    resolve({ max, total, per });
                },
                (error) => {
                    console.log(error);
                    console.error('gitlab server request error');
                    reject(error)
                }
            );
        } catch (error) {
            reject(error)
            console.log(error);
        }
    });
};


module.exports = {
    getProjectCount
};
