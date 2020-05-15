var t = getApp();

Page({
    data: {
        pageurl: "/zofui_sitetemp/pages/art/art",
        article: null
    },
    onLoad: function(a) {
        var o = this;
        o.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            options: a
        }), t.com.http("product", "POST", {
            id: a.aid,
            op: "product"
        }, 0, !0, "", "", function(e) {
            e.data.errno ? t.com.alert(e.data.message) : (o.setData({
                article: e.data.data,
                pageurl: "/zofui_sitetemp/pages/art/art?aid=" + a.aid
            }), require("../../resource/wxParse/wxParse.js").wxParse("article.content", "html", e.data.data.content, o, 0), 
            wx.setNavigationBarTitle({
                title: e.data.data.title
            })), wx.stopPullDownRefresh();
        }), t.com.setBar(o, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, a.tid);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.article.title,
            path: "",
            imageUrl: t.data.article.img
        };
    },
    onPullDownRefresh: function() {
        t.com.pullDown(this);
    },
    location: function(a) {
        t.com.location(a);
    },
    otherapp: function(a) {
        t.com.otherapp(a);
    },
    navigateto: function(a) {
        t.com.navigateto(a, this.data.tid);
    },
    redirectto: function(a) {
        t.com.redirectto(a, this.data.tid);
    },
    callphone: function(a) {
        t.com.callphone(a);
    },
    showkefuimg: function(a) {
        t.com.alert("长按图片识别二维码联系客服", function() {
            wx.previewImage({
                current: a.currentTarget.dataset.img,
                urls: [ a.currentTarget.dataset.img ]
            });
        });
    },
    showimages: function(a) {
        t.com.showimages(a);
    }
});