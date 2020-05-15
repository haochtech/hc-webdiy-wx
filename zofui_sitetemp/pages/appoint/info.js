function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a = getApp();

Page(Object.assign({}, {
    data: {
        wxuser: null,
        appoint: null,
        initapp: null,
        doing: !1,
        tel: null,
        options: null,
        actttime: "",
        showtimebox: !1,
        actleft: ""
    },
    onLoad: function(t) {
        var e = this;
        a.com.comfunc(this), e.setData({
            pageurl: "/" + a.com.getUrlArgs(),
            tid: t.tid ? t.tid : null,
            options: t
        }), a.com.auth(function(i) {
            e.setData({
                wxuser: i.wxInfo
            }), a.com.http("appoint", "POST", {
                aid: t.aid,
                op: "info"
            }, 0, !1, "", "", function(t) {
                t.data.errno ? a.com.alert(t.data.message) : (e.setData({
                    appoint: t.data.data.appoint,
                    initapp: t.data.data.appoint,
                    sets: t.data.data.set
                }), require("../../resource/wxParse/wxParse.js").wxParse("appoint.contenta", "html", t.data.data.appoint.content, e, 0), 
                wx.setNavigationBarTitle({
                    title: t.data.data.appoint.name
                })), wx.stopPullDownRefresh();
            });
        }), a.com.setBar(e, function(t) {
            t.topbg && wx.setNavigationBarColor({
                frontColor: t.topcolor ? t.topcolor : "#ffffff",
                backgroundColor: t.topbg
            });
        }, t.tid);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.appoint.name,
            path: "",
            imageUrl: t.data.appoint.thumb
        };
    },
    bindformChange: function(a) {
        for (var e = this, i = e.data.appoint.form, o = 0; o < i.length; o++) if (i[o].id == a.currentTarget.dataset.i) {
            var n = "appoint.form[" + o + "].value";
            if ("date" == a.currentTarget.dataset.type ? n = "appoint.form[" + o + "].value.date" : "time" == a.currentTarget.dataset.type && (n = "appoint.form[" + o + "].value.time"), 
            e.setData(t({}, n, a.detail.value)), "multi" == a.currentTarget.dataset.type) for (var r = 0; r < i[o].sitem.length; r++) {
                for (var c = !1, d = 0; d < a.detail.value.length; d++) i[o].sitem[r] == a.detail.value[d] && (c = !0);
                e.setData(t({}, "appoint.form[" + o + "].ischecked[" + r + "]", c));
            }
            return !1;
        }
    },
    subit: function(t) {
        var e = this, i = {
            op: "sub",
            aid: e.data.appoint.id,
            tel: e.data.tel,
            actttime: e.data.actttime,
            actleft: e.data.actleft,
            actrs: e.data.actrs,
            actre: e.data.actre
        };
        if (1 == e.data.appoint.istel && !e.data.tel) return a.com.alert("请填写手机号码"), !1;
        for (var o in t.detail.value) for (var n = 0; n < e.data.appoint.form.length; n++) if (o == e.data.appoint.form[n].id) {
            if (t.detail.value[o].length <= 0) return a.com.alert("请填写" + e.data.appoint.form[n].name), 
            !1;
            "time" == e.data.appoint.form[n].type && (t.detail.value[o] = e.data.appoint.form[n].value.date + " " + e.data.appoint.form[n].value.time);
        }
        if (i.form = JSON.stringify(t.detail.value), e.data.doing) return !1;
        e.data.doing = !0, a.com.http("appoint", "POST", i, 0, !0, "", "", function(t) {
            t.data.errno || void 0 === t.data.errno ? (a.com.alert(t.data.message), e.data.doing = !1) : t.data.data.nonceStr ? wx.requestPayment({
                timeStamp: t.data.data.timeStamp,
                nonceStr: t.data.data.nonceStr,
                package: t.data.data.package,
                signType: "MD5",
                paySign: t.data.data.paySign,
                success: function(i) {
                    "requestPayment:ok" == i.errMsg && a.com.toast("支付完成", "success", function() {
                        wx.navigateTo({
                            url: "/zofui_sitetemp/pages/appoint/orderinfo?oid=" + t.data.data.orderid
                        }), e.data.doing = !1;
                    });
                },
                fail: function(t) {
                    console.log("失败");
                },
                cancel: function() {
                    e.data.doing = !1;
                }
            }) : a.com.toast("已提交", "success", function() {
                e.setData({
                    appoint: e.data.initapp
                }), wx.navigateTo({
                    url: "/zofui_sitetemp/pages/appoint/orderinfo?oid=" + t.data.data.orderid,
                    complete: function() {
                        setTimeout(function() {
                            e.data.doing = !1;
                        }, 3e3);
                    }
                });
            });
        });
    },
    imageLoad: function(t) {
        var a = this, e = t.detail.width, i = t.detail.height, o = 1;
        wx.getSystemInfo({
            success: function(t) {
                o = t.windowWidth / e;
            }
        });
        var n = i * o;
        a.setData({
            swiperheight: n
        });
    },
    getPhoneNumber: function(t) {
        var e = this;
        if ("getPhoneNumber:ok" == t.detail.errMsg) {
            var i = {
                iv: t.detail.iv,
                encryptedData: t.detail.encryptedData,
                op: "encrypt"
            };
            a.com.http("appoint", "POST", i, 0, !1, "", "", function(t) {
                t.data.errno ? a.com.alert(t.data.message) : e.setData({
                    tel: t.data.data
                });
            });
        } else a.com.alert("请允许授权");
    },
    selecttime: function() {
        var t = this;
        t.setData({
            showtimebox: !t.data.showtimebox
        });
    },
    actttime: function(t) {
        var a = this, e = t.currentTarget.dataset.time;
        a.setData({
            actttime: e,
            showtimebox: !a.data.showtimebox
        });
    },
    changeleft: function(t) {
        var a = this, e = t.currentTarget.dataset.d;
        a.setData({
            actleft: e,
            actrs: "",
            actre: ""
        });
    },
    changeright: function(t) {
        var a = this, e = t.currentTarget.dataset.start, i = t.currentTarget.dataset.end, o = t.currentTarget.dataset.d;
        a.setData({
            actrs: e,
            actre: i,
            actleft: o,
            showtimebox: !a.data.showtimebox
        });
    },
    default: function() {},
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
    },
    showimages: function(t) {
        a.com.showimages(t);
    },
    uploadimg: function(e) {
        var i = this, o = e.currentTarget.dataset.item.upimgar ? e.currentTarget.dataset.item.upimgar : [], n = o.length, r = (e.currentTarget.dataset.item.maxnum > 0 ? e.currentTarget.dataset.item.maxnum : 1) - n;
        if (r <= 0) return a.com.alert("图片数量已经很多了，不能再上传，可点击图片删除"), !1;
        i.chooseimg(r, function(a) {
            for (var n = i.data.appoint.form, r = 0; r < n.length; r++) if (n[r].id == e.currentTarget.dataset.id) {
                var c, d = "appoint.form[" + r + "].upimgar", s = "appoint.form[" + r + "].upimgarstr";
                return i.setData((c = {}, t(c, d, o.concat(a)), t(c, s, JSON.stringify(o.concat(a))), 
                c)), !1;
            }
        });
    },
    deleteImg: function(e) {
        var i = this, o = e.currentTarget.dataset.id, n = e.currentTarget.dataset.iid;
        a.com.confirm("确定要删除此图片吗", function() {
            for (var a = i.data.appoint.form, e = 0; e < a.length; e++) if (a[e].id == o) for (var r = 0; r < a[e].upimgar.length; r++) if (a[e].upimgar[r].id == n) {
                var c, d = "appoint.form[" + e + "].upimgar", s = "appoint.form[" + e + "].upimgarstr";
                return i.data.appoint.form[e].upimgar.splice(r, 1), i.setData((c = {}, t(c, d, i.data.appoint.form[e].upimgar), 
                t(c, s, JSON.stringify(i.data.appoint.form[e].upimgar)), c)), !1;
            }
        });
    },
    chooseimg: function(t, a) {
        var e = this;
        wx.chooseImage({
            count: t || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var i = t.tempFilePaths;
                e.uploadImg(i, function(t) {
                    a && a(t);
                });
            }
        });
    },
    uploadImg: function(t, e) {
        if (t.length <= 0) return !1;
        for (var i = [], o = 0; o < t.length; o++) !function(o) {
            wx.showLoading({
                mask: !0,
                title: "上传中"
            }), wx.uploadFile({
                url: a.siteInfo.siteroot + "?i=" + a.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: t[o],
                name: "file",
                success: function(a) {
                    var n = JSON.parse(a.data);
                    i.push({
                        id: n.id,
                        att: n.attachment,
                        url: n.url,
                        temp: t[o]
                    }), o == t.length - 1 && e && e(i);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        }(o);
    }
}));