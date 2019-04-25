class Utils {
    static extractIpFromString (str){//因为接收到可能是ipv6地址，所以我们需要提取ipv4地址
        var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        var ip = str.match(r);
        return ip[0];
    }
}
module.exports = Utils;