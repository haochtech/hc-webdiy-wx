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
        pageurl: "",
        wxuser: null,
        bar: [],
        init: !1,
        sets: null,
        page: {
            isend: !1,
            doing: !1,
            doo: "appoint",
            pdata: {
                op: "olist",
                page: 1,
                type: 0,
                initpage: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: null
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
                            title: "待支付",
                            num: a.mynum.ordering
                        }, {
                            id: "2",
                            title: "待接单",
                            num: a.mynum.taking
                        }, {
                            id: "3",
                            title: "已接单",
                            num: a.mynum.taked
                        }, {
                            id: "4",
                            title: "已完成",
                            num: a.mynum.comed
                        }, {
                            id: "5",
                            title: "已取消",
                            num: a.mynum.canceled
                        }, {
                            id: "6",
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
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), e.setData({
                "tab.color": t.maincolor ? t.maincolor : null
            });
        }, t.tid), wx.setNavigationBarTitle({
            title: "我的预约"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "我的预约",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    handleZanTabChange: function(e) {
        var i = this, o = e.componentId, n = e.selectedId;
        if (i.setData(t({}, o + ".selectedId", n)), i.data.ising || n == i.data.page.pdata.type) return !1;
        i.data.ising = !0, i.setData({
            "page.pdata.type": n,
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
        var e = this, i = t.currentTarget.dataset.id, o = t.currentTarget.dataset.type, n = {
            oid: i,
            op: o
        };
        if ("cancel" == o || "com" == o) {
            var d = "确定取消吗？", s = "已取消";
            if ("com" == o) var d = "确定完成吗？", s = "已完成";
            a.com.confirm(d, function() {
                a.com.http("appoint", "POST", n, 0, !0, "", "", function(t) {
                    if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else for (var o = 0; o < e.data.datalist.length; o++) e.data.datalist[o].orderid == i && (e.data.datalist.splice(o, 1), 
                    e.setData({
                        datalist: e.data.datalist
                    }), a.com.toast(s));
                });
            });
        } else "pay" != o && "express" != o || a.com.http("appoint", "POST", n, 0, !0, "", "", function(t) {
            if (t.data.errno || void 0 === t.data.errno) a.com.alert(t.data.message); else if ("pay" == o) wx.requestPayment({
                timeStamp: t.data.data.timeStamp,
                nonceStr: t.data.data.nonceStr,
                package: t.data.data.package,
                signType: "MD5",
                paySign: t.data.data.paySign,
                success: function(t) {
                    if ("requestPayment:ok" == t.errMsg) {
                        for (var o = 0; o < e.data.datalist.length; o++) e.data.datalist[o].orderid == i && (e.data.datalist.splice(o, 1), 
                        e.setData({
                            datalist: e.data.datalist
                        }));
                        a.util.message("支付完成", "navigate:/zofui_sitetemp/pages/appoint/orderinfo?oid=" + i, "success");
                    }
                },
                fail: function(t) {
                    console.log("失败");
                }
            }); else if ("express" == o) {
                for (var n = t.data.data.data, d = [], s = 0; s < n.length; s++) {
                    if (0 == s) r = {
                        current: !0,
                        done: !0,
                        text: n[s].time,
                        desc: n[s].context
                    }; else var r = {
                        current: !1,
                        done: !1,
                        text: n[s].time,
                        desc: n[s].context
                    };
                    d.push(r);
                }
                e.setData({
                    expressdata: d,
                    showRightPopup: !e.data.showRightPopup,
                    searchfocus: !e.data.searchfocus
                }), console.log(d);
            }
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