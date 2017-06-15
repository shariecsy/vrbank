var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var config = require('./config/system.js');
var util=require('./util');
var express = require('express');
var app = express();

app.use(bodyParser.json());//扩展获取json格式参数
app.use(bodyParser.urlencoded({ extended: true }));//扩展获取json格式参数

var router = require('./routers/route.js');
app.use(router.use(express.Router()));//添加路由策略

app.use(express.static(path.join(__dirname,config.webroot)));//静态资源

var server=app.listen(config.port,function(){
    console.log("httpserver started "+ config.port);
});
