var t = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null,
        qrcode: null
    },
    onLoad: function(a) {
        var o = this;
        t.com.comfunc(this), o.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : null
        }), t.com.auth(function(e) {
            o.setData({
                wxuser: e.wxInfo
            }), t.com.http("appoint", "POST", {
                oid: a.oid,
                op: "orderinfo"
            }, 0, !1, "", "", function(a) {
                a.data.errno ? t.com.alert(a.data.message) : o.setData({
                    order: a.data.data.order,
                    sets: a.data.data.set
                });
            });
        }), t.com.setBar(o, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, a.tid);
    },
    dealorder: function(a) {
        var o = this, e = o.data.order.orderid, r = a.currentTarget.dataset.type, n = {
            oid: e,
            op: r
        };
        if ("cancel" == r || "com" == r) {
            c = "确定取消订单吗？";
            if ("com" == r) var c = "确定完成吗？";
            t.com.confirm(c, function() {
                t.com.http("appoint", "POST", n, 0, !0, "", "", function(a) {
                    a.data.errno || void 0 === a.data.errno ? t.com.alert(a.data.message) : "com" == r && t.com.toast("已完成", "", function() {
                        console.log(o.data.order), o.setData({
                            "order.status": 3
                        });
                    });
                });
            });
        } else "pay" == r ? t.com.http("appoint", "POST", n, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? t.com.alert(a.data.message) : "pay" == r && wx.requestPayment({
                timeStamp: a.data.data.timeStamp,
                nonceStr: a.data.data.nonceStr,
                package: a.data.data.package,
                signType: "MD5",
                paySign: a.data.data.paySign,
                success: function(t) {
                    o.setData({
                        "order.status": 1
                    });
                },
                fail: function(t) {
                    console.log("失败");
                }
            });
        }) : "toshop" == r ? wx.openLocation({
            latitude: parseFloat(o.data.sets.shoplat),
            longitude: parseFloat(o.data.sets.shoplng),
            scale: 13
        }) : "call" == r && wx.makePhoneCall({
            phoneNumber: o.data.sets.apshoptel
        });
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
    showimages: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.src,
            urls: t.currentTarget.dataset.img
        });
    }
}));