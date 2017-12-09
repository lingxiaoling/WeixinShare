
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  ,request = require('request-promise')
  , sign = require('./sign');
//   , socket = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/users', user.users);


// 在“微信公众平台-开发-基本配置”页中获得AppID和AppSecret
const APPID = 'wx5974a716cfe****';
const APPSECRET = '722728846d********';
// accessToken和jsapiTicket有效期为7200s
const TASKTIMER = 7200000;
let accessToken;
let jsapiTicket;

/**
 * 获取access_token和jsapiTicket
 *
 * @return {Promise} promise 获取两个参数用于生成签名
 */
function getAccessToken() {
	console.log(2);
    return request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`)
        .then(function (body) {
            accessToken = JSON.parse(body).access_token;
            return request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`);
        })
        .then(function (body) {
            jsapiTicket = JSON.parse(body).ticket;
            console.log(jsapiTicket);
        });
}

/**
 * 增加定时任务，刷新accessToken和jsapiTicket
 *
 */
setInterval(function () {
    console.log(1);
    getAccessToken();
}, TASKTIMER);

/**
 * 返回签名
 *
 * @param {Object} response 返回对象
 * @param {string} url 前端传递的域名用于生成签名
 */
function responseSignature(response, url) {
    /*
     * 签名算法生成格式如下
     * {
     *     jsapi_ticket: 'jsapi_ticket',
     *     nonceStr: '82zklqj7ycoywrk',
     *     timestamp: '1415171822',
     *     url: 'http://example.com',
     *     signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
     * }
     */
    let signature = sign(jsapiTicket, url);
	Object.assign(signature, {appId: APPID});
	response.json({
		sign: signature
	});
    response.writeHead('200', {'Content-Type': 'text/plain'});
    response.write(JSON.stringify(signature));
    response.end();
}

app.get('/wxjssdk/getSignature', function(req, response) {
	//create new model
	if (typeof jsapiTicket === 'undefined') {
        // 初始化时没有jsapiTicket，主动获取
        getAccessToken().then(function () {
            responseSignature(response, req.body);
            // responseSignature(response, params.url);
        });
    }
    else {
        responseSignature(response, req.body);
        // responseSignature(response, params.url);
    }
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});