var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = {};

e.murl = function(t, e) {
    return e && (e.m = "zofui_sitetemp"), this.url("entry/wxapp/" + t, e);
}, e.url = function(e, a) {
    var n = getApp(), o = n.siteInfo.siteroot + "?i=" + n.siteInfo.uniacid + "&t=" + n.siteInfo.multiid + "&v=" + n.siteInfo.version + "&from=wxapp&";
    if (e && ((e = e.split("/"))[0] && (o += "c=" + e[0] + "&"), e[1] && (o += "a=" + e[1] + "&"), 
    e[2] && (o += "do=" + e[2] + "&")), a && "object" === (void 0 === a ? "undefined" : t(a))) for (var i in a) i && a.hasOwnProperty(i) && a[i] && (o += i + "=" + a[i] + "&");
    return o;
}, e.http = function(t, e, a, n, o, i, r, s) {
    var u = getApp(), n = "http://127.0.0.6/app/index.php" == u.siteInfo.siteroot ? 0 : n;
    u.util.request({
        url: u.com.murl(t),
        method: e,
        cachetime: n || 0,
        data: a,
        showLoading: !!o,
        success: function(t) {
            i && 41009 != t.data.errno && i(t);
        },
        complete: function(t) {
            s && 41009 != t.data.errno && s(t);
        },
        fail: function(t) {
            r && r(t);
        }
    });
}, e.auth = function(t, e) {
    var a = this;
    a.getUserInfo(function(a) {
        e && (!a.wxInfo || !a.wxInfo.nickname && a.wxInfo.headimgurl) && e.setData({
            showuserbtn: !0
        }), t && t(a);
    }, function(e) {
        a.toAuth(t);
    });
}, e.toAuth = function(t) {
    var e = this;
    wx.showModal({
        title: "提示",
        content: "请允许使用您的用户信息",
        showCancel: !1,
        complete: function() {
            wx.openSetting({
                success: function(a) {
                    a.authSetting["scope.userInfo"] ? e.auth(t) : e.toAuth(t);
                }
            });
        }
    });
}, e.getUserInfo = function(t, e, a) {
    var n = getApp(), o = function() {
        wx.login({
            success: function(e) {
                n.util.getWe7User(function(e) {
                    e.memberInfo && e.memberInfo.nickname && (e.wxInfo = e.memberInfo), a ? n.util.upadteUser(a, function(e) {
                        "function" == typeof t && t(e);
                    }) : (wx.canIUse("getUserInfo") && !e.memberInfo && e.wxInfo, "function" == typeof t && t(e));
                }, e.code);
            },
            fail: function() {
                wx.showModal({
                    title: "获取信息失败",
                    content: "请允许授权以便为您提供服务",
                    success: function(t) {
                        t.confirm && n.util.getUserInfo();
                    }
                });
            }
        });
    }, i = wx.getStorageSync("userInfo") || {};
    if (i.sessionid) {
        if (!i.wxInfo && !i.memberInfo) return void o();
        if (i.memberInfo && i.memberInfo.nickname && (i.wxInfo = i.memberInfo), i.wxInfo && !a) return void ("function" == typeof t && t(i));
        n.util.checkSession({
            success: function() {
                a ? n.util.upadteUser(a, function(e) {
                    "function" == typeof t && t(e);
                }) : "function" == typeof t && t(i);
            },
            fail: function() {
                i.sessionid = "", wx.removeStorageSync("userInfo"), o();
            }
        });
    } else o();
}, e.getPage = function(t, e, a, n, o, i) {
    if (e.doing || e.isend) return !1;
    t.setData({
        doing: !0,
        "page.nodataf": 0,
        "page.waitf": 1
    }), this.http(e.doo ? e.doo : "pagelist", "GET", e.pdata, a, !1, function(a) {
        a.data.data.list.length > 0 ? e.pdata.page++ : (e.isend = !0, t.setData({
            "page.nodataf": 1
        })), n && n(a);
    }, function(t) {
        i && i(t);
    }, function(e) {
        o && o(e), t.setData({
            doing: !1,
            "page.waitf": 0
        });
    });
}, e.setBar = function(t, e, a) {
    var n = a || "", o = wx.getStorageSync("botbar" + n), i = new Date().getTime() / 1e3;
    void 0 === o.data || o.length <= 0 || o.expiretime <= i || "" == o.data ? this.http("ajax", "get", {
        op: "bar",
        temp: n
    }, 30, !1, function(a) {
        a.data.data.bar && (o = {
            expiretime: i + 60,
            data: a.data.data.bar
        }, wx.setStorageSync("botbar" + n, o), t.setData({
            bar: o.data.data
        }), e && e(o.data.data));
    }) : (t.setData({
        bar: o.data.data
    }), e && e(o.data.data));
}, e.getSet = function() {
    var t = wx.getStorageSync("set"), e = new Date().getTime() / 1e3;
    return (void 0 === t || "" == t || t.data.length <= 0 || t._expiretime <= e) && this.http("ajax", "get", {
        op: "set"
    }, 30, !1, function(a) {
        a.data.data ? (t = {
            _expiretime: e + 60,
            data: a.data.data
        }, wx.setStorageSync("set", t)) : t = {};
    }), t.data;
}, e.location = function(t) {
    wx.openLocation({
        latitude: parseFloat(t.currentTarget.dataset.lat),
        longitude: parseFloat(t.currentTarget.dataset.lng),
        name: t.currentTarget.dataset.addname,
        address: t.currentTarget.dataset.address,
        scale: 13
    });
}, e.otherapp = function(t) {
    wx.navigateToMiniProgram({
        appId: t.currentTarget.dataset.appid,
        path: t.currentTarget.dataset.appurl,
        success: function() {
            console.log("tosuc");
        },
        fail: function(t) {
            getApp().util.message("打开页面失败", "", "error");
        }
    });
}, e.navigateto = function(t, e) {
    if (t.currentTarget.dataset.url) {
        var a = t.currentTarget.dataset.url;
        e && a.indexOf("tid=") < 0 && (a.indexOf("?") >= 0 ? a += "&tid=" + e : a += "?tid=" + e), 
        wx.navigateTo({
            url: a
        });
    }
}, e.redirectto = function(t, e) {
    if (t.currentTarget.dataset.url) {
        var a = t.currentTarget.dataset.url;
        e && a.indexOf("tid=") < 0 && (a.indexOf("?") >= 0 ? a += "&tid=" + e : a += "?tid=" + e), 
        wx.redirectTo({
            url: a
        });
    }
}, e.callphone = function(t) {
    var e = t.currentTarget.dataset.tel;
    e && wx.makePhoneCall({
        phoneNumber: e
    });
}, e.copy = function(t) {
    var e = this, a = t.currentTarget.dataset.text;
    a && wx.setClipboardData({
        data: a,
        success: function() {
            e.toast("已复制内容");
        }
    });
}, e.toweburl = function(t, e) {
    var a = encodeURIComponent(t.currentTarget.dataset.weburl);
    wx.navigateTo({
        url: "/zofui_sitetemp/pages/webview/webview?url=" + a + "&pid=" + e.data.pageid
    });
}, e.showimages = function(t) {
    for (var e = [], a = 0; a < t.currentTarget.dataset.img.length; a++) e.push(t.currentTarget.dataset.img[a].url);
    wx.previewImage({
        urls: e
    });
}, e.pullDown = function(t) {
    if (t.data.isdown) return !1;
    t.setData({
        isdown: !0
    }), t.onLoad(t.data.options), t.setData({
        isdown: !1
    });
}, e.isArr = function(t) {
    return "[object Array]" === Object.prototype.toString.call(t);
}, e.toast = function(t, e, a) {
    wx.showToast({
        title: t,
        icon: e || "success",
        duration: 1500,
        mask: !0,
        complete: function() {
            a && setTimeout(function() {
                a();
            }, 1e3);
        }
    });
}, e.alert = function(t, e, a) {
    wx.showModal({
        title: "提示",
        content: t,
        showCancel: !1,
        success: function(t) {
            t.confirm ? e && e(t) : t.cancel && a && a(t);
        }
    });
}, e.confirm = function(t, e, a) {
    wx.showModal({
        title: "提示",
        content: t,
        success: function(t) {
            t.confirm ? e && e(t) : t.cancel && a && a(t);
        }
    });
}, e.verify = function(t, e, a) {
    if ("number" == t) {
        if ("int" == e) n = /^[1-9]*[1-9][0-9]*$/; else if ("intAndLetter" == e) n = /^[A-Za-z0-9]*$/; else if ("money" == e) var n = /^\d+\.?\d{0,2}$/;
        return n.test(a);
    }
    return "mobile" == t ? (n = /^1[3|4|5|7|8]\d{9}$/).test(e) : "cn" == t ? (n = /^[\u2E80-\u9FFF]+$/).test(e) : void 0;
}, e.clearhist = function(t, e) {
    wx.removeStorage({
        key: "zofui_searchhist" + e
    }), t.setData({
        searchhist: []
    });
}, e.addhist = function(t, e, a) {
    if (t.data.searchhist.indexOf(e) >= 0) return !1;
    t.data.searchhist.unshift(e), t.data.searchhist.length >= 10 && t.data.searchhist.splice(10, t.data.searchhist.length), 
    wx.setStorageSync("zofui_searchhist" + a, t.data.searchhist), t.setData({
        searchhist: t.data.searchhist
    });
}, e.tosearchhist = function(t, e) {
    var a = "/zofui_sitetemp/pages/goodlist/goodlist?for=" + t.data.for;
    1 == e && (a = "/zofui_sitetemp/pages/deskorder/goodlist?for=" + t.data.for), wx.navigateTo({
        url: a
    });
}, e.tosearch = function(t, e) {
    if (!t.data.for) return !1;
    t.addhist(t.data.for, e);
    var a = "/zofui_sitetemp/pages/goodlist/goodlist?for=" + t.data.for;
    1 == e && (a = "/zofui_sitetemp/pages/deskorder/goodlist?for=" + t.data.for), wx.navigateTo({
        url: a
    });
}, e.getUrl = function() {
    var t = getCurrentPages();
    return t[t.length - 1].route;
}, e.getUrlArgs = function() {
    var t = getCurrentPages(), e = t[t.length - 1], a = e.route, n = e.options, o = a + "?";
    for (var i in n) o += i + "=" + n[i] + "&";
    return o = o.substring(0, o.length - 1);
}, e.theRequest = function(t) {
    var e = {};
    if (-1 != t.indexOf("?")) for (var a = t.split("?")[1].split("&"), n = 0; n < a.length; n++) e[a[n].split("=")[0]] = unescape(a[n].split("=")[1]);
    return e;
}, e.comfunc = function(t) {}, module.exports = e;