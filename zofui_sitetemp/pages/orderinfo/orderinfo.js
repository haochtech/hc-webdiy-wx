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
        options: null,
        proimg: []
    },
    onLoad: function(a) {
        var e = this;
        e.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : null,
            options: a,
            proimg: []
        }), t.com.auth(function(o) {
            e.setData({
                wxuser: o.wxInfo
            }), t.com.http("orderinfo", "POST", {
                oid: a.oid,
                op: "info",
                plug: 0
            }, 0, !1, "", "", function(o) {
                if (o.data.errno) t.com.alert(o.data.message); else {
                    if (e.setData({
                        order: o.data.data.order,
                        qrcode: t.com.murl("img", {
                            op: "hexiao",
                            oid: a.oid,
                            m: "zofui_sitetemp"
                        }),
                        sets: o.data.data.set,
                        lawyer: o.data.data.lawyer
                    }), 1 == o.data.data.order.status && e.setData({
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
                    }), 2 == o.data.data.order.status && e.setData({
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
                    }), 3 == o.data.data.order.status && e.setData({
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
                            desc: o.data.data.order.progress[n].text,
                            img: o.data.data.order.progress[n].img,
                            type: o.data.data.order.progress[n].type
                        }) : r.push({
                            current: !1,
                            done: !1,
                            text: o.data.data.order.progress[n].time,
                            desc: o.data.data.order.progress[n].text,
                            img: o.data.data.order.progress[n].img,
                            type: o.data.data.order.progress[n].type
                        });
                        e.setData({
                            verlogs: r
                        });
                    }
                    wx.stopPullDownRefresh();
                }
            });
        }), t.com.setBar(e, function(t) {
            t.topcolor && t.topbg && (wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), e.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            }));
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
    dealorder: function(a) {
        var e = this, o = e.data.order.orderid, r = a.currentTarget.dataset.type, n = {
            oid: o,
            op: r
        };
        if ("cancel" == r || "com" == r) {
            i = "确定取消订单吗？";
            if ("com" == r) var i = "确定已收到货物，完成订单吗？";
            t.com.confirm(i, function() {
                t.com.http("order", "POST", n, 0, !0, "", "", function(a) {
                    if (a.data.errno || void 0 === a.data.errno) t.com.alert(a.data.message); else if ("cancel" == r) {
                        t.com.toast("已取消");
                        var e = getCurrentPages();
                        if (e.length >= 2) {
                            for (var n = e[e.length - 2], i = n.data.datalist, s = 0; s < i.length; s++) i[s].orderid == o && (i.splice(s, 1), 
                            n.setData({
                                datalist: i
                            }));
                            wx.navigateBack();
                        }
                    } else t.util.message("已完成", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + o, "success");
                });
            });
        } else "pay" == r || "com" == r || "express" == r ? t.com.http("order", "POST", n, 0, !0, "", "", function(a) {
            if (a.data.errno || void 0 === a.data.errno) t.com.alert(a.data.message); else if ("pay" == r && wx.requestPayment({
                timeStamp: a.data.data.timeStamp,
                nonceStr: a.data.data.nonceStr,
                package: a.data.data.package,
                signType: "MD5",
                paySign: a.data.data.paySign,
                success: function(a) {
                    "requestPayment:ok" == a.errMsg && t.util.message("已支付", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + o, "success");
                },
                fail: function(t) {
                    console.log("失败");
                }
            }), "express" == r) {
                for (var n = a.data.data.data, i = [], s = 0; s < n.length; s++) {
                    if (0 == s) d = {
                        current: !0,
                        done: !0,
                        text: n[s].time,
                        desc: n[s].context
                    }; else var d = {
                        current: !1,
                        done: !1,
                        text: n[s].time,
                        desc: n[s].context
                    };
                    i.push(d);
                }
                e.setData({
                    expressdata: i,
                    showRightPopup: !e.data.showRightPopup,
                    searchfocus: !e.data.searchfocus
                });
            }
        }) : "toshop" == r ? wx.openLocation({
            latitude: parseFloat(e.data.sets.shoplat),
            longitude: parseFloat(e.data.sets.shoplng),
            scale: 13
        }) : "call" == r && wx.makePhoneCall({
            phoneNumber: e.data.sets.shoptel
        });
    },
    goodinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        wx.navigateTo({
            url: a
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
    showimg: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.img,
            urls: t.currentTarget.dataset.imgarr
        });
    },
    uploadimg: function(t) {
        var a = this;
        a.chooseimg(9, function(t) {
            a.setData({
                proimg: a.data.proimg.concat(t)
            });
        });
    },
    deleteImg: function(a) {
        var e = this, o = a.currentTarget.dataset.id;
        t.com.confirm("确定要删除此图片吗", function() {
            for (var t = 0; t < e.data.proimg.length; t++) if (e.data.proimg[t].id == o) return e.data.proimg.splice(t, 1), 
            e.setData({
                proimg: e.data.proimg
            }), !1;
        });
    },
    chooseimg: function(t, a) {
        var e = this;
        wx.chooseImage({
            count: t || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var o = t.tempFilePaths;
                e.uploadImg(o, function(t) {
                    a && a(t);
                });
            }
        });
    },
    uploadImg: function(a, e) {
        if (a.length <= 0) return !1;
        for (var o = [], r = 0; r < a.length; r++) !function(r) {
            wx.showLoading({
                mask: !0,
                title: "上传中"
            }), wx.uploadFile({
                url: t.siteInfo.siteroot + "?i=" + t.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: a[r],
                name: "file",
                success: function(t) {
                    var n = JSON.parse(t.data);
                    o.push({
                        id: n.id,
                        att: n.attachment,
                        url: n.url,
                        temp: a[r]
                    }), r == a.length - 1 && e && e(o);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        }(r);
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
        var a = this, e = {
            op: "addprogress",
            oid: a.data.order.id,
            proname: a.data.proname,
            prodate: a.data.prodate,
            proimg: JSON.stringify(a.data.proimg)
        };
        t.com.http("order", "POST", e, 0, !0, "", "", function(e) {
            e.data.errno || void 0 === e.data.errno ? t.com.alert(e.data.message) : t.com.toast(e.data.message, !1, function() {
                a.setData({
                    showaddpro: !a.data.showaddpro,
                    proname: ""
                }), a.onLoad(a.data.options);
            });
        });
    }
}));