function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a = getApp();

Page(Object.assign({}, a.zan.Quantity, {
    data: {
        pageurl: "/zofui_sitetemp/pages/good/good",
        swiperheight: 320,
        good: null,
        showbuy: !1,
        showtype: "",
        quantity: {
            quantity: 1,
            min: 1,
            max: 1
        },
        rule: [],
        rulemap: [],
        actmap: "",
        wxuser: null,
        sets: null,
        showicon: !1,
        from: null,
        animation: "",
        gstyle: null,
        options: null
    },
    onLoad: function(e) {
        var o = this;
        a.com.comfunc(this), e.gid = e.gid ? e.gid : e.scene ? e.scene : 0, o.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: e.tid ? e.tid : null,
            from: e.from ? e.from : null,
            options: e
        }), a.com.auth(function(i) {
            o.setData({
                wxuser: i.wxInfo
            }), a.com.http("good", "POST", {
                gid: e.gid,
                op: "info"
            }, 0, !1, "", "", function(i) {
                i.data.errno ? a.com.alert(i.data.message) : (o.setData({
                    good: i.data.data.good,
                    "quantity.max": i.data.data.good.stock,
                    rule: i.data.data.good.rulearray.rule,
                    rulemap: i.data.data.good.rulearray.rulemap,
                    pageurl: "/zofui_sitetemp/pages/good/good?gid=" + e.gid,
                    sets: i.data.data.set
                }), require("../../resource/wxParse/wxParse.js").wxParse("good.content", "html", i.data.data.good.content, o, 0), 
                wx.setNavigationBarTitle({
                    title: i.data.data.good.title
                }), i.data.data.good.vurl && a.com.http("gettenvedio", "POST", {
                    url: i.data.data.good.vurl
                }, 0, !1, function(a) {
                    if (!i.data.message.errno) {
                        o.setData(t({}, "good.parsevurl", a.data.message));
                    }
                }), wx.stopPullDownRefresh());
            });
        }), a.com.setBar(o, function(t) {
            t.topcolor && t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor ? t.topcolor : "#ffffff",
                backgroundColor: t.topbg
            });
        }, e.tid);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.good.title,
            path: "",
            imageUrl: t.data.good.img
        };
    },
    botact: function(t) {
        var a = t.currentTarget.dataset.type;
        if ("index" == a) {
            e = "/zofui_sitetemp/pages/page/page" + (this.data.tid ? "?scene=" + this.data.tid : "");
            wx.redirectTo({
                url: e
            });
        } else if ("cart" == a) {
            var e = "/zofui_sitetemp/pages/cart/cart" + (this.data.tid ? "?tid=" + this.data.tid : "");
            wx.navigateTo({
                url: e
            });
        } else "joincart" == a ? this.setData({
            showbuy: !this.data.showbuy,
            showtype: "cart",
            animation: "anipage"
        }) : "buy" == a && this.setData({
            showbuy: !this.data.showbuy,
            showtype: "buy",
            animation: "anipage"
        });
    },
    togglebuy: function() {
        this.setData({
            showbuy: !this.data.showbuy,
            animation: "backpage"
        });
    },
    toggleicon: function() {
        this.setData({
            showicon: !this.data.showicon,
            animation: "backpage"
        });
    },
    handleZanQuantityChange: function(a) {
        var e = a.componentId, o = a.quantity;
        this.setData(t({}, e + ".quantity", o));
    },
    changeRule: function(a) {
        for (var e = 0; e < this.data.rule.length; e++) if (this.data.rule[e].pro.id == a.currentTarget.dataset.oid) {
            var o = "rule[" + e + "].actitem";
            this.setData(t({}, o, a.currentTarget.dataset.tid));
            for (var i = [], r = 0; r < this.data.rule.length; r++) this.data.rule[r].actitem && i.push(this.data.rule[r].actitem);
            if (i.length < this.data.rule.length) return !1;
            for (r = 0; r < this.data.rulemap.length; r++) if ((this.data.rulemap[r].id + "").split(":").sort().toString() == i.sort().toString()) return this.setData({
                "good.stock": this.data.rulemap[r].stock,
                "good.price": this.data.rulemap[r].nowprice,
                "quantity.max": this.data.rulemap[r].stock,
                "quantity.quantity": 1,
                actmap: this.data.rulemap[r].id
            }), !1;
            return !1;
        }
    },
    confirmbuy: function(t) {
        var e = this;
        if (1 == e.data.good.isrule) for (var o = 0; o < e.data.rule.length; o++) if (!e.data.rule[o].actitem || void 0 === e.data.rule[o].actitem) return a.util.message("请选择规格", "", "error"), 
        !1;
        if ("buy" == t.currentTarget.dataset.type) {
            i = {
                good: JSON.stringify([ {
                    gid: e.data.good.id,
                    num: e.data.quantity.quantity,
                    map: e.data.actmap
                } ]),
                op: "buy"
            };
            a.com.http("good", "POST", i, 0, !0, "", "", function(t) {
                t.data.errno || void 0 === t.data.errno ? a.util.message(t.data.message, "", "error") : wx.navigateTo({
                    url: "/zofui_sitetemp/pages/confirm/confirm?tid=" + e.data.tid
                });
            });
        } else if ("cart" == t.currentTarget.dataset.type) {
            var i = {
                gid: e.data.good.id,
                num: e.data.quantity.quantity,
                map: e.data.actmap,
                op: "cart"
            };
            a.com.http("good", "POST", i, 0, !0, "", "", function(t) {
                t.data.errno ? a.util.message(t.data.message, "", "error") : (e.setData({
                    showbuy: !e.data.showbuy,
                    animation: "backpage"
                }), a.com.toast(t.data.message));
            });
        }
    },
    imageLoad: function(t) {
        var a = this, e = t.detail.width, o = t.detail.height, i = 1;
        wx.getSystemInfo({
            success: function(t) {
                i = t.windowWidth / e;
            }
        });
        var r = o * i;
        a.setData({
            swiperheight: r
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
    showkefuimg: function(t) {
        a.com.alert("长按图片识别二维码联系客服", function() {
            wx.previewImage({
                current: t.currentTarget.dataset.img,
                urls: [ t.currentTarget.dataset.img ]
            });
        });
    }
}));