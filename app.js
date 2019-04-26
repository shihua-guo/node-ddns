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
			TencentApi.getRecordList().then(bodyStr=>{
				//bodyStr = bodyStr.replace('"',"'").slice(0, -1) +"'";
				let body = JSON.parse(bodyStr);
				let domainData = body.data;
				console.log(domainData);
				//校验是否存在3级域名
				var nowRecord = domainData.records.filter(record => {
					return record.name === domain;
				});
				if(nowRecord.length){//存在，那么则发起修改解析的请求。
					TencentApi.RecordModify("RecordModify",nowRecord[0].id,domain,ip).then(bodyStr=>{
						let body = JSON.parse(bodyStr);
						let respData = body.data;
						console.log(body);
					});
				}else{//不存在，则添加解析
					TencentApi.RecordModify("RecordCreate",nowRecord[0].id,domain,ip).then(bodyStr=>{
						let body = JSON.parse(bodyStr);
						let respData = body.data;
						console.log(body);
					});
				}
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
