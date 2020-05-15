function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var t = getApp();

Page(Object.assign({}, t.zan.Tab, {
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
                op: "adminlist",
                page: 1,
                type: 0,
                initpage: 0,
                password: null
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1,
        tab: null,
        pass: null
    },
    onLoad: function(a) {
        var e = this;
        t.com.comfunc(this), e.setData({
            "tab.selectedId": a.type ? 1 * a.type + 1 : 0,
            "page.pdata.type": a.type ? 1 * a.type + 1 : 0,
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0
        }), t.com.setBar(e, function(a) {
            a.topcolor && a.topbg && wx.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            }), e.setData({
                "tab.color": a.maincolor ? a.maincolor : null
            });
        }, a.tid), wx.setNavigationBarTitle({
            title: "管理预约数据"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "管理预约数据",
            path: ""
        };
    },
    handleZanTabChange: function(e) {
        var i = this, o = e.componentId, n = e.selectedId;
        if (i.setData(a({}, o + ".selectedId", n)), i.data.ising || n == i.data.page.pdata.type) return !1;
        i.data.ising = !0, i.setData({
            "page.pdata.type": n,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), t.com.getPage(i, i.data.page, 20, function(a) {
            i.setData({
                datalist: a.data.data.list
            }), wx.pageScrollTo({
                scrollTop: 0
            });
        }), i.data.ising = !1;
    },
    orderinfo: function(a) {
        var t = a.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        t && wx.navigateTo({
            url: t
        });
    },
    dealorder: function(a) {
        var e = this, i = a.currentTarget.dataset.id, o = a.currentTarget.dataset.type, n = {
            oid: i,
            op: o,
            password: e.data.page.pdata.password
        };
        if ("cancel" == o || "com" == o || "take" == o) {
            var d = "确定删除预约吗？", r = "已删除";
            if ("com" == o) var d = "确定完成吗？", r = "已完成";
            if ("take" == o) var d = "确定接单吗？", r = "已接单";
            t.com.confirm(d, function() {
                t.com.http("appoint", "POST", n, 0, !0, "", "", function(a) {
                    if (a.data.errno || void 0 === a.data.errno) t.com.alert(a.data.message); else for (var o = 0; o < e.data.datalist.length; o++) e.data.datalist[o].orderid == i && (e.data.datalist.splice(o, 1), 
                    e.setData({
                        datalist: e.data.datalist
                    }), t.com.toast(r));
                });
            });
        }
    },
    changeorder: function(a) {
        var e = this;
        if (e.data.ising || a.target.dataset.type < 3 && a.target.dataset.type == this.data.page.pdata.otype) return !1;
        e.data.ising = !0, e.setData({
            "page.pdata.otype": a.target.dataset.type,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), t.com.getPage(e, e.data.page, 20, function(a) {
            e.setData({
                datalist: a.data.data.list
            }), wx.pageScrollTo({
                scrollTop: 0
            });
        }), e.data.ising = !1;
    },
    onReachBottom: function() {
        var a = this;
        if (!a.data.page.pdata.password) return !1;
        t.com.getPage(a, a.data.page, 20, function(t) {
            a.setData({
                datalist: a.data.datalist.concat(t.data.data.list)
            });
        });
    },
    setPass: function(a) {
        this.setData({
            "page.pdata.password": a.detail.value
        });
    },
    look: function() {
        var a = this, e = {
            op: "checkpass",
            pass: a.data.page.pdata.password
        };
        t.com.http("appoint", "POST", e, 0, !0, "", "", function(e) {
            e.data.errno || void 0 === e.data.errno ? t.com.alert(e.data.message) : (a.setData({
                pass: a.data.page.pdata.password
            }), t.com.getPage(a, a.data.page, 20, function(t) {
                var e = t.data.data;
                a.setData({
                    datalist: e.list,
                    init: !0,
                    "page.pdata.initpage": 1,
                    tab: {
                        color: a.data.bar.maincolor,
                        list: [ {
                            id: "0",
                            title: "全部",
                            num: e.mynum.allorder
                        }, {
                            id: "1",
                            title: "待付款",
                            num: e.mynum.ordering
                        }, {
                            id: "2",
                            title: "待接单",
                            num: e.mynum.taking
                        }, {
                            id: "3",
                            title: "已接单",
                            num: e.mynum.taked
                        }, {
                            id: "4",
                            title: "已完成",
                            num: e.mynum.comed
                        }, {
                            id: "5",
                            title: "已取消",
                            num: e.mynum.canceled
                        }, {
                            id: "6",
                            title: "已退款",
                            num: e.mynum.refund
                        } ],
                        selectedId: "0",
                        scroll: !0
                    }
                });
            }, !1, function(a) {
                t.com.alert(a.data.message);
            }));
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
    showimages: function(a) {
        t.com.showimages(a);
    }
}));