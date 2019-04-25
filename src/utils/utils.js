var mysql = require("mysql");
var fs = require("fs");
class Utils {
    static extractIpFromString (str){//因为接收到可能是ipv6地址，所以我们需要提取ipv4地址
        var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        var ip = str.match(r);
        return ip[0];
    }
    static getMysqlConnection(){
        if(!Utils.connection){
            Utils.connection = mysql.createConnection(Utils.config.mysql);
            console.log(Utils.config.mysql);
        }
        return Utils.connection;
    }
    
}
Utils.config = JSON.parse(fs.readFileSync('src/config/db.json', 'utf8'));
module.exports = Utils;