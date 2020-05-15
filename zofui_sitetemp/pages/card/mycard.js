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
        pageurl: "/zofui_sitetemp/pages/card/mycard",
        bar: [],
        tab: {
            list: [ {
                id: "0",
                title: "未使用"
            }, {
                id: "1",
                title: "已使用"
            }, {
                id: "2",
                title: "已过期"
            } ],
            selectedId: "0",
            scroll: !1
        },
        page: {
            isend: !1,
            doing: !1,
            doo: "card",
            pdata: {
                op: "mycard",
                page: 1,
                type: 0,
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
        a.com.comfunc(this), t.cid = t.cid ? t.cid : t.scene ? t.scene : 0, e.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            from: t.from ? t.from : null
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
            title: "我的卡券"
        });
    },
    onShareAppMessage: function() {
        return 1 != this.data.card.isshare && {
            title: "我的卡券",
            path: "",
            imageUrl: ""
        };
    },
    getcard: function() {
        var t = this;
        if (2 == t.data.status || 3 == t.data.status && t.data.card.usetype > 0) return !1;
        1 == t.data.status ? a.com.http("card", "POST", {
            cid: t.data.card.id,
            op: "getcard"
        }, 0, !0, "", "", function(e) {
            e.data.errno ? a.com.alert(e.data.message) : (a.com.toast("已领取"), t.setData({
                status: 3,
                cardlogid: e.data.data
            }));
        }) : 3 == t.data.status && (t.toggleRightPopup(), t.setData({
            qrcode: a.com.murl("img", {
                op: "hexiaocard",
                cid: t.data.cardlogid,
                m: "zofui_sitetemp"
            })
        }));
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
            });
        }), o.data.ising = !1;
    },
    onReachBottom: function() {
        var t = this;
        console.log(111), a.com.getPage(t, t.data.page, 20, function(a) {
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