// var socket;
// socket = io.connect( window.location.href );
// console.log( socket );
// socket.on('get', function( data ){
// 	$('#outText').append($('<li>').html(data));
// })



// $('#textIn').on('blur', function(){
// 	this.value;
// 	socket.emit('set', this.value);
// })

window.onload = wxjssdk();

function wxjssdk() {
    window.wxShareData = {
        // 分享标题，根据情况修改
        title: '分享标题，根据情况修改',
        // 分享描述，根据情况修改
        desc: '分享描述，根据情况修改',
        // 分享链接，必须与当前页面对应的公众号JS安全域名一致
        link: 'http://baidu.com',
        // 分享缩略图参考尺寸300*300，根据情况修改
        imgUrl: 'https://mfs.ys7.com/mall/1d0dd04abfd6eb4705afed9cd54bf238_big.jpg?5000266704'
    };

    $.ajax({
        // 与nginx配置的接收路径一致即可
        url: '/wxjssdk/getSignature',
        type: 'get',
        // 必须不能缓存，签名验证会失效
        cache: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        // 微信要求url动态获取
        data: {
            'url': location.href.split('#')[0]
        },
        success: function (data) {
			data = data.sign;
            wx.config({
                // 可以开启debug模式，页面会alert出错误信息
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.noncestr,
                signature: data.signature,
                // 配置所需的API列表
                jsApiList: ['checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage']
			});
			
			wx.ready(function () {
				// 分享到朋友圈
				wx.onMenuShareTimeline({
					title: wxShareData.title,
					link: wxShareData.link,
					imgUrl: wxShareData.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				// 分享给朋友
				wx.onMenuShareAppMessage({
					title: wxShareData.title,
					desc: wxShareData.desc,
					link: wxShareData.link,
					imgUrl: wxShareData.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
			});
	
        }
    });

    // wx.ready(function () {
    //     // 分享到朋友圈
    //     wx.onMenuShareTimeline({
    //         title: wxShareData.title,
    //         link: wxShareData.link,
    //         imgUrl: wxShareData.imgUrl,
    //         success: function () {
    //             // 用户确认分享后执行的回调函数
    //         },
    //         cancel: function () {
    //             // 用户取消分享后执行的回调函数
    //         }
    //     });
    //     // 分享给朋友
    //     wx.onMenuShareAppMessage({
    //         title: wxShareData.title,
    //         desc: wxShareData.desc,
    //         link: wxShareData.link,
    //         imgUrl: wxShareData.imgUrl,
    //         success: function () {
    //             // 用户确认分享后执行的回调函数
    //         },
    //         cancel: function () {
    //             // 用户取消分享后执行的回调函数
    //         }
    //     });
    // });
}
$('.toshare').click(function() {

});
