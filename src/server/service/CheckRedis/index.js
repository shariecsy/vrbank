var CheckRedis = (function(){
    var redis = require('redis');
    var config = require('../../config/system.js');
    var users=require('../Users/index.js');
    var Md5_list=[];
    var user_list = config.user_list;
    //redis链接
    var client =  redis.createClient('6379', '127.0.0.1');

    var writeRedis = function(){
        for(var i =0;i<user_list.length;i++) {
            Md5_list.push(users.getMd5(user_list[i].username,user_list[i].password));
        }
        client.on('error',function(err){
            console.log('redis有错误：'+err);
        });
        client.set('key01','AAA',function(err,response){
            if(err){
                console.log('redis-set有错误：'+err);
            }else{
                console.log(response);
                client.get('key01',function(err,response){
                    if(err){
                        console.log('redis-get有错误：'+err);
                    }else{
                        console.log(response);
                    }
                })
            }
        })


    };
    var readRedis = function(){
        for(var i=0;i<Md5_list.length;i++){
            
        }
    };


    return {
        writeRedis:writeRedis
    }
})();
module.exports=CheckRedis;