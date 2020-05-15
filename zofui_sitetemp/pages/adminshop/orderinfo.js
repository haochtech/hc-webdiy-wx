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
        protime: "",
        proimg: []
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
                plug: 0
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
                        var s = o.data.data.order.progress[n];
                        0 == n ? r.push({
                            current: !0,
                            done: !0,
                            text: s.time,
                            desc: s.text,
                            key: s.key,
                            img: s.img,
                            type: s.type
                        }) : r.push({
                            current: !1,
                            done: !1,
                            text: s.time,
                            desc: s.text,
                            key: s.key,
                            img: s.img,
                            type: s.type
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
            s = "确定取消订单吗？";
            if ("com" == r) s = "确定完成订单吗？";
            if ("refund" == r) var s = "确定退款处理吗？";
            t.com.confirm(s, function() {
                t.com.http("adminorder", "POST", n, 0, !0, "", "", function(e) {
                    if (e.data.errno || void 0 === e.data.errno) t.com.alert(e.data.message); else if ("cancel" == r) {
                        t.com.toast("已删除");
                        var n = getCurrentPages();
                        if (n.length >= 2) {
                            for (var s = n[n.length - 2], d = s.data.datalist, i = 0; i < d.length; i++) d[i].orderid == o && (d.splice(i, 1), 
                            s.setData({
                                datalist: d
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
            protime: e.data.protime,
            proimg: JSON.stringify(e.data.proimg)
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
    },
    showimg: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.img,
            urls: t.currentTarget.dataset.imgarr
        });
    },
    uploadimg: function(t) {
        var e = this;
        e.chooseimg(9, function(t) {
            e.setData({
                proimg: e.data.proimg.concat(t)
            });
        });
    },
    deleteImg: function(e) {
        var a = this, o = e.currentTarget.dataset.id;
        t.com.confirm("确定要删除此图片吗", function() {
            for (var t = 0; t < a.data.proimg.length; t++) if (a.data.proimg[t].id == o) return a.data.proimg.splice(t, 1), 
            a.setData({
                proimg: a.data.proimg
            }), !1;
        });
    },
    chooseimg: function(t, e) {
        var a = this;
        wx.chooseImage({
            count: t || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var o = t.tempFilePaths;
                a.uploadImg(o, function(t) {
                    e && e(t);
                });
            }
        });
    },
    uploadImg: function(e, a) {
        if (e.length <= 0) return !1;
        for (var o = [], r = 0; r < e.length; r++) !function(r) {
            wx.showLoading({
                mask: !0,
                title: "上传中"
            }), wx.uploadFile({
                url: t.siteInfo.siteroot + "?i=" + t.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: e[r],
                name: "file",
                success: function(t) {
                    var n = JSON.parse(t.data);
                    o.push({
                        id: n.id,
                        att: n.attachment,
                        url: n.url,
                        temp: e[r]
                    }), r == e.length - 1 && a && a(o);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        }(r);
    }
}));