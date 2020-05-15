function t(t, a, r) {
    return a in t ? Object.defineProperty(t, a, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = r, t;
}

var a = getApp();

Page({
    data: {
        tid: null,
        bar: null,
        ischeck: !1,
        allsort: null,
        sysinfo: {},
        lTop: 0,
        toView: "",
        toViewl: "",
        oldtop: 0,
        isshowtop: !0,
        isrule: !1,
        cart: [],
        cartdata: {
            total: 0,
            num: 0
        },
        actgood: null,
        actsort: 0,
        actrule: null,
        doing: !1,
        anima: !1,
        showcartbox: !1,
        sets: null,
        headtype: "goods",
        bheight: {
            rd: null,
            da: "100%",
            db: "100%"
        },
        deskid: 0,
        desk: null,
        options: null
    },
    onLoad: function(t) {
        var r = this;
        a.com.comfunc(this), r.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : 0,
            deskid: t.scene ? t.scene : 0,
            options: t
        }), a.com.auth(function(t) {
            r.setData({
                wxuser: t.wxInfo
            }), a.com.http("exbuy", "POST", {
                op: "info",
                tid: r.data.tid,
                did: r.data.deskid,
                plug: 0
            }, 0, !1, "", "", function(t) {
                t.data.errno ? a.com.alert(t.data.message) : (r.setData({
                    allsort: t.data.data.allsort,
                    oldsort: t.data.data.allsort,
                    sets: t.data.data.set,
                    desk: r.data.deskid ? t.data.data.desk : null
                }), wx.stopPullDownRefresh());
            });
        }), wx.getSystemInfo({
            success: function(t) {
                var a = t.windowHeight, e = t.windowWidth / 750, o = a - 330 * e, d = a - 190 * e;
                r.setData({
                    "bheight.rd": o,
                    "bheight.da": o,
                    "bheight.db": d
                });
            }
        }), a.com.setBar(r, function(t) {
            wx.setNavigationBarTitle({
                title: t.data[0].name
            }), t.topcolor && t.topbg ? wx.setNavigationBarColor({
                frontColor: t.topcolor,
                backgroundColor: t.topbg
            }) : wx.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: "#ed414a"
            });
        }, t.tid);
    },
    onShareAppMessage: function() {
        return {
            title: "选购",
            path: ""
        };
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    scrollR: function(t) {
        t.detail.scrollTop <= 200 ? this.setData({
            isshowtop: !0,
            "bheight.rd": this.data.bheight.da
        }) : this.setData({
            isshowtop: !1,
            "bheight.rd": this.data.bheight.db
        });
    },
    showrule: function(t) {
        for (var a = this, r = t.currentTarget.dataset.sid, e = t.currentTarget.dataset.gid, o = 0; o < a.data.allsort.length; o++) if (a.data.allsort[o].id == r) {
            var d = a.data.allsort[o].good;
            if (d) for (var i = 0; i < d.length; i++) d[i].id == e && 1 == d[i].isrule && a.setData({
                actgood: d[i],
                actsort: r,
                isrule: !0
            });
        }
    },
    hiderule: function() {
        this.setData({
            isrule: !1,
            actgood: null,
            actsort: 0,
            actrule: null,
            doing: !1
        });
    },
    addgoods: function(a) {
        var r = this;
        if (!r.data.doing) {
            r.data.doing = !0;
            for (var e = a.currentTarget.dataset.sid, o = a.currentTarget.dataset.gid, d = a.currentTarget.dataset.type, i = "add" == d ? 1 : -1, s = 0; s < r.data.allsort.length; s++) if (r.data.allsort[s].id == e) {
                var n = r.data.allsort[s].good;
                if (n) for (var l = 0; l < n.length; l++) if (n[l].id == o) {
                    if (1 == n[l].isrule) console.log(11); else {
                        var u = 0;
                        if ("add" == d && n[l].stock <= n[l].buynum || "minus" == d && n[l].stock <= 0) return r.data.doing = !1, 
                        !1;
                        for (var c = 0; c < r.data.cart.length; c++) if (r.data.cart[c].id == o) if (u = 1, 
                        n[l].buynum + i <= 0) {
                            var g;
                            r.data.cart.splice(c, 1), r.setData((g = {}, t(g, "allsort[" + s + "].good[" + l + "].buynum", 0), 
                            t(g, "cart", r.data.cart), g));
                        } else {
                            var h;
                            r.setData((h = {}, t(h, "allsort[" + s + "].good[" + l + "].buynum", n[l].buynum + i), 
                            t(h, "cart[" + c + "].buynum", n[l].buynum + i), h));
                        }
                        if (0 == u && "add" == d && n[l].stock > 0) {
                            var f, m = "c" + new Date().getTime();
                            r.setData((f = {}, t(f, "allsort[" + s + "].good[" + l + "].buynum", 1), t(f, "cart", r.data.cart.concat(n[l])), 
                            t(f, "cart", r.data.cart.concat({
                                sid: r.data.allsort[s].id,
                                cid: m,
                                id: n[l].id,
                                title: n[l].title,
                                thumb: n[l].thumb,
                                price: n[l].price,
                                stock: n[l].stock,
                                buynum: 1
                            })), f));
                        }
                        r.countCart();
                    }
                    return r.data.doing = !1, !1;
                }
                return r.data.doing = !1, !1;
            }
            r.data.doing = !1;
        }
    },
    changeRule: function(a) {
        for (var r = this, e = a.currentTarget.dataset.id, o = a.currentTarget.dataset.inid, d = 0; d < r.data.allsort.length; d++) if (r.data.allsort[d].id == r.data.actsort) {
            var i = r.data.allsort[d].good;
            if (i) for (var s = 0; s < i.length; s++) if (i[s].id == r.data.actgood.id) {
                for (var n = 0; n < i[s].rulearray.rule.length; n++) if (i[s].rulearray.rule[n].pro.id == e) {
                    var l = "actgood.rulearray.rule[" + n + "].actitem";
                    r.setData(t({}, l, o));
                    for (var u = [], c = 0; c < r.data.actgood.rulearray.rule.length; c++) {
                        var g = r.data.actgood.rulearray.rule[c];
                        g.actitem && u.push(g.actitem);
                    }
                    if (u.length < r.data.actgood.rulearray.rule.length) return !1;
                    for (c = 0; c < i[s].rulearray.rulemap.length; c++) if ((i[s].rulearray.rulemap[c].id + "").split(":").sort().toString() == u.sort().toString()) return r.setData({
                        actrule: i[s].rulearray.rulemap[c]
                    }), !1;
                    return !1;
                }
                return !1;
            }
            return !1;
        }
    },
    addgoodsbyrule: function(a) {
        var r = this;
        if (!r.data.doing) {
            r.data.doing = !0;
            for (var e = a.currentTarget.dataset.type, o = "add" == e ? 1 : -1, d = 0; d < r.data.allsort.length; d++) if (r.data.allsort[d].id == r.data.actsort) {
                var i = r.data.allsort[d].good;
                if (i) for (var s = 0; s < i.length; s++) if (i[s].id == r.data.actgood.id) {
                    for (var n = 0; n < i[s].rulearray.rulemap.length; n++) if (i[s].rulearray.rulemap[n].id == r.data.actrule.id) {
                        var l = i[s].rulearray.rulemap[n], u = 0;
                        if ("add" == e && l.stock <= l.buynum || "minus" == e && l.stock <= 0) return r.data.doing = !1, 
                        !1;
                        for (var c = 0; c < r.data.cart.length; c++) if (r.data.cart[c].ruleid == r.data.actrule.id && r.data.cart[c].id == r.data.actgood.id) if (u = 1, 
                        l.buynum + o <= 0) {
                            var g;
                            r.data.cart.splice(c, 1), r.setData((g = {}, t(g, "allsort[" + d + "].good[" + s + "].rulearray.rulemap[" + n + "].buynum", 0), 
                            t(g, "cart", r.data.cart), t(g, "actrule.buynum", 0), g));
                        } else {
                            var h;
                            r.setData((h = {}, t(h, "allsort[" + d + "].good[" + s + "].rulearray.rulemap[" + n + "].buynum", l.buynum + o), 
                            t(h, "cart[" + c + "].buynum", l.buynum + o), t(h, "actrule.buynum", l.buynum + o), 
                            h));
                        }
                        if (0 == u && "add" == e && l.stock > 0) {
                            var f, m = "c" + new Date().getTime();
                            r.setData((f = {}, t(f, "allsort[" + d + "].good[" + s + "].rulearray.rulemap[" + n + "].buynum", 1), 
                            t(f, "cart", r.data.cart.concat({
                                sid: r.data.allsort[d].id,
                                cid: m,
                                id: i[s].id,
                                title: i[s].title,
                                thumb: i[s].thumb,
                                stock: l.stock,
                                price: l.nowprice,
                                ruleid: l.id,
                                rulename: l.name,
                                buynum: 1
                            })), t(f, "actrule.buynum", 1), f));
                        }
                        r.countCart();
                    }
                    return r.data.doing = !1, !1;
                }
                return r.data.doing = !1, !1;
            }
        }
    },
    addgoodsbycart: function(t) {
        for (var a = this, r = t.currentTarget.dataset.cid, e = (t.currentTarget.dataset.type, 
        0); e < a.data.cart.length; e++) if (a.data.cart[e].cid == r) {
            if (a.data.cart[e].ruleid) {
                for (var o = 0; o < a.data.allsort.length; o++) if (a.data.allsort[o].id == a.data.cart[e].sid) {
                    for (var d = 0; d < a.data.allsort[o].good.length; d++) if (a.data.allsort[o].good[d].id == a.data.cart[e].id) {
                        for (var i = a.data.allsort[o].good[d], s = 0; s < i.rulearray.rulemap.length; s++) if (i.rulearray.rulemap[s].id == a.data.cart[e].ruleid) return a.setData({
                            actsort: a.data.cart[e].sid,
                            actgood: a.data.allsort[o].good[d],
                            actrule: i.rulearray.rulemap[s]
                        }), a.addgoodsbyrule(t), a.setData({
                            isrule: !1,
                            actgood: null,
                            actsort: 0,
                            actrule: null,
                            doing: !1
                        }), a.data.cart.length <= 0 && a.setData({
                            showcartbox: !1
                        }), !1;
                        return !1;
                    }
                    return !1;
                }
            } else t.currentTarget.dataset.sid = a.data.cart[e].sid, t.currentTarget.dataset.gid = a.data.cart[e].id, 
            a.addgoods(t), a.data.cart.length <= 0 && a.setData({
                showcartbox: !1
            });
            return !1;
        }
    },
    togglecart: function() {
        this.setData({
            showcartbox: !this.data.showcartbox
        });
    },
    payit: function() {
        var t = this, r = {
            good: JSON.stringify(this.data.cart),
            op: "buy",
            plug: 0
        };
        a.com.http("exbuy", "POST", r, 0, !0, "", "", function(r) {
            r.data.errno || void 0 === r.data.errno ? a.util.message(r.data.message, "", "error") : (t.setData({
                cart: [],
                allsort: t.data.oldsort
            }), wx.navigateTo({
                url: "/zofui_sitetemp/pages/exconfirm/exconfirm?deskid=" + t.data.deskid + "&tid=" + t.data.tid
            }));
        });
    },
    countCart: function() {
        for (var t = this, a = 0, r = 0, e = 0; e < t.data.cart.length; e++) a += t.data.cart[e].buynum, 
        r += t.data.cart[e].buynum * t.data.cart[e].price;
        t.setData({
            "cartdata.num": 1 * a,
            "cartdata.total": 1 * r.toFixed(2),
            anima: !0
        }), setTimeout(function() {
            t.setData({
                anima: !1
            });
        }, 600);
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
        }), a.setData({
            toView: "gsort_r_item" + t.currentTarget.dataset.id
        });
    },
    changehead: function(t) {
        var a = t.currentTarget.dataset.type;
        this.setData({
            headtype: a
        });
    },
    showshoppic: function(t) {
        var a = t.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.sets.shoppic[a],
            urls: this.data.sets.shoppic
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
    showimages: function(t) {
        a.com.showimages(t);
    }
});