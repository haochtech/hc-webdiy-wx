function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a = getApp();

Page({
    data: {
        page: {
            isend: !1,
            doing: !1,
            doo: "user",
            pdata: {
                op: "address",
                page: 1,
                sid: 0
            },
            waitf: 0,
            nodataf: 0
        },
        datalist: null,
        region: []
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            options: t
        }), e.setData({
            from: t.from ? t.from : 0
        }), a.com.auth(function(t) {
            e.addlist();
        }), a.com.setBar(e, function(t) {
            t.topcolor && t.topbg ? wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }) : wx.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, t.tid), wx.setNavigationBarTitle({
            title: "我的地址"
        });
    },
    addlist: function() {
        var t = this;
        t.setData({
            page: {
                isend: !1,
                doing: !1,
                doo: "user",
                pdata: {
                    op: "address",
                    page: 1,
                    sid: 0
                },
                waitf: 0,
                nodataf: 0
            }
        }), a.com.getPage(t, t.data.page, 0, !1, function(a) {
            t.setData({
                datalist: a.data.data.list
            }, function() {
                t.setData({
                    inited: !0
                }), wx.stopPullDownRefresh();
            });
        }, function(t) {
            a.com.alert(t.data.message);
        });
    },
    onShareAppMessage: function() {
        return {
            title: "我的地址",
            path: ""
        };
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    showadd: function() {
        this.setData({
            actid: 0,
            showadd: !this.data.showadd
        });
    },
    bindRegionChange: function(t) {
        this.setData({
            region: t.detail.value
        });
    },
    bindinput: function(a) {
        var e = a.currentTarget.dataset.type, o = a.detail.value;
        if (1 == e) i = "name";
        if (2 == e) i = "tel";
        if (3 == e) var i = "street";
        this.setData(t({}, i, o));
    },
    sub: function() {
        var t = this, e = {
            op: "addaddress",
            actid: t.data.actid,
            name: t.data.name,
            tel: t.data.tel,
            region: t.data.region,
            street: t.data.street
        };
        a.com.http("user", "POST", e, 0, !0, "", "", function(e) {
            e.data.errno ? a.com.alert(e.data.message) : (t.setData({
                actid: 0,
                name: "",
                tel: "",
                region: [],
                street: "",
                showadd: !1
            }), t.addlist(), a.com.toast(e.data.message));
        });
    },
    edit: function(t) {
        for (var a = this, e = t.currentTarget.dataset.id, o = 0; o < a.data.datalist.length; o++) if (a.data.datalist[o].id == e) {
            if (a.data.datalist[o].params.region) var i = a.data.datalist[o].params.region.split(",");
            a.setData({
                actid: e,
                name: a.data.datalist[o].params.name,
                tel: a.data.datalist[o].params.tel,
                region: i,
                street: a.data.datalist[o].params.street,
                showadd: !0
            });
        }
    },
    delete: function(t) {
        var e = this, o = t.currentTarget.dataset.id;
        a.com.http("user", "POST", {
            id: o,
            op: "deleteadd"
        }, 0, !0, "", "", function(t) {
            if (!t.data.errno) {
                for (var a = 0; a < e.data.datalist.length; a++) e.data.datalist[a].id == o && e.data.datalist.splice(a, 1);
                e.setData({
                    datalist: e.data.datalist
                }), wx.showToast({
                    title: "已删除",
                    icon: "success",
                    duration: 1e3
                });
            }
        });
    },
    toact: function(t) {
        var e = this, o = t.currentTarget.dataset.id;
        a.com.http("user", "POST", {
            id: o,
            op: "toactadd"
        }, 0, !0, "", "", function(t) {
            t.data.errno || (wx.showToast({
                title: "已保存",
                icon: "success",
                duration: 1e3
            }), e.addlist());
        });
    },
    wxadd: function() {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                t.setData({
                    actid: 0,
                    name: a.userName,
                    tel: a.telNumber,
                    region: a.provinceName + "," + a.cityName + "," + a.countyName,
                    street: a.detailInfo,
                    showadd: !1
                }), t.sub();
            }
        });
    },
    useadd: function(t) {
        for (var a = this, e = t.currentTarget.dataset.id, o = 0; o < a.data.datalist.length; o++) if (a.data.datalist[o].id == e) {
            var i = getCurrentPages();
            i[i.length - 2].setData({
                address: a.data.datalist[o].params
            }), wx.navigateBack();
        }
    },
    location: function(t) {
        a.com.location(t);
    },
    otherapp: function(t) {
        a.com.otherapp(t);
    },
    navigateto: function(t) {
        a.com.navigateto(t);
    },
    redirectto: function(t) {
        a.com.redirectto(t);
    },
    callphone: function(t) {
        a.com.callphone(t);
    }
});