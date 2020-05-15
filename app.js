App({
    onLaunch: function() {},
    onShow: function() {},
    onHide: function() {},
    onError: function(e) {
        console.log(e);
    },
    util: require("we7/resource/js/util.js"),
    com: require("zofui_sitetemp/resource/js/com.js"),
    zan: require("zofui_sitetemp/resource/zan-ui/index.js"),
    globalData: {
        userInfo: null
    },
    siteInfo: require("siteinfo.js")
});