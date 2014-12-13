var global_origin = window.location.origin||(window.location.protocol+'//'+window.location.hostname);
var imgUrl = global_origin + "/static/image/icon.png"; //注意必须是绝对路径
var lineLink = global_origin + "/app"; //同样，必须是绝对路径
var descContent = '中粮海南微社区，美味中粮齐分享！'; //分享给朋友或朋友圈时的文字简介
var shareTitle = '中粮海南微社区，美味中粮齐分享！'; //分享title
var appid = ''; //apiID，可留空
function shareFriend() {
  WeixinJSBridge.invoke('sendAppMessage', {
    "appid": appid,
    "img_url": imgUrl,
    "img_width": "300",
    "img_height": "300",
    "link": lineLink,
    "desc": descContent,
    "title": shareTitle
  }, function(res) {
    //_report('send_msg', res.err_msg);
  })
}

function shareTimeline() {
  WeixinJSBridge.invoke('shareTimeline', {
    "img_url": imgUrl,
    "img_width": "300",
    "img_height": "300",
    "link": lineLink,
    "desc": descContent,
    "title": shareTitle
  }, function(res) {
    //_report('timeline', res.err_msg);
  });
}

function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo', {
      "content": descContent,
      "url": lineLink,
    }, function(res) {
      //_report('weibo', res.err_msg);
    });
  }
  // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  // 发送给好友
  WeixinJSBridge.on('menu:share:appmessage', function(argv) {
    shareFriend();
  });
  // 分享到朋友圈
  WeixinJSBridge.on('menu:share:timeline', function(argv) {
    shareTimeline();
  });
  // 分享到微博
  WeixinJSBridge.on('menu:share:weibo', function(argv) {
    shareWeibo();
  });
}, false);