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
The app contains 3 api
- initial the cache
    get locahost:3000/initCache
    params:
    returns:return "初始化缓存成功" when success or "初始化缓存失败" when fail
- add or modify the record,url params is your token
    get locahost:3000/modify
    url params:_t
    returns: the tencent's response body
- testSignature,url params is url and SecretKey
    get locahost:3000/modify
    url params:url,SecretKey
    returns:after parsed the url