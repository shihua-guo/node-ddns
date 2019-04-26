const https = require('https');
const Utils = require("../utils/utils");
const signatureUtils = require("../utils/signatureUtils");
class TencentApi {
    static getRecordList(callBack){
        var SecretId = Utils.token.SecretId;
        var SecretKey = Utils.token.SecretKey;
        var params = Utils.getApiParams("RecordList",SecretId,{
            domain:Utils.token.domain
        });
        var paramsStr = Utils.transParamsToStr(params);
        var url = Utils.getUrlByAction("RecordList");
        var parseResult = signatureUtils.parseUrl(url+"?"+paramsStr,SecretKey);
        params.Signature = parseResult.encodeSignature;
        var finalUrl = url+"?"+Utils.transParamsToStr(params);
        https.get(finalUrl, (resp) => {
            callBack(resp);
            console.log('STATUS: ' + resp.statusCode);
            console.log('HEADERS: ' + JSON.stringify(resp.headers));
            resp.setEncoding('utf8');
            resp.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });
    }
}
module.exports = TencentApi;