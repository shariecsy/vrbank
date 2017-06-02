var CreateFile=(function(){
    var create=function(path,filename,content){
        var fs=require("fs");
        fs.open(path+filename,"a",0644,function(e,fd){
            if(e) throw e;
            fs.write(fd,content,0,"utf-8",function(e){
                if(e) throw e;
                fs.closeSync(fd);
            })
        });
    };
    return {
        create:create
    };
})();

module.exports=CreateFile;