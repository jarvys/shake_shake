$(function() {
    var debug = true;
    var origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname);
    // var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
    // if (!reg.test(val1)) {
    //     $(".msg-error").html("*为确保中奖联络,请输入正确的电话号码");
    //     return result;
    // }
    window.mySwipe = Swipe(document.getElementById('js-wrapper'), {
        stopPropagation: true,
        continuous: false,
        speed: 1000,
        callback: function(idx) {
            // 摇一摇
            if (idx == 6) {
                doLotteryGift();
                mySwipe.close();
            }
        }
    });
    $(".js-btn").click(function() {
        mySwipe.next();
    });
    $(".js-btn-rule").click(function() {
        mySwipe.next();
    })
    $(".js-btn-close").click(function() {
        mySwipe.prev();
    });
    $(".js-share").click(function() {
        $(".wrapper_share").show().bind("mousedown.share", hideShare);
    });

    function doLotteryGift() {
        $(document).one("yaoyiyao", function() {
            $(".js-yao").addClass("yaoyiyao");
            if (debug) {
                setTimeout(function() {
                    $(".js-yao").removeClass("yaoyiyao");
                    loadGift();
                }, 1000);
            } else {
                $.ajax({
                    url: origin + "/api/info",
                    type: "get",
                    dataType: "json",
                    success: function(data, status, xhr) {
                        $(".js-yao").removeClass("yaoyiyao");
                        var code = Number(data.code);
                        if (code == 0) {
                            loadGift();
                        } else {
                            window.console && window.console.log("code:" + code);
                            alert("与服务器链接异常，请重试！");
                        }
                    },
                    error: function(xhr, errorType, error) {

                    }
                });
            }

        });
    }

    function loadGift() {
        if (debug) {
            if (Math.round(Math.random())) {
                // 中奖
                mySwipe.slide(8);
            } else {
                // 未中奖
                 mySwipe.slide(9);
            }
        } else {

        }
    }

    function hideShare() {
        $(".wrapper_share").hide().unbind("mousedown.share");
    };
});