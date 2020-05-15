var t = getApp();

Page({
    data: {
        tid: null,
        pageurl: "/zofui_sitetemp/pages/gsort/gsort",
        sets: {
            sorttype: 0
        },
        ischeck: !1,
        allsort: null,
        bar: [],
        actsort: 0,
        sysinfo: {},
        lTop: 0,
        toView: "",
        searchhist: [],
        searchfocus: !1,
        for: "",
        rarr: []
    },
    onLoad: function(a) {
        var o = this;
        t.com.comfunc(this), o.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : 0
        }), t.com.http("sort", "POST", {
            op: "gsort",
            tid: o.data.tid,
            plug: 0
        }, 30, !1, function(t) {
            t.data.errno || o.setData({
                allsort: t.data.data.allsort,
                sets: t.data.data.set
            });
        });
        var e = wx.getStorageSync("zofui_searchhist");
        e && t.com.isArr(e) && o.setData({
            searchhist: e
        }), t.com.setBar(o, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, a.tid), wx.setNavigationBarTitle({
            title: "分类"
        });
    },
    onReady: function() {},
    onShareAppMessage: function() {
        return {
            title: "分类",
            path: ""
        };
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    toarticle: function(t) {
        var a = t.currentTarget.dataset.url;
        a && wx.navigateTo({
            url: a
        });
    },
    togoodlist: function(t) {
        var a = t.currentTarget.dataset.type, o = t.currentTarget.dataset.name, e = this.data.tid ? "&tid=" + this.data.tid : "";
        wx.navigateTo({
            url: "/zofui_sitetemp/pages/goodlist/goodlist?sid=" + t.currentTarget.dataset.id + "&type=" + a + "&sortname=" + o + e
        });
    },
    changeSort: function(t) {
        var a = this;
        if (t.currentTarget.dataset.id == a.data.actsort) return !1;
        a.sysinfo || wx.getSystemInfo({
            success: function(t) {
                a.setData({
                    sysinfo: t
                });
            }
        }), a.setData({
            actsort: t.currentTarget.dataset.id
        }), a.data.sysinfo.windowHeight - t.detail.y <= 150 ? a.setData({
            lTop: t.detail.y + 50
        }) : t.detail.y <= 150 && a.setData({
            lTop: t.detail.y - 100
        }), a.setData({
            toView: "gsort_r_item" + t.currentTarget.dataset.id
        });
    },
    addhist: function(a) {
        t.com.addhist(this, a, 0);
    },
    clearhist: function() {
        t.com.clearhist(this, 0);
    },
    searchinput: function(t) {
        this.setData({
            for: t.detail.value
        });
    },
    tosearch: function() {
        t.com.tosearch(this, 0);
    },
    tosearchhist: function(a) {
        t.com.tosearchhist(this, 0);
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