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
        pageurl: "/zofui_sitetemp/pages/card/list",
        bar: [],
        tab: {
            list: [ {
                id: "0",
                title: "全部"
            }, {
                id: "1",
                title: "代金券"
            }, {
                id: "2",
                title: "折扣券"
            } ],
            selectedId: "0",
            scroll: !1
        },
        page: {
            isend: !1,
            doing: !1,
            doo: "card",
            pdata: {
                op: "list",
                page: 1,
                type: 0,
                usetype: 0,
                initpage: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        wxuser: null
    },
    onLoad: function(t) {
        var e = this;
        a.com.comfunc(this), e.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0,
            from: t.from ? t.from : 0,
            "page.pdata.usetype": void 0 == t.type ? 0 : t.type
        }), a.com.auth(function(t) {
            e.setData({
                wxuser: t.wxInfo
            }), a.com.getPage(e, e.data.page, 20, function(t) {
                var a = t.data.data;
                e.setData({
                    datalist: a.list,
                    init: !0,
                    sets: a.set,
                    "page.pdata.initpage": 1
                });
            }, !1, function(t) {
                a.com.alert(t.data.message);
            });
        }), a.com.setBar(e, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }), e.setData({
                "tab.color": t.maincolor
            });
        }, t.tid), wx.setNavigationBarTitle({
            title: "优惠券"
        });
    },
    onShareAppMessage: function() {
        return 1 != this.data.card.isshare && {
            title: "优惠券",
            path: "",
            imageUrl: ""
        };
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
            });
        }), i.data.ising = !1;
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
    }
}));