var CreateFile=(function(){
    var create=function(path,filename,content){
        var fs=require("fs");
        fs.open(path+filename,"a",0644,function(err,fd){
            try{
                if(err){
                    console.info(err);
                }
                fs.write(fd,content,0,"utf-8",function(ee){
                    if(ee){ console.log(ee)};
                    fs.closeSync(fd);
                })
            }catch(e){
                console.log(e);
            }
        });
    };
    return {
        create:create
    };
})();

module.exports=CreateFile;