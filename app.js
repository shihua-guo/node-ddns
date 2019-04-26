const Utils = require("./src/utils/utils");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const TencentApi = require("./src/api/tencentApi");
const SignatureUtils = require("./src/utils/signatureUtils");
var connection = Utils.getMysqlConnection(Utils.initToken);
connection.connect(function(err){
	if(err){
		console.log(err);
		return;
	}else{
	}
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get('/modify',function(req,resp){
	var ip = Utils.extractIpFromString(req.ip);
	var _t = req.query._t;
	console.log("将ip替换为：",ip);
	if(_t){
		var domain = Utils.ddnsUsersMap[_t];
		if(domain){
			resp.send('验证成功');
			//获取域名解析列表
			TencentApi.getRecordList(function(resp){
				console.log(resp);
			});
		}else{
			resp.send('验证失败');
		}
	}
});

app.post("/testSignature",function(req,resp){
	var body = req.body;
	if(body && body.url && body.key){
		try {
			var result = SignatureUtils.parseUrl(body.url,body.key);
			console.log(result);
			resp.send(result);
		} catch (error) {
			resp.send("解析出错");
		}
	}else{
		resp.send("请在body填写对应的URL和key。如{url:xxx,key:xxx}");
	}
});
app.listen(3000);
console.log("app is running on 3000");
