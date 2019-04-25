const Utils = require("./src/utils/utils");
const signatureUtils = require("./src/utils/signatureUtils");
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
var signatur = signatureUtils.parseUrl("https://cns.api.qcloud.com/v2/index.php?Action=DescribeInstances&InstanceIds.0=ins-09dx96dg&Nonce=11886&Region=ap-guangzhou&SecretId=AKIDz8krbsJ5yKBZQpn74WFkmLPx3gnPhESA&SignatureMethod=HmacSHA256&Timestamp=1465185768","Gu5t9xGARNpq86cd98joQYCN3Cozk1qA");
console.log(signatur);
app.get('/modify',function(req,resp){
	var ip = Utils.extractIpFromString(req.ip);
	var _t = req.query._t;
	console.log("将ip替换为：",ip);
	if(_t){
		var sql = "SELECT * from ddns_user where token = '"+_t+"'";
		console.log("查询的sql",sql);
		connection.query(sql, function (error, results, fields) {
			if (error) throw error;
			console.log('The results is: ', results);
			console.log('The fields is: ', fields);
			if(results.length ){
				resp.send('验证成功');
				connection.query("SELECT * from ddns_user where token = '"+_t+"'", function (error, results, fields) {
					if(results.length){
						console.log(results);
					}
				});
			}else{
				resp.send('验证失败');
			}
		  });
	}

});
app.listen(3000);
console.log("app is running on 3000");
