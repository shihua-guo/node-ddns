var Utils = require("./src/utils/utils");
var express = require('express');
var app = express();
var connection = Utils.getMysqlConnection();
connection.connect(function(err){
	if(err){
		console.log(err);
		return;
	}else{
	}
});
app.get('/modify',function(req,resp){
	var ip = Utils.extractIpFromString(req.ip);
	var _t = req.query._t;
	console.log("将ip替换为：",ip);
	var sql = "SELECT * from ddns_user where token = '"+_t+"'";
	console.log("查询的sql",sql);
	connection.query(sql, function (error, results, fields) {
		if (error) throw error;
		console.log('The results is: ', results);
		console.log('The fields is: ', fields);
		if(results.length ){
			resp.send('验证成功');
			connection.query("SELECT * from ddns_user where token = '"+_t+"'", function (error, results, fields) {

			});
		}else{
			resp.send('验证失败');
		}
	  });

});
app.listen(3000);
console.log("app is running on 3000");
