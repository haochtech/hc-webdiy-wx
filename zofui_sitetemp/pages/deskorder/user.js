var t = getApp();

Page({
    data: {
        pageurl: "/zofui_sitetemp/pages/user/user",
        wxuser: null,
        order: {},
        sets: null,
        isadmin: 0,
        options: null
    },
    onLoad: function(o) {
        var a = this;
        t.com.comfunc(this), a.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: o.tid ? o.tid : null,
            options: o
        }), t.com.auth(function(o) {
            a.setData({
                wxuser: o.wxInfo
            }), t.com.http("user", "POST", {
                op: "info",
                plug: 1
            }, 0, !1, function(t) {
                t.data.errno || (a.setData({
                    order: t.data.data.num,
                    sets: t.data.data.set,
                    isadmin: t.data.data.isadmin
                }), t.data.data.copy && (require("../../resource/wxParse/wxParse.js").wxParse("copy", "html", t.data.data.copy.content, a, 0), 
                a.setData({
                    copyarr: t.data.data.copy
                })), wx.stopPullDownRefresh());
            });
        }, a), t.com.setBar(a, function(t) {
            t.topcolor && t.topbg ? wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }) : wx.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, o.tid), wx.setNavigationBarTitle({
            title: "个人中心"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "个人中心",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        t.com.pullDown(this);
    },
    toaddress: function() {
        wx.chooseAddress({
            success: function(t) {}
        });
    },
    toorder: function(t) {
        var o = "/zofui_sitetemp/pages/deskorder/orderlist?type=" + t.currentTarget.dataset.type + (this.data.tid ? "&tid=" + this.data.tid : "");
        wx.navigateTo({
            url: o
        });
    },
    location: function(o) {
        t.com.location(o);
    },
    otherapp: function(o) {
        t.com.otherapp(o);
    },
    navigateto: function(o) {
        t.com.navigateto(o, this.data.tid);
    },
    redirectto: function(o) {
        t.com.redirectto(o, this.data.tid);
    },
    callphone: function(o) {
        t.com.callphone(o);
    },
    showkefuimg: function(o) {
        t.com.alert("长按图片识别二维码联系客服", function() {
            wx.previewImage({
                current: o.currentTarget.dataset.img,
                urls: [ o.currentTarget.dataset.img ]
            });
        });
    },
    showimages: function(o) {
        t.com.showimages(o);
    },
    updateUserInfo: function(o) {
        var a = this;
        "getUserInfo:ok" == o.detail.errMsg && t.com.getUserInfo(function(t) {
            a.setData({
                showuserbtn: !1,
                wxuser: t.wxInfo
            });
        }, !1, o.detail);
    },
    showuserbtn: function() {
        this.setData({
            showuserbtn: !this.data.showuserbtn
        });
    }
});