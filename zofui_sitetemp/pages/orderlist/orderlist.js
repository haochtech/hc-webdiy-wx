function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a = getApp();

Page(Object.assign({}, a.zan.Tab, {
    data: {
        tid: null,
        pageurl: "/zofui_sitetemp/pages/orderlist/orderlist",
        wxuser: null,
        bar: [],
        init: !1,
        sets: null,
        page: {
            isend: !1,
            doing: !1,
            doo: "order",
            pdata: {
                op: "getlist",
                page: 1,
                type: 0,
                initpage: 0,
                plug: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: null,
        express: null,
        expressdata: null
    },
    onLoad: function(t) {
        var e = this;
        a.com.comfunc(this), e.setData({
            "tab.selectedId": t.type ? 1 * t.type + 1 : 0,
            "page.pdata.type": t.type ? 1 * t.type + 1 : 0,
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0
        }), a.com.auth(function(o) {
            e.setData({
                wxuser: o.wxInfo
            }), a.com.getPage(e, e.data.page, 20, function(a) {
                var o = a.data.data;
                e.setData({
                    datalist: o.list,
                    init: !0,
                    sets: o.set,
                    lawyer: o.lawyer,
                    "page.pdata.initpage": 1,
                    tab: {
                        color: e.data.bar.maincolor,
                        list: [ {
                            id: "0",
                            title: "全部",
                            num: o.mynum.myorder
                        }, {
                            id: "1",
                            title: "待付款",
                            num: o.mynum.ordering
                        }, {
                            id: "2",
                            title: 1 == o.lawyer ? "待履行" : "已付款",
                            num: o.mynum.orderpayed
                        }, {
                            id: "3",
                            title: 1 == o.lawyer ? "正在履行" : "待收货",
                            num: o.mynum.ordersend
                        }, {
                            id: "4",
                            title: "已完成",
                            num: o.mynum.ordercom
                        }, {
                            id: "5",
                            title: "已退款",
                            num: o.mynum.refund
                        } ],
                        selectedId: t.type ? 1 * t.type + 1 : 0,
                        scroll: !0
                    }
                });
            }, !1, function(t) {
                a.com.alert(t.data.message);
            });
        }), a.com.setBar(e, function(t) {
            t.topcolor && t.topbg ? (wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), e.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            })) : wx.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, t.tid), wx.setNavigationBarTitle({
            title: "我的订单"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "我的订单",
            path: ""
        };
    },
    handleZanTabChange: function(e) {
        var o = this, i = e.componentId, r = e.selectedId;
        if (o.setData(t({}, i + ".selectedId", r)), o.data.ising || r == o.data.page.pdata.type) return !1;
        o.data.ising = !0, o.setData({
            "page.pdata.type": r,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), a.com.getPage(o, o.data.page, 20, function(t) {
            o.setData({
                datalist: t.data.data.list
            }), wx.pageScrollTo({
                scrollTop: 0
            });
        }), o.data.ising = !1;
    },
    orderinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        a && wx.navigateTo({
            url: a
        });
    },
    dealorder: function(t) {
        var e = this, o = t.currentTarget.dataset.id, i = t.currentTarget.dataset.type, r = {
            oid: o,
            op: i
        };
        if ("cancel" == i || "com" == i) {
            var n = "确定取消订单吗？", d = "已取消";
            if ("com" == i) var n = "确定完成订单吗？", d = "已完成";
            a.com.confirm(n, function() {
                a.com.http("order", "POST", r, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else for (var i = 0; i < e.data.datalist.length; i++) e.data.datalist[i].orderid == o && (e.data.datalist.splice(i, 1), 
                    e.setData({
                        datalist: e.data.datalist
                    }), a.com.toast(d));
                });
            });
        } else "pay" != i && "express" != i || a.com.http("order", "POST", r, 0, !0, "", "", function(t) {
            if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else if ("pay" == i) wx.requestPayment({
                timeStamp: t.data.data.timeStamp,
                nonceStr: t.data.data.nonceStr,
                package: t.data.data.package,
                signType: "MD5",
                paySign: t.data.data.paySign,
                success: function(t) {
                    if ("requestPayment:ok" == t.errMsg) {
                        for (var i = 0; i < e.data.datalist.length; i++) e.data.datalist[i].orderid == o && (e.data.datalist.splice(i, 1), 
                        e.setData({
                            datalist: e.data.datalist
                        }));
                        a.util.message("支付完成", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + o, "success");
                    }
                },
                fail: function(t) {
                    console.log("失败");
                }
            }); else if ("express" == i) {
                var r = t.data.data.data, n = [];
                if (t.data.data.pro) for (s = 0; s < t.data.data.pro.length; s++) {
                    var d = t.data.data.pro[s];
                    if (0 == s) c = {
                        current: !0,
                        done: !0,
                        text: d.time,
                        desc: d.text,
                        img: d.img,
                        type: d.type
                    }; else c = {
                        current: !1,
                        done: !1,
                        text: d.time,
                        desc: d.text,
                        img: d.img,
                        type: d.type
                    };
                    n.push(c);
                } else for (var s = 0; s < r.length; s++) {
                    if (0 == s) c = {
                        current: !0,
                        done: !0,
                        text: r[s].time,
                        desc: r[s].context
                    }; else var c = {
                        current: !1,
                        done: !1,
                        text: r[s].time,
                        desc: r[s].context
                    };
                    n.push(c);
                }
                e.setData({
                    expressdata: n,
                    showRightPopup: !e.data.showRightPopup,
                    searchfocus: !e.data.searchfocus
                }), console.log(n);
            }
        });
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    changeorder: function(t) {
        var e = this;
        if (e.data.ising || t.target.dataset.type < 3 && t.target.dataset.type == this.data.page.pdata.otype) return !1;
        e.data.ising = !0, e.setData({
            "page.pdata.otype": t.target.dataset.type,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), a.com.getPage(e, e.data.page, 20, function(t) {
            e.setData({
                datalist: t.data.data.list
            }), wx.pageScrollTo({
                scrollTop: 0
            });
        }), e.data.ising = !1;
    },
    onReachBottom: function() {
        var t = this;
        a.com.getPage(t, t.data.page, 20, function(a) {
            t.setData({
                datalist: t.data.datalist.concat(a.data.data.list)
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
    showimages: function(t) {
        a.com.showimages(t);
    },
    showimg: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.img,
            urls: t.currentTarget.dataset.imgarr
        });
    }
}));