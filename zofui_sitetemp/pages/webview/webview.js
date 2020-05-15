getApp();

Page({
    data: {
        url: "",
        shareurl: ""
    },
    onLoad: function(e) {
        var t = this, r = decodeURIComponent(e.url);
        t.setData({
            url: r,
            shareurl: "/zofui_sitetemp/pages/webview/webview?url=" + e.url
        });
    },
    onShareAppMessage: function(e) {
        e.webViewUrl.split("#");
        return {
            title: "",
            path: this.data.shareurl
        };
    }
});