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
            doo: "adminorder",
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
        expressdata: null,
        showexpress: !1,
        expressname: "",
        expressnum: ""
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : null
        }), a.com.comfunc(this), a.com.auth(function(t) {
            e.setData({
                wxuser: t.wxInfo
            }), a.com.getPage(e, e.data.page, 20, function(t) {
                var a = t.data.data;
                e.setData({
                    datalist: a.list,
                    lawyer: a.lawyer,
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
                            title: 1 == a.lawyer ? "待履行" : "已付款",
                            num: a.mynum.orderpayed
                        }, {
                            id: "3",
                            title: 1 == a.lawyer ? "正在履行" : "待收货",
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
            t.topcolor && t.topbg && (wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), e.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            }));
        }, t.tid), wx.setNavigationBarTitle({
            title: "平台订单"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "平台订单",
            path: ""
        };
    },
    handleZanTabChange: function(e) {
        var i = this, o = e.componentId, r = e.selectedId;
        if (i.setData(t({}, o + ".selectedId", r)), i.data.ising || r == i.data.page.pdata.type) return !1;
        i.data.ising = !0, i.setData({
            "page.pdata.type": r,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), a.com.getPage(i, i.data.page, 20, function(t) {
            i.setData({
                datalist: t.data.data.list
            }), wx.pageScrollTo({
                scrollTop: 0
            });
        }), i.data.ising = !1;
    },
    orderinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        a && wx.navigateTo({
            url: a
        });
    },
    dealorder: function(t) {
        var e = this, i = t.currentTarget.dataset.id, o = t.currentTarget.dataset.type, r = {
            oid: i,
            op: o
        };
        if ("cancel" == o || "com" == o || "refund" == o) {
            var s = "确定删除订单吗？", n = "已删除";
            if ("com" == o) var s = "确定完成订单吗？", n = "已完成";
            if ("refund" == o) var s = "确定为此订单退款吗？", n = "已退款";
            a.com.confirm(s, function() {
                a.com.http("adminorder", "POST", r, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else for (var o = 0; o < e.data.datalist.length; o++) e.data.datalist[o].orderid == i && (e.data.datalist.splice(o, 1), 
                    e.setData({
                        datalist: e.data.datalist
                    }), a.com.toast(n));
                });
            });
        } else "express" == o ? a.com.http("adminorder", "POST", r, 0, !0, "", "", function(t) {
            if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else if ("express" == o) {
                var i = t.data.data.data, r = [];
                if (t.data.data.pro) for (n = 0; n < t.data.data.pro.length; n++) {
                    var s = t.data.data.pro[n];
                    if (0 == n) d = {
                        current: !0,
                        done: !0,
                        text: s.time,
                        desc: s.text,
                        img: s.img,
                        type: s.type
                    }; else d = {
                        current: !1,
                        done: !1,
                        text: s.time,
                        desc: s.text,
                        img: s.img,
                        type: s.type
                    };
                    r.push(d);
                } else for (var n = 0; n < i.length; n++) {
                    if (0 == n) d = {
                        current: !0,
                        done: !0,
                        text: i[n].time,
                        desc: i[n].context
                    }; else var d = {
                        current: !1,
                        done: !1,
                        text: i[n].time,
                        desc: i[n].context
                    };
                    r.push(d);
                }
                e.setData({
                    expressdata: r,
                    showRightPopup: !e.data.showRightPopup,
                    searchfocus: !e.data.searchfocus
                });
            }
        }) : "send" == o && e.setData({
            expressoid: i,
            showexpress: !0
        });
    },
    subexpress: function() {
        var t = this, e = {
            op: "send",
            oid: t.data.expressoid,
            name: t.data.expressname,
            num: t.data.expressnum
        };
        a.com.http("adminorder", "POST", e, 0, !0, "", "", function(e) {
            if (e.data.errno || void 0 === e.data.errno) a.com.alert(e.data.message); else for (var i = 0; i < t.data.datalist.length; i++) t.data.datalist[i].orderid == t.data.expressoid && (t.data.datalist.splice(i, 1), 
            t.setData({
                datalist: t.data.datalist,
                showexpress: !1
            }), a.com.toast(e.data.message));
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
        a.com.alert("长按图片失败二维码联系客服", function() {
            wx.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    },
    showimg: function(t) {
        wx.previewImage({
            current: t.currentTarget.dataset.img,
            urls: t.currentTarget.dataset.imgarr
        });
    }
}));