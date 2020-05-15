var a = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null,
        qrcode: null
    },
    onLoad: function(t) {
        var e = this;
        a.com.comfunc(this), e.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            pass: t.pass
        }), a.com.auth(function(o) {
            e.setData({
                wxuser: o.wxInfo
            }), a.com.http("appoint", "POST", {
                oid: t.oid,
                op: "orderinfo",
                pass: t.pass
            }, 0, !1, "", "", function(t) {
                t.data.errno ? a.com.alert(t.data.message) : e.setData({
                    order: t.data.data.order,
                    sets: t.data.data.set
                });
            });
        });
    },
    dealorder: function(t) {
        var e = this, o = e.data.order.orderid, n = t.currentTarget.dataset.type, r = {
            oid: o,
            op: n,
            password: e.data.pass
        };
        if ("cancel" == n || "com" == n) {
            s = "确定删除吗？";
            if ("com" == n) var s = "确定完成吗？";
            a.com.confirm(s, function() {
                a.com.http("appoint", "POST", r, 0, !0, "", "", function(t) {
                    t.data.errno || void 0 === t.data.errno ? a.com.alert(t.data.message) : "com" == n && a.com.toast("已完成", "", function() {
                        console.log(e.data.order), e.setData({
                            "order.status": 3
                        });
                    });
                });
            });
        } else "pay" == n ? a.com.http("appoint", "POST", r, 0, !0, "", "", function(t) {
            t.data.errno || void 0 === t.data.errno ? a.com.alert(t.data.message) : "pay" == n && wx.requestPayment({
                timeStamp: t.data.data.timeStamp,
                nonceStr: t.data.data.nonceStr,
                package: t.data.data.package,
                signType: "MD5",
                paySign: t.data.data.paySign,
                success: function(a) {
                    e.setData({
                        "order.status": 1
                    });
                },
                fail: function(a) {
                    console.log("失败");
                }
            });
        }) : "toshop" == n ? wx.openLocation({
            latitude: parseFloat(e.data.sets.shoplat),
            longitude: parseFloat(e.data.sets.shoplng),
            scale: 13
        }) : "call" == n && wx.makePhoneCall({
            phoneNumber: e.data.sets.apshoptel
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
    },
    showimages: function(a) {
        wx.previewImage({
            current: a.currentTarget.dataset.src,
            urls: a.currentTarget.dataset.img
        });
    }
}));