const https = require('https');
const Utils = require("../utils/utils");
const SignatureUtils = require("../utils/signatureUtils");
class TencentApi {
    /**
     * 新增或者修改解析记录
     * @param {操作名称["RecordCreate","RecordModify"]} Action 
     * @param {解析记录id} recordId 
     * @param {3级域名} subDomain 
     * @param {解析的ip} ip 
     */
    static RecordModify(Action,recordId,subDomain,ip){
        var SecretId = Utils.token.SecretId;
        var SecretKey = Utils.token.SecretKey;
        var params = Utils.getApiParams(SecretId,{
            Action:Action,
            domain:Utils.token.domain,
            recordId:recordId,
            subDomain:subDomain,
            recordType: "A",
            recordLine: "默认",
            value:ip
        });
        var url = Utils.getUrlByAction(Action);
        Utils.fillSignatureByParams(params,SecretKey);
        var finalUrl = url+"?"+Utils.transParamsToStr(params,true);
        return new Promise((resolve, reject) => {
            https.get(finalUrl, (resp) => {
                resp.setEncoding('utf8');
                resp.on('data', function (chunk) {
                    resolve(chunk);
                });
            });
        });
    }
    static getRecordList(){
        var SecretId = Utils.token.SecretId;
        var SecretKey = Utils.token.SecretKey;
        var Action = "RecordList";
        var params = Utils.getApiParams(SecretId,{
            Action:Action,
            domain:Utils.token.domain
        });
        var url = Utils.getUrlByAction(Action);
        Utils.fillSignatureByParams(params,SecretKey);
        var finalUrl = url+"?"+Utils.transParamsToStr(params,true);
        return new Promise((resolve, reject) => {
            https.get(finalUrl, (resp) => {
                resp.setEncoding('utf8');
                resp.on('data', function (chunk) {
                    resolve(chunk);
                });
            });
        });
    }
}
module.exports = TencentApi;