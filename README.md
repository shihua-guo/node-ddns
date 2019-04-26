a simple node app can modify your linux server file and excute shell
### how to run
#### install the depandencies
```
npm install
```
#### run the app
```
node app
```
### notice
The signature arithmetic is only fit the [tencent's signature](https://cloud.tencent.com/document/product/215/1693)

### Api
|           address           | method |            urlParameters           | returns                                                            | example                                                                                                                                                                                                                                                                                                                                                                                   |
|:---------------------------:|--------|:----------------------------------:|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|   locahost:3000/initCache   | get    |                                    | return "初始化缓存成功" when success or "初始化缓存失败" when fail | locahost:3000/initCache                                                                                                                                                                                                                                                                                                                                                                   |
|     locahost:3000/modify    | get    |                 _t                 | the tencent's response body                                        | locahost:3000/modify?_t=mytoken                                                                                                                                                                                                                                                                                                                                                           |
| locahost:3000/testSignature | post   | body: { "url":"", "SecretKey":"" } | after parsed the url                                               | url:http://192.168.1.26:3000/testSignature  headers: { "Content-Type":"application/json" }   body: { "url":"https://cns.api.qcloud.com/v2/index.php?Action=DescribeInstances&InstanceIds.0=ins-09dx96dg&Nonce=11886&Region=ap-guangzhou&SecretId=AKIDz8krbsJ5yKBZQpn74WFkmLPx3gnPhESA&SignatureMethod=HmacSHA256&Timestamp=1465185768",  "SecretKey":"Gu5t9xGARNpq86cd98joQYCN3Cozk1qA" } |