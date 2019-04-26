var mysql = require("mysql");
var fs = require("fs");
class Utils {
    static extractIpFromString (str){//因为接收到可能是ipv6地址，所以我们需要提取ipv4地址
        var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        var ip = str.match(r);
        return ip[0];
    }
    static initToken(connection){//回调直接放入内存中
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
     * @param {操作名称} Action 
     * @param {数据库获取的id} SecretId 
     * @param {独立参数} uniqueParams 
     */
    static getApiParams(Action,SecretId,uniqueParams){
        var params = Object.assign({}, Utils.config.apiCommon);
        params.Action = Action;
        params.SecretId = Utils.token.SecretId;
        params.Timestamp =  Math.round(+new Date()/1000);
        params.Nonce = Math.floor(Math.random() * 100000000);
        Object.assign(params,uniqueParams );
        return params;
    }
    static transParamsToStr(params){
        var paramArr = Object.keys(params).map(function(key){
            return key+"="+params[key];
        });
        return paramArr.join("&");
    }
    static getApiParamsStr(Action,SecretId,uniqueParams){
        var params = this.getApiParams(Action,SecretId,uniqueParams);
        return this.transParamsToStr(params);
    }
    static getUrlByAction(Action){
        return "https://"+Utils.config.addressConfig[Action] + Utils.config.apiUrl;
    }

}
Utils.config = JSON.parse(fs.readFileSync('src/config/main.json', 'utf8'));
Utils.token = {};
Utils.ddnsUsers = [];
Utils.ddnsUsersMap = {};
module.exports = Utils;