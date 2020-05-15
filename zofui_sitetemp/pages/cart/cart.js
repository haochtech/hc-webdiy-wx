function t(t, a, r) {
    return a in t ? Object.defineProperty(t, a, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = r, t;
}

var a = getApp();

Page(Object.assign({}, a.zan.Quantity, {
    data: {
        tid: null,
        pageurl: "/zofui_sitetemp/pages/cart/cart",
        wxuser: null,
        iseditcart: !1,
        cartarr: [],
        allchecked: !1,
        allmoney: 0,
        allnum: 0,
        bar: null,
        bottom: 40,
        options: null
    },
    onLoad: function(t) {
        var r = this;
        a.com.comfunc(this), r.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0,
            options: t
        }), a.com.auth(function(t) {
            r.setData({
                wxuser: t.wxInfo
            }), a.com.http("cart", "POST", {
                op: "info"
            }, 0, !1, function(t) {
                t.data.errno || (r.setData({
                    cartarr: t.data.data.cart
                }), wx.createSelectorQuery().select(".footer_in").boundingClientRect(function(t) {
                    var a = t ? t.height : -1;
                    r.setData({
                        bottom: a + 1
                    });
                }).exec(), wx.stopPullDownRefresh());
            });
        }), a.com.setBar(r, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            });
        }, t.tid), wx.setNavigationBarTitle({
            title: "购物车"
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.article.title,
            path: "",
            imageUrl: t.data.article.img
        };
    },
    editcart: function() {
        this.setData({
            iseditcart: !this.data.iseditcart
        });
    },
    handleZanQuantityChange: function(a) {
        var r = this, e = a.componentId, o = a.quantity;
        r.setData(t({}, e + ".quantity", o)), r.count();
    },
    checkitem: function(a) {
        for (var r = this, e = a.currentTarget.dataset.id, o = 0; o < r.data.cartarr.length; o++) if (r.data.cartarr[o].id == e) {
            var i = !r.data.cartarr[o].fail && !r.data.cartarr[o].checked;
            r.setData(t({}, "cartarr[" + o + "].checked", i));
        }
        r.count();
    },
    deleteitem: function(t) {
        var r = this, e = t.currentTarget.dataset.id, o = {
            id: e,
            op: "delete"
        };
        a.com.http("cart", "POST", o, 0, !0, "", "", function(t) {
            if (t.data.errno) a.util.message(t.data.message, "", "error"); else for (var o = 0; o < r.data.cartarr.length; o++) if (r.data.cartarr[o].id == e) return r.data.cartarr.splice(o, 1), 
            r.setData({
                cartarr: r.data.cartarr
            }), a.com.toast("已删除"), !1;
        }), r.count();
    },
    checkall: function(a) {
        var r = this;
        r.setData({
            allchecked: !r.data.allchecked
        });
        for (var e = 0; e < r.data.cartarr.length; e++) r.data.cartarr[e].fail || r.setData(t({}, "cartarr[" + e + "].checked", r.data.allchecked));
        r.count();
    },
    count: function() {
        for (var t = this, a = 0, r = 0, e = 0; e < t.data.cartarr.length; e++) !t.data.cartarr[e].fail && t.data.cartarr[e].checked && (a += 1 * t.data.cartarr[e].quantity.quantity, 
        r += t.data.cartarr[e].quantity.quantity * t.data.cartarr[e].price * 1);
        t.setData({
            allnum: a,
            allmoney: 1 * r.toFixed(2)
        });
    },
    back: function() {
        getCurrentPages().length <= 1 ? wx.redirectTo({
            url: "/zofui_sitetemp/pages/page/page"
        }) : wx.navigateBack({
            delta: 1
        });
    },
    togood: function(t) {
        var a = t.currentTarget.dataset.url + (this.data.tid ? "&tid=" + this.data.tid : "");
        wx.navigateTo({
            url: a
        });
    },
    deleteall: function() {
        var t = this;
        a.com.confirm("确定要清空所有商品吗？", function() {
            a.com.http("cart", "POST", {
                op: "deleteall"
            }, 0, !0, "", "", function(r) {
                r.data.errno ? a.util.message(r.data.message, "", "error") : (t.setData({
                    cartarr: []
                }), a.com.toast("已清空"));
            });
        });
    },
    buy: function(t) {
        for (var r = this, e = [], o = 0; o < r.data.cartarr.length; o++) if (r.data.cartarr[o].checked) {
            var i = r.data.cartarr[o], c = {
                gid: i.gid,
                cartid: i.id,
                num: i.quantity.quantity,
                map: i.ruleid
            };
            e.push(c);
        }
        if (e.length < 1) return a.com.alert("还没选择商品"), !1;
        var n = {
            good: JSON.stringify(e),
            op: "buy"
        };
        a.com.http("good", "POST", n, 0, !0, "", "", function(t) {
            t.data.errno ? a.com.alert(t.data.message) : wx.navigateTo({
                url: "/zofui_sitetemp/pages/confirm/confirm?tid=" + r.data.tid
            });
        });
    },
    onPullDownRefresh: function() {
        a.com.pullDown(this);
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
    showimages: function(t) {
        a.com.showimages(t);
    }
}));