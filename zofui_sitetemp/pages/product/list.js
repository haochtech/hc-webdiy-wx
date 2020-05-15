var t = getApp();

Page({
    data: {
        tid: null,
        ischeck: !1,
        page: {
            isend: !1,
            doing: !1,
            doo: "product",
            pdata: {
                op: "list",
                page: 1,
                actsort: 0,
                type: 0,
                for: ""
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        bar: {},
        artsort: [],
        ishidesort: 0
    },
    onLoad: function(a) {
        var o = this;
        t.com.comfunc(this), wx.setNavigationBarTitle({
            title: "列表"
        }), o.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0,
            "page.pdata.actsort": a.sid ? a.sid : 0,
            "page.pdata.for": a.for ? a.for : "",
            options: a,
            ishidesort: a.sid ? 1 : 0
        }), t.com.getPage(o, o.data.page, 20, function(t) {
            o.setData({
                datalist: t.data.data.list,
                sets: t.data.data.set,
                artsort: t.data.data.artsort
            });
            for (var e = 0; e < t.data.data.artsort.length; e++) t.data.data.artsort[e].id == a.sid && wx.setNavigationBarTitle({
                title: t.data.data.artsort[e].name
            });
            wx.stopPullDownRefresh();
        }, !1, function(a) {
            t.util.message(a.data.message, "", "error");
        }), t.com.setBar(o, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, a.tid);
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: "列表",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        if (this.data.isdown) return !1;
        this.setData({
            isdown: !0,
            "page.pdata.page": 1
        }), this.onLoad(this.data.options), this.setData({
            isdown: !1
        });
    },
    onReachBottom: function() {
        var a = this;
        t.com.getPage(a, a.data.page, 20, function(t) {
            a.setData({
                datalist: a.data.datalist.concat(t.data.data.list)
            });
        });
    },
    toarticle: function(t) {
        var a = t.currentTarget.dataset.url;
        a && wx.navigateTo({
            url: a
        });
    },
    changeSort: function(a) {
        var o = this, e = a.currentTarget.dataset.id;
        o.setData({
            "page.pdata.actsort": e,
            "page.pdata.page": 1,
            "page.isend": !1,
            "page.waitf": 0,
            "page.nodataf": 0,
            "page.pdata.for": ""
        }), t.com.getPage(o, o.data.page, 20, function(t) {
            o.setData({
                datalist: t.data.data.list
            });
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
});