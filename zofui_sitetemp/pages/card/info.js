var a = getApp();

Page(Object.assign({}, a.zan.Quantity, {
    data: {
        pageurl: "/zofui_sitetemp/pages/card/info",
        card: null,
        wxuser: null,
        sets: null,
        status: 1,
        qrcode: null,
        showRightPopup: !1,
        cardlogid: 0,
        options: null
    },
    onLoad: function(t) {
        var o = this;
        t.cid = t.cid ? t.cid : t.scene ? t.scene : 0, o.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            from: t.from ? t.from : null,
            options: t
        }), a.com.auth(function(e) {
            o.setData({
                wxuser: e.wxInfo
            }), a.com.http("card", "POST", {
                cid: t.cid,
                op: "info"
            }, 0, !1, "", "", function(t) {
                t.data.errno ? a.com.alert(t.data.message, function() {
                    wx.navigateBack({
                        delta: 1
                    });
                }) : (o.setData({
                    card: t.data.data.card,
                    sets: t.data.data.set,
                    status: t.data.data.status,
                    cardlogid: t.data.data.cardlogid ? t.data.data.cardlogid : 0
                }), require("../../resource/wxParse/wxParse.js").wxParse("card.content", "html", t.data.data.card.content, o, 0), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: t.data.data.set.cardbg
                }), 0 == t.data.data.card.isshare ? wx.updateShareMenu() : wx.hideShareMenu(), wx.stopPullDownRefresh());
            });
        });
    },
    onShareAppMessage: function() {
        var a = this;
        return 1 != a.data.card.isshare && {
            title: a.data.card.name,
            path: "",
            imageUrl: a.data.card.thumb
        };
    },
    getcard: function() {
        var t = this;
        if (2 == t.data.status || 3 == t.data.status && t.data.card.usetype > 0) return !1;
        1 == t.data.status ? a.com.http("card", "POST", {
            cid: t.data.card.id,
            op: "getcard"
        }, 0, !0, "", "", function(o) {
            o.data.errno ? a.com.alert(o.data.message, function() {
                wx.navigateBack({
                    delta: 1
                });
            }) : (a.com.toast("已领取"), t.setData({
                status: 3,
                cardlogid: o.data.data
            }));
        }) : 3 == t.data.status && (t.toggleRightPopup(), t.setData({
            qrcode: a.com.murl("img", {
                op: "hexiaocard",
                cid: t.data.cardlogid,
                m: "zofui_sitetemp"
            })
        }));
    },
    onPullDownRefresh: function() {
        a.com.pullDown(this);
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup
        });
    },
    location: function(t) {
        a.com.location(t);
    },
    otherapp: function(t) {
        a.com.otherapp(t);
    },
    navigateto: function(t) {
        a.com.navigateto(t, this.data.tid);
    },
    redirectto: function(t) {
        a.com.redirectto(t, this.data.tid);
    },
    callphone: function(t) {
        a.com.callphone(t);
    },
    showkefuimg: function(t) {
        a.com.alert("长按图片识别二维码联系客服", function() {
            wx.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    }
}));