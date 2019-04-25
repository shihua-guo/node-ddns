var Utils = require("./src/utils/utils");
var express = require('express');
var app = express();
var mysql = require("mysql");
app.get('/modify',function(req,resp){
    var ip = Utils.extractIpFromString(req.ip);
	console.log("将ip替换为：",ip);

});
app.listen(3000);
console.log("app is running on 3000");
