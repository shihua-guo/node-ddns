/**
* 注意：
* 1. 算的签名必须要经过encodeURIComponent编码。
* 2. 检查请求的地址有没有错
* 3. 检查请求的action有没有错
* 4. 检查时间戳有没有过期
* 5. 默认为Get请求，请使用get请求。使用encodeSignature作为Signature参数
* 6. 排序的时候大小写敏感了。使用原生的排序即可
* 7. 官网例子：parseUrl("https://cns.api.qcloud.com/v2/index.php?Action=DescribeInstances&InstanceIds.0=ins-09dx96dg&Nonce=11886&Region=ap-guangzhou&SecretId=AKIDz8krbsJ5yKBZQpn74WFkmLPx3gnPhESA&SignatureMethod=HmacSHA256&Timestamp=1465185768","Gu5t9xGARNpq86cd98joQYCN3Cozk1qA",[]);、
    返回：0EEm/HtGRr/VJXTAD9tYMth1Bzm3lLHz5RCDv1GdM8s=
    编码：0EEm%2FHtGRr%2FVJXTAD9tYMth1Bzm3lLHz5RCDv1GdM8s%3D
* @param {*} url 除了Signature参数以外的get请求字符串。如：https://cns.api.qcloud.com/v2/index.php?Action=DescribeInstances&InstanceIds.0=ins-09dx96dg&Nonce=11886&Region=ap-guangzhou&SecretId=AKIDz8krbsJ5yKBZQpn74WFkmLPx3gnPhESA&SignatureMethod=HmacSHA256&Timestamp=1465185768
* @param {*} key 你的SecretId
* @param {*} result 传入一个数组。因为这里只有一个方法，需要请求加密的js，是异步的，不能将结果直接返回给你。通过数组将结果传递出去
* @returns 返回一个对象：
    {
        encodeSignature --编码后的签名（你需要的是这个）
        Signature --计算的签名
        href --你传递的地址
        param --解析出来的查询参数
        paramKeys --解析出来的查询参数的key
        paramSort --参数的排序（原生的js排序）
        paramJoins --参数的字符串
        paramJoin --
        joinAllGet --排序后的拼接请求字符串
    }
*/
function parseUrl(url, key, resultArr) {
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
                        var hash = CryptoJS.HmacSHA256(parser.joinAllGet, key);
                        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
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
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha256.js", function () {
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/enc-base64-min.js", function () {
            var _result = _parser(url);
            resultArr.push(_result);
            console.log(resultArr);
        });
    });
}
