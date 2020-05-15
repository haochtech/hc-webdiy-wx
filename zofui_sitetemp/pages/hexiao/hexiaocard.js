var a = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        card: null,
        sets: null,
        cardlogid: 0
    },
    onLoad: function(t) {
        var o = this;
        a.com.auth(function(c) {
            o.setData({
                wxuser: c.wxInfo
            }), a.com.http("card", "POST", {
                id: t.scene,
                op: "hexiaoinfo"
            }, 0, !1, "", "", function(c) {
                c.data.errno ? a.com.alert(c.data.message) : o.setData({
                    card: c.data.data.card,
                    cardlogid: t.scene
                });
            });
        });
    },
    hexiao: function(t) {
        var o = this, c = (o.data.cardlogid, {
            id: o.data.cardlogid,
            op: "hexiao"
        });
        a.com.confirm("确定核销卡券吗？", function() {
            a.com.http("card", "POST", c, 0, !0, "", "", function(t) {
                t.data.errno || void 0 === t.data.errno ? a.com.alert(t.data.message) : a.com.alert("已核销", function() {
                    o.setData({
                        "card.status": 1
                    });
                });
            });
        });
    },
    location: function(t) {
        a.com.location(t);
    },
    otherapp: function(t) {
        a.com.otherapp(t);
    },
    navigateto: function(t) {
        a.com.navigateto(t);
    },
    redirectto: function(t) {
        a.com.redirectto(t);
    },
    callphone: function(t) {
        a.com.callphone(t);
    },
    showkefuimg: function(t) {
        a.com.alert("长按图片失败二维码联系客服", function() {
            wx.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    }
}));