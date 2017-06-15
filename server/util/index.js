var path = require('path');
var fs=require("fs");

var util=(function(){
    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }


    //遍历获取目录结构
    var walk=function(dir) {
        var children = [];
        fs.readdirSync(dir).forEach(function(filename){
            var _path_ = dir+path.sep+filename;
            var stat = fs.statSync(_path_);
            if (stat && stat.isDirectory()) {
                children = children.concat(walk(_path_))
            }
            else {
                children.push(_path_)
            }
        });

        return children
    };

    //删除文件夹
    var deleteAll=function(_path_) {
        var files = [];
        if(fs.existsSync(_path_)) {
            files = fs.readdirSync(_path_);
            files.forEach(function(file, index) {
                var curPath = _path_ + path.sep + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteAll(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(_path_);
        }
    };

    return {
        getGUID:uuid,
        walk:walk,
        deleteAll:deleteAll
    };
})();

module.exports=util;

