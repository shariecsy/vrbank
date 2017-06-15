var Md5=(function(){
    var crypto = require('crypto');
    var transformToMd5 = function(username,password){
        var md5_username=crypto.createHash('md5').update(username).digest('hex');
        var md5_password=crypto.createHash('md5').update(password).digest('hex');
        return {
            username:md5_username,
            password:md5_password
        };

    };
    return {
        transformToMd5:transformToMd5
    };
})();

module.exports=Md5;

