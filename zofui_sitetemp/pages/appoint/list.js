var t = getApp();

Page(Object.assign({}, t.zan.Tab, {
    data: {
        tid: null,
        pageurl: "/zofui_sitetemp/pages/appoint/list",
        wxuser: null,
        bar: [],
        init: !1,
        sets: null,
        page: {
            isend: !1,
            doing: !1,
            doo: "appoint",
            pdata: {
                op: "list",
                page: 1,
                type: 0,
                initpage: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: [],
        ising: !1
    },
    onLoad: function(a) {
        var o = this;
        t.com.comfunc(this), o.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0,
            "page.pdata.sid": a.sid ? a.sid : 0
        }), t.com.getPage(o, o.data.page, 20, function(t) {
            var a = t.data.data;
            o.setData({
                datalist: a.list,
                "page.pdata.initpage": 1
            });
        }, !1, function(a) {
            t.com.alert(a.data.message);
        }), t.com.setBar(o, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, a.tid), wx.setNavigationBarTitle({
            title: "预约列表"
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "预约列表",
            path: ""
        };
    },
    orderinfo: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        a && wx.navigateTo({
            url: a
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
}));