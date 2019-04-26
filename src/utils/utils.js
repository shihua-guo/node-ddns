var mysql = require("mysql");
var fs = require("fs");
const SignatureUtils = require("../utils/signatureUtils");
class Utils {
    static fillSignatureByParams(params,SecretKey){
        var url = Utils.getUrlByAction(Action);
        var Action = params.Action;
        var paramsStr = Utils.transParamsToStr(params);
        var parseResult = SignatureUtils.parseUrl(url+"?"+paramsStr,SecretKey);
        params.Signature = parseResult.Signature;
        return params;
    }
    /**
     * 解析请求的ip。因为接收到可能是ipv6地址，所以我们需要提取ipv4地址
     * @param {请求的ip参数} str 
     */
    static extractIpFromString (str){
        var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        var ip = str.match(r);
        return ip[0];
    }
    /**
     * 初始化用户和token的缓存
     * @param {mysql连接} connection 
     */
    static initToken(connection){
        /* 查询token */
        connection.query("SELECT * FROM "+Utils.config.token.keyTable,function(error,results,fields){
            if (error) throw error;
            if(results.length){
                var t = results[0];
                Utils.token = t;
            }
        });
        /* 域名记录 */
        connection.query("SELECT * from ddns_user ", function (error, results, fields) {
            if(results.length){
                Utils.ddnsUsers = results;
                Utils.ddnsUsersMap = Utils.ddnsUsers.reduce(function(map, obj) {
					map[obj.token] = obj.domain;
					return map;
				}, {});
            }
        });
    }
    /**
     * 获取mysql连接
     * @param {回调函数} callBack 
     */
    static getMysqlConnection(callBack){
        if(!Utils.connection){
            Utils.connection = mysql.createConnection(Utils.config.mysql);
            console.log(Utils.config.mysql);
        }
        !callBack||(callBack(Utils.connection));
        return Utils.connection;
    }
    /**
     * 
     * @param {数据库获取的id} SecretId 
     * @param {独立参数} uniqueParams 
     */
    static getApiParams(SecretId,uniqueParams){
        var params = Object.assign({}, Utils.config.apiCommon);
        params.SecretId = Utils.token.SecretId;
        params.Timestamp =  Math.round(+new Date()/1000);
        params.Nonce = Math.floor(Math.random() * 100000000);
        Object.assign(params,uniqueParams );
        return params;
    }
    /**
     * 将params对象转化为字符串
     * @param {get请求查询参数} params 
     * @param {是否进行url编码} ifEncode 
     */
    static transParamsToStr(params,ifEncode){
        var paramArr = Object.keys(params).map(function(key){
            return key+"="+(ifEncode?encodeURIComponent(params[key]):params[key]);
        });
        return paramArr.join("&");
    }
    /**
     * 获取请求的参数
     * @param {请求的操作} Action 
     * @param {你的SecretId} SecretId 
     * @param {该操作自己的参数} uniqueParams 
     */
    static getApiParamsStr(Action,SecretId,uniqueParams){
        var params = this.getApiParams(Action,SecretId,uniqueParams);
        return this.transParamsToStr(params);
    }
    /**
     * 拼接完整的请求地址
     * @param {请求的操作} Action 
     */
    static getUrlByAction(Action){
        return "https://"+Utils.config.addressConfig[Action] + Utils.config.apiUrl;
    }

}
Utils.config = JSON.parse(fs.readFileSync('src/config/main.json', 'utf8'));
Utils.token = {};
Utils.ddnsUsers = [];
Utils.ddnsUsersMap = {};
module.exports = Utils;