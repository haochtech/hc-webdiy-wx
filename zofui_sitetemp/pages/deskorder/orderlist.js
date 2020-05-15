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
        pageurl: "/zofui_sitetemp/pages/deskorder/orderlist",
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
                plug: 1
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
        }), a.com.auth(function(t) {
            e.setData({
                wxuser: t.wxInfo
            }), a.com.getPage(e, e.data.page, 20, function(t) {
                var a = t.data.data;
                e.setData({
                    datalist: a.list,
                    init: !0,
                    sets: a.set,
                    "page.pdata.initpage": 1,
                    tab: {
                        color: e.data.bar.maincolor,
                        list: [ {
                            id: "0",
                            title: "全部",
                            num: a.mynum.myorder
                        }, {
                            id: "1",
                            title: "待付款",
                            num: a.mynum.ordering
                        }, {
                            id: "2",
                            title: "待发货",
                            num: a.mynum.orderpayed
                        }, {
                            id: "3",
                            title: "待收货",
                            num: a.mynum.ordersend
                        }, {
                            id: "4",
                            title: "已完成",
                            num: a.mynum.ordercom
                        }, {
                            id: "5",
                            title: "已退款",
                            num: a.mynum.refund
                        } ],
                        selectedId: "0",
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
        var o = this, i = e.componentId, n = e.selectedId;
        if (o.setData(t({}, i + ".selectedId", n)), o.data.ising || n == o.data.page.pdata.type) return !1;
        o.data.ising = !0, o.setData({
            "page.pdata.type": n,
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
        var e = this, o = t.currentTarget.dataset.id, i = t.currentTarget.dataset.type, n = {
            oid: o,
            op: i
        };
        if ("cancel" == i || "com" == i) {
            var d = "确定取消订单吗？", r = "已取消";
            if ("com" == i) var d = "确定完成订单吗？", r = "已完成";
            a.com.confirm(d, function() {
                a.com.http("order", "POST", n, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else for (var i = 0; i < e.data.datalist.length; i++) e.data.datalist[i].orderid == o && (e.data.datalist.splice(i, 1), 
                    e.setData({
                        datalist: e.data.datalist
                    }), a.com.toast(r));
                });
            });
        } else "pay" != i && "express" != i || a.com.http("order", "POST", n, 0, !0, "", "", function(t) {
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
                for (var n = t.data.data.data, d = [], r = 0; r < n.length; r++) {
                    if (0 == r) s = {
                        current: !0,
                        done: !0,
                        text: n[r].time,
                        desc: n[r].context
                    }; else var s = {
                        current: !1,
                        done: !1,
                        text: n[r].time,
                        desc: n[r].context
                    };
                    d.push(s);
                }
                e.setData({
                    expressdata: d,
                    showRightPopup: !e.data.showRightPopup,
                    searchfocus: !e.data.searchfocus
                }), console.log(d);
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
    }
}));