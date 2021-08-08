const defaultConfig = require('../../config');

const checkConfig = (config = defaultConfig)=>{
    if(!config || typeof config !== 'object') return false;
    let result = true;
    let keys = Object.keys(config);
    for(let key of keys){
        let item = config[key];
        if(typeof item === 'object') result = checkConfig(item);
        result = !ISNULL(item);
        if(!result) continue;
    }
    return result;
}


const ISNULL = (value)=>{
    if(typeof value === 'string') value = value.trim();
    return (value === '' || value === undefined || value === null);
}



module.exports = {
    checkConfig,
    ISNULL
}