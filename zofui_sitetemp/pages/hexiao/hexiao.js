var t = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null
    },
    onLoad: function(a) {
        var e = this;
        t.com.auth(function(o) {
            e.setData({
                wxuser: o.wxInfo
            }), t.com.http("hexiao", "POST", {
                oid: a.scene,
                op: "info"
            }, 0, !1, "", "", function(a) {
                a.data.errno ? t.com.alert(a.data.message) : e.setData({
                    order: a.data.data.order
                });
            });
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.article.title,
            path: "",
            imageUrl: t.data.article.img
        };
    },
    dealorder: function(a) {
        var e = this, o = e.data.order.orderid, r = a.currentTarget.dataset.type, n = {
            oid: o,
            op: r
        };
        if ("com" == r) {
            t.com.confirm("确定核销完成订单吗？", function() {
                t.com.http("hexiao", "POST", n, 0, !0, "", "", function(a) {
                    a.data.errno || void 0 === a.data.errno ? t.com.alert(a.data.message) : t.com.alert("已完成", function() {
                        e.setData({
                            "order.status": 3
                        });
                    });
                });
            });
        } else "call" == r && wx.makePhoneCall({
            phoneNumber: e.data.sets.shoptel
        });
    },
    goodinfo: function(t) {
        console.log(t);
        var a = t.currentTarget.dataset.url;
        wx.navigateTo({
            url: a
        });
    },
    location: function(a) {
        t.com.location(a);
    },
    otherapp: function(a) {
        t.com.otherapp(a);
    },
    navigateto: function(a) {
        t.com.navigateto(a);
    },
    redirectto: function(a) {
        t.com.redirectto(a);
    },
    callphone: function(a) {
        t.com.callphone(a);
    },
    showkefuimg: function(a) {
        t.com.alert("长按图片失败二维码联系客服", function() {
            wx.previewImage({
                current: a.currentTarget.dataset.img,
                urls: [ a.currentTarget.dataset.img ]
            });
        });
    }
}));