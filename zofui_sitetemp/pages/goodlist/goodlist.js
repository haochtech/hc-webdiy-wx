var t = getApp();

Page({
    data: {
        tid: null,
        pageurl: "/zofui_sitetemp/pages/goodlist/goodlist",
        bar: [],
        sets: {
            listprice: 0,
            listtitle: 0
        },
        page: {
            isend: !1,
            doing: !1,
            doo: "goodlist",
            pdata: {
                op: "getlist",
                page: 1,
                actsort: 0,
                otype: 0,
                priceo: !0,
                sorttype: 2,
                sortid: 0,
                isinit: 0,
                plug: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        twosort: null,
        ising: !1,
        pagetype: 0,
        actsort: 0,
        isshowtopsort: !0
    },
    onLoad: function(a) {
        var e = this;
        t.com.comfunc(this), t.com.setBar(e, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, a.tid), e.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0
        }), a.for ? e.setData({
            "page.pdata.for": a.for
        }) : e.setData({
            "page.pdata.sorttype": a.type ? a.type : 2,
            "page.pdata.sortid": a.sid ? a.sid : 0
        }), t.com.getPage(e, e.data.page, 20, function(t) {
            var a = t.data.data;
            e.setData({
                datalist: a.list,
                sets: a.set,
                twosort: a.twosort,
                "page.pdata.isinit": 1
            });
        }, !1, function(a) {
            t.util.message(a.data.message, "", "error");
        }), wx.setNavigationBarTitle({
            title: a.sortname ? a.sortname : a.for ? "搜索:" + a.for : "商品列表"
        });
    },
    onReady: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "分类",
            path: ""
        };
    },
    goodinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        a && wx.navigateTo({
            url: a
        });
    },
    changeSort: function(a) {
        var e = this, o = a.currentTarget.dataset.id;
        if (e.data.ising || o == e.data.actsort) return !1;
        e.data.ising = !0, e.setData({
            "page.pdata.sortid": o,
            "page.pdata.sorttype": 2,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0,
            actsort: o
        }), t.com.getPage(e, e.data.page, 20, function(t) {
            e.setData({
                datalist: t.data.data.list
            });
            for (var a = 0; a < e.data.twosort.length; a++) o != e.data.twosort[a].id || e.data.page.pdata.for || wx.setNavigationBarTitle({
                title: e.data.twosort[a].name
            });
        }), e.data.ising = !1;
    },
    changeorder: function(a) {
        var e = this;
        if (e.data.ising || a.currentTarget.dataset.type < 3 && a.currentTarget.dataset.type == this.data.page.pdata.otype) return !1;
        e.data.ising = !0, 3 == a.currentTarget.dataset.type && e.setData({
            "page.pdata.priceo": !e.data.page.pdata.priceo,
            "page.pdata.otype": a.currentTarget.dataset.type
        }), e.setData({
            "page.pdata.otype": a.currentTarget.dataset.type,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0
        }), t.com.getPage(e, e.data.page, 20, function(t) {
            e.setData({
                datalist: t.data.data.list
            });
        }), e.data.ising = !1;
    },
    onReachBottom: function() {
        var a = this;
        t.com.getPage(a, a.data.page, 20, function(t) {
            a.setData({
                datalist: a.data.datalist.concat(t.data.data.list)
            });
        });
    },
    onPageScroll: function(t) {
        var a = this;
        t.scrollTop >= 80 ? a.setData({
            isshowtopsort: !1
        }) : a.setData({
            isshowtopsort: !0
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
    showimages: function(a) {
        t.com.showimages(a);
    }
});