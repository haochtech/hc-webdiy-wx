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
        showexpress: !1,
        expressoid: "",
        expressname: "",
        expressnum: "",
        prodate: "",
        protime: ""
    },
    onLoad: function(e) {
        var a = this;
        a.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: e.tid ? e.tid : null,
            options: e
        }), t.com.comfunc(this), t.com.auth(function(o) {
            a.setData({
                wxuser: o.wxInfo
            }), t.com.http("orderinfo", "POST", {
                oid: e.oid,
                op: "info",
                isadmin: 1,
                plug: 1
            }, 0, !1, "", "", function(o) {
                if (o.data.errno) t.com.alert(o.data.message); else if (a.setData({
                    order: o.data.data.order,
                    qrcode: t.com.murl("img", {
                        op: "hexiao",
                        oid: e.oid,
                        m: "zofui_sitetemp"
                    }),
                    sets: o.data.data.set,
                    prodate: o.data.data.time.prodate,
                    protime: o.data.data.time.protime
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
                    for (var r = [], n = 0; n < o.data.data.order.progress.length; n++) {
                        var d = o.data.data.order.progress[n];
                        0 == n ? r.push({
                            current: !0,
                            done: !0,
                            text: d.time,
                            desc: d.text,
                            key: d.key
                        }) : r.push({
                            current: !1,
                            done: !1,
                            text: d.time,
                            desc: d.text,
                            key: d.key
                        });
                    }
                    a.setData({
                        verlogs: r
                    });
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
        if ("cancel" == r || "com" == r || "refund" == r) {
            d = "确定取消订单吗？";
            if ("com" == r) d = "确定完成订单吗？";
            if ("refund" == r) var d = "确定退款处理吗？";
            t.com.confirm(d, function() {
                t.com.http("adminorder", "POST", n, 0, !0, "", "", function(e) {
                    if (e.data.errno || void 0 === e.data.errno) t.com.alert(e.data.message); else if ("cancel" == r) {
                        t.com.toast("已删除");
                        var n = getCurrentPages();
                        if (n.length >= 2) {
                            for (var d = n[n.length - 2], s = d.data.datalist, i = 0; i < s.length; i++) s[i].orderid == o && (s.splice(i, 1), 
                            d.setData({
                                datalist: s
                            }));
                            wx.navigateBack();
                        }
                    } else "com" == r ? (t.com.toast("已完成"), a.setData({
                        "order.status": 3
                    })) : "refund" == r && (t.com.toast("已退款"), a.setData({
                        "order.status": 4
                    }));
                });
            });
        } else "express" == r ? t.com.http("adminorder", "POST", n, 0, !0, "", "", function(e) {
            (e.data.errno || void 0 === e.data.errno) && t.com.alert(e.data.message);
        }) : "call" == r ? wx.makePhoneCall({
            phoneNumber: a.data.sets.shoptel
        }) : "send" == r && a.setData({
            expressoid: o,
            showexpress: !0
        });
    },
    subexpress: function() {
        var e = this, a = {
            op: "send",
            oid: e.data.expressoid,
            name: e.data.expressname,
            num: e.data.expressnum
        };
        t.com.http("adminorder", "POST", a, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? t.com.alert(a.data.message) : (e.setData({
                "order.status": 2,
                showexpress: !1
            }), t.com.toast(a.data.message));
        });
    },
    expressname: function(t) {
        this.setData({
            expressname: t.detail.value
        });
    },
    expressnum: function(t) {
        this.setData({
            expressnum: t.detail.value
        });
    },
    toggleexpress: function() {
        this.setData({
            showexpress: !1
        });
    },
    addpro: function() {
        this.setData({
            showaddpro: !this.data.showaddpro
        });
    },
    bindDateChange: function(t) {
        this.setData({
            prodate: t.detail.value
        });
    },
    bindTimeChange: function(t) {
        this.setData({
            protime: t.detail.value
        });
    },
    proname: function(t) {
        this.setData({
            proname: t.detail.value
        });
    },
    subaddpro: function() {
        var e = this, a = {
            op: "addprogress",
            oid: e.data.order.id,
            proname: e.data.proname,
            prodate: e.data.prodate,
            protime: e.data.protime
        };
        t.com.http("adminorder", "POST", a, 0, !0, "", "", function(a) {
            a.data.errno || void 0 === a.data.errno ? t.com.alert(a.data.message) : t.com.toast(a.data.message, !1, function() {
                e.setData({
                    showaddpro: !e.data.showaddpro,
                    proname: ""
                }), e.onLoad(e.data.options);
            });
        });
    },
    deletevstep: function(e) {
        var a = this, o = {
            op: "deleteprogress",
            oid: a.data.order.id,
            key: e.currentTarget.dataset.key
        };
        t.com.confirm("确定要删除吗此进度？", function() {
            t.com.http("adminorder", "POST", o, 0, !0, "", "", function(e) {
                e.data.errno || void 0 === e.data.errno ? t.com.alert(e.data.message) : t.com.toast(e.data.message, !1, function() {
                    a.onLoad(a.data.options);
                });
            });
        });
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
        t.com.alert("长按图片失败二维码联系客服", function() {
            wx.previewImage({
                current: e.currentTarget.dataset.img,
                urls: [ e.currentTarget.dataset.img ]
            });
        });
    }
}));