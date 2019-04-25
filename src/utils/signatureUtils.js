/**
* 注意：
* 1. 算的签名必须要经过encodeURIComponent编码。
* 2. 检查请求的地址有没有错
* 3. 检查请求的action有没有错
* 4. 检查时间戳有没有过期
* 5. 默认为Get请求，请使用get请求。使用encodeSignature作为Signature参数
* 6. 排序的时候大小写敏感了。使用原生的排序即可 
* @param {*} url 
* @param {*} key 
* @param {*} result 
*/
var crypto = require('crypto');
class signatureUtils { 
    static parseUrl(url, key, resultArr) {
        var addressConfig = {
            "RecordCreate": "cns.api.qcloud.com",//添加解析记录
            "RecordStatus": "cns.api.qcloud.com",//设置解析记录状态
            "RecordModify": "cns.api.qcloud.com",//修改解析记录
            "RecordList": "cns.api.qcloud.com",//获取解析记录列表
            "RecordDelete": "cns.api.qcloud.com",//删除解析记录
            "DescribeInstances": "cvm.api.qcloud.com"//查看实例列表
        };
        function _parser(url) {
            var result = {};
            var parser = document.createElement('a');
            parser.href = result.href = url;
            try {
                if (parser.search) {
                    var param = parser.search.slice(1, parser.search.length);
                    if (param) {
                        var paramArr = param.split("&");
                        if (paramArr) {
                            parser.param = result.param = {};
                            parser.paramKeys = result.paramKeys = paramArr.map(function (v) {
                                var vt = v.split("=");
                                parser.param[vt[0]] = result.param[vt[0]]   = vt.length === 2 ? vt[1] : "";
                                return vt[0];
                            });
                            parser.paramSort = result.paramSort = {};
                            /*1. 对参数排序 需要忽略大小写*/
                            parser.paramJoins = result.paramJoins = parser.paramKeys.sort().map(function (v) {
                                var value = decodeURIComponent(parser.param[v]);
                                parser.paramSort[v] = result.paramSort[v] = value;
                                return v + "=" + value;
                            });
                            /*2. 拼接请求字符串*/
                            parser.paramJoin = result.paramJoin = parser.paramJoins.join("&");
                            /*3. 拼接签名原文字符串 请求方法 + 请求主机 +请求路径 + ? + 请求字符串*/
                            parser.joinAllGet = result.joinAllGet = "GET" + (addressConfig[parser.param.Action]) + "/v2/index.php?" + parser.paramJoin;
                            /*4. 生成签名串*/
                            var hash = crypto.createHmac(parser.joinAllGet, key);
                            var buff = new Buffer(hash);  
                            var hashInBase64 = buff.toString('base64');
                            parser.Signature = result.Signature = hashInBase64;
                            parser.encodeSignature = result.encodeSignature = encodeURIComponent(hashInBase64);
                        }
                    }
                }
            } catch (error) {
                console.log("解析地址出错！");
                console.log(error);
            }
            return result;
        }
        var _result = _parser(url);
        resultArr.push(_result);
        console.log(resultArr);
    }
}