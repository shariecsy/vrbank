var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var config = require('./config/system.js');
var util=require('./util');
var express = require('express');
var app = express();
var identityKey = 'skey';
var session=require("express-session");
var RedisStore = require('connect-redis')(session);
app.use(cookieParser());
app.use(session({
    name: identityKey,   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    secret: '12345',
    cookie: {maxAge: 60*60*1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    store: new RedisStore({
        host: "127.0.0.1",
        port: 6379,
        ttl: 60*60*1000 // 过期时间
    }),
    saveUninitialized: true
}));
app.use(bodyParser.json());//扩展获取json格式参数
app.use(bodyParser.urlencoded({ extended: true }));//扩展获取json格式参数

var multer  = require('multer');
app.use(multer({ dest: '/tmp/'}).array('file'));

var router = require('./routers/route.js');
app.use(router.use(express.Router()));//添加路由策略

app.use(express.static(path.join(__dirname,config.webroot)));//静态资源

app.listen(config.port);
console.log("httpserver started "+ config.port);
