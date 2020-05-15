var t = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        order: null,
        sets: null,
        steps: [ {
            current: !1,
            done: !1,
            text: "支付"
        }, {
            done: !1,
            current: !1,
            text: "发货"
        }, {
            done: !1,
            current: !1,
            text: "收货"
        }, {
            done: !1,
            current: !1,
            text: "完成"
        } ],
        qrcode: null,
        options: null
    },
    onLoad: function(e) {
        var a = this;
        a.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: e.tid ? e.tid : null,
            options: e
        }), t.com.auth(function(o) {
            a.setData({
                wxuser: o.wxInfo
            }), t.com.http("orderinfo", "POST", {
                oid: e.oid,
                op: "info",
                plug: 1
            }, 0, !1, "", "", function(o) {
                if (o.data.errno) t.com.alert(o.data.message); else {
                    if (a.setData({
                        order: o.data.data.order,
                        qrcode: t.com.murl("img", {
                            op: "hexiao",
                            oid: e.oid,
                            m: "zofui_sitetemp"
                        }),
                        sets: o.data.data.set
                    }), 1 == o.data.data.order.status && a.setData({
                        steps: [ {
                            current: !0,
                            done: !0,
                            text: "支付"
                        }, {
                            done: !1,
                            current: !1,
                            text: "发货"
                        }, {
                            done: !1,
                            current: !1,
                            text: "收货"
                        }, {
                            done: !1,
                            current: !1,
                            text: "完成"
                        } ]
                    }), 2 == o.data.data.order.status && a.setData({
                        steps: [ {
                            current: !1,
                            done: !0,
                            text: "支付"
                        }, {
                            done: !0,
                            current: !0,
                            text: "发货"
                        }, {
                            done: !1,
                            current: !1,
                            text: "收货"
                        }, {
                            done: !1,
                            current: !1,
                            text: "完成"
                        } ]
                    }), 3 == o.data.data.order.status && a.setData({
                        steps: [ {
                            current: !1,
                            done: !0,
                            text: "支付"
                        }, {
                            done: !0,
                            current: !1,
                            text: "发货"
                        }, {
                            done: !0,
                            current: !1,
                            text: "收货"
                        }, {
                            done: !0,
                            current: !0,
                            text: "完成"
                        } ]
                    }), 1 == o.data.data.order.isprogress) {
                        for (var r = [], n = 0; n < o.data.data.order.progress.length; n++) 0 == n ? r.push({
                            current: !0,
                            done: !0,
                            text: o.data.data.order.progress[n].time,
                            desc: o.data.data.order.progress[n].text
                        }) : r.push({
                            current: !1,
                            done: !1,
                            text: o.data.data.order.progress[n].time,
                            desc: o.data.data.order.progress[n].text
                        });
                        a.setData({
                            verlogs: r
                        });
                    }
                    wx.stopPullDownRefresh();
                }
            });
        }), t.com.setBar(a, function(t) {
            t.topcolor && t.topbg && (wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), a.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            }));
        }, e.tid);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.article.title,
            path: "",
            imageUrl: t.data.article.img
        };
    },
    dealorder: function(e) {
        var a = this, o = a.data.order.orderid, r = e.currentTarget.dataset.type, n = {
            oid: o,
            op: r
        };
        if ("cancel" == r || "com" == r) {
            s = "确定取消订单吗？";
            if ("com" == r) var s = "确定已收到货物，完成订单吗？";
            t.com.confirm(s, function() {
                t.com.http("order", "POST", n, 0, !0, "", "", function(e) {
                    if (e.data.errno || void 0 === e.data.errno) t.com.alert(e.data.message); else if ("cancel" == r) {
                        t.com.toast("已取消");
                        var a = getCurrentPages();
                        if (a.length >= 2) {
                            for (var n = a[a.length - 2], s = n.data.datalist, d = 0; d < s.length; d++) s[d].orderid == o && (s.splice(d, 1), 
                            n.setData({
                                datalist: s
                            }));
                            wx.navigateBack();
                        }
                    } else t.util.message("已完成", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + o, "success");
                });
            });
        } else "pay" == r || "com" == r || "express" == r ? t.com.http("order", "POST", n, 0, !0, "", "", function(e) {
            if (e.data.errno || void 0 === e.data.errno) t.com.alert(e.data.message); else if ("pay" == r && wx.requestPayment({
                timeStamp: e.data.data.timeStamp,
                nonceStr: e.data.data.nonceStr,
                package: e.data.data.package,
                signType: "MD5",
                paySign: e.data.data.paySign,
                success: function(e) {
                    "requestPayment:ok" == e.errMsg && t.util.message("已支付", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + o, "success");
                },
                fail: function(t) {
                    console.log("失败");
                }
            }), "express" == r) {
                for (var n = e.data.data.data, s = [], d = 0; d < n.length; d++) {
                    if (0 == d) i = {
                        current: !0,
                        done: !0,
                        text: n[d].time,
                        desc: n[d].context
                    }; else var i = {
                        current: !1,
                        done: !1,
                        text: n[d].time,
                        desc: n[d].context
                    };
                    s.push(i);
                }
                a.setData({
                    expressdata: s,
                    showRightPopup: !a.data.showRightPopup,
                    searchfocus: !a.data.searchfocus
                });
            }
        }) : "toshop" == r ? wx.openLocation({
            latitude: parseFloat(a.data.sets.shoplat),
            longitude: parseFloat(a.data.sets.shoplng),
            scale: 13
        }) : "call" == r && wx.makePhoneCall({
            phoneNumber: a.data.sets.shoptel
        });
    },
    goodinfo: function(t) {
        var e = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        wx.navigateTo({
            url: e
        });
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    onPullDownRefresh: function() {
        t.com.pullDown(this);
    },
    location: function(e) {
        t.com.location(e);
    },
    otherapp: function(e) {
        t.com.otherapp(e);
    },
    navigateto: function(e) {
        t.com.navigateto(e, this.data.tid);
    },
    redirectto: function(e) {
        t.com.redirectto(e, this.data.tid);
    },
    callphone: function(e) {
        t.com.callphone(e);
    },
    showkefuimg: function(e) {
        t.com.alert("长按图片识别二维码联系客服", function() {
            wx.previewImage({
                current: e.currentTarget.dataset.img,
                urls: [ e.currentTarget.dataset.img ]
            });
        });
    }
}));