function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a;
} : function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
}, e = getApp();

Page(Object.assign({}, e.zan.NoticeBar, {
    data: {},
    onLoad: function(t) {
        var i = this;
        i.setData({
            basic: null,
            page: null,
            copy: null,
            pageid: 0,
            article: null,
            pageurl: "",
            searchhist: [],
            isdown: !1,
            options: null,
            fimgpos: !1,
            showfimg: !0,
            loaded: !1,
            tid: "",
            viceadarr: null,
            actvideourl: ""
        });
        var t = t || {}, r = e.com.getUrlArgs(), o = 0;
        if (r.indexOf("pagea") > 0) o = 1;
        if (r.indexOf("pageb") > 0) o = 2;
        if (r.indexOf("pagec") > 0) o = 3;
        if (r.indexOf("paged") > 0) o = 4;
        if (r.indexOf("pagee") > 0) o = 5;
        t.pindex = o, t.state = !0, i.setData({
            options: t
        }), clearTimeout(i.adtimer), e.com.http("getpage", "GET", t, 20, !1, "", "", function(r) {
            var o = r.data.data.page, s = r.data.data.bar;
            if (1 == r.data.data.headto) return wx.redirectTo({
                url: r.data.data.url
            }), !1;
            if (s && s.data && "weburl" == s.data[0].type && s.data[0].weburl) {
                var d = encodeURIComponent(s.data[0].weburl);
                return wx.redirectTo({
                    url: "/zofui_sitetemp/pages/webview/webview?url=" + d + "&pid=" + o.id
                }), !1;
            }
            if (!r.data.errno) {
                if (o.id || e.com.alert("页面不存在"), i.setData({
                    tid: o.tempid,
                    page: o.params,
                    pageurl: "/zofui_sitetemp/pages/page/page?pid=" + o.id,
                    pageid: o.id
                }, function() {
                    for (var t = 0; t < i.data.page.data.length; t++) {
                        if (0 == t) var o = require("../../resource/wxParse/wxParse.js");
                        if ("text" == i.data.page.data[t].name) {
                            d = "page.data[" + t + "].params.node";
                            o.wxParse(d, "html", i.data.page.data[t].params.content, i, 0);
                        }
                        if ("video" == i.data.page.data[t].name && 0 == i.data.page.data[t].params.type && function(t) {
                            e.com.http("gettenvedio", "POST", {
                                url: i.data.page.data[t].params.url
                            }, 0, !1, function(e) {
                                if (!r.data.message.errno) {
                                    var o = "page.data[" + t + "].params.upurl";
                                    i.setData(a({}, o, e.data.message));
                                }
                            });
                        }(t), "ad" == i.data.page.data[t].name && i.initZanNoticeBarScroll("ad" + t, "page.data[" + t + "].params"), 
                        "head" != i.data.page.data[t].name || i.data.wxuser || e.com.auth(function(a) {
                            i.setData({
                                wxuser: a.wxInfo
                            });
                        }, i), "tabbtn" == i.data.page.data[t].name) for (var s in i.data.page.data[t].params.data) {
                            var d = "page.data[" + t + "].params.data[" + s + "].node";
                            o.wxParse(d, "html", i.data.page.data[t].params.data[s].text, i, 0);
                        }
                    }
                }), wx.stopBackgroundAudio(), 1 == o.params.basic.isaudio && o.params.basic.audiourl && i.playbg(), 
                0 != o.params.basic.isbar || t.changebar ? i.setData({
                    bar: null
                }) : i.setData({
                    bar: s
                }), r.data.data.article && i.setData({
                    article: r.data.data.article
                }), r.data.data.copy && ((n = require("../../resource/wxParse/wxParse.js")).wxParse("copy", "html", r.data.data.copy.content, i, 0), 
                i.setData({
                    copyarr: r.data.data.copy
                })), r.data.data.vicead) {
                    var n = require("../../resource/wxParse/wxParse.js");
                    n.wxParse("vicead", "html", r.data.data.vicead.content, i, 0), i.setData({
                        viceadarr: r.data.data.vicead
                    });
                }
                wx.setNavigationBarTitle({
                    title: o.params.basic.title
                }), s.topcolor && s.topbg && wx.setNavigationBarColor({
                    frontColor: s.topcolor,
                    backgroundColor: s.topbg
                }), o.params.basic.topcolor && o.params.basic.topbg && wx.setNavigationBarColor({
                    frontColor: o.params.basic.topcolor,
                    backgroundColor: o.params.basic.topbg
                }), wx.stopPullDownRefresh();
            }
        });
        var s = wx.getStorageSync("zofui_searchhist");
        s && e.com.isArr(s) && this.setData({
            searchhist: s
        });
    },
    onHide: function() {
        wx.stopBackgroundAudio();
    },
    playbg: function() {
        var a = this;
        wx.playBackgroundAudio({
            dataUrl: a.data.page.basic.audiourl,
            success: function() {
                a.setData({
                    audioplaying: !0
                }), wx.onBackgroundAudioStop(function() {
                    a.playbg();
                });
            }
        });
    },
    replaybg: function() {
        var a = this;
        a.setData({
            audioplaying: !a.data.audioplaying
        }), a.data.audioplaying ? wx.playBackgroundAudio({
            dataUrl: a.data.page.basic.audiourl,
            success: function() {}
        }) : wx.pauseBackgroundAudio();
    },
    onShareAppMessage: function(a) {
        var t = this;
        return {
            title: t.data.page.basic.sharetitle,
            path: "",
            imageUrl: t.data.page.basic.shareimg
        };
    },
    imageLoad: function(t) {
        var e = this, i = t.detail.width, r = t.detail.height, o = 1;
        wx.getSystemInfo({
            success: function(a) {
                o = a.windowWidth / i;
            }
        });
        for (var s = r * o, d = 0; d < e.data.page.data.length; d++) if (e.data.page.data[d].id == t.currentTarget.dataset.no) {
            for (var n = 0; n < e.data.page.data[d].params.data.length; n++) if (e.data.page.data[d].params.data[n].id == t.currentTarget.dataset.inno) {
                var u = "page.data[" + d + "].params.data[" + n + "].height";
                if (e.setData(a({}, u, s)), 0 == n) {
                    var p = "page.data[" + d + "].params.current";
                    e.setData(a({}, p, 0));
                }
                return !1;
            }
            return !1;
        }
    },
    bindformChange: function(t) {
        for (var e = this, i = e.data.page.data, r = 0; r < i.length; r++) if (i[r].id == t.currentTarget.dataset.i) for (var o = 0; o < i[r].params.data.length; o++) if (i[r].params.data[o].id == t.currentTarget.dataset.n) {
            if ("checkbox" == t.currentTarget.dataset.type) for (var s in i[r].params.data[o].data) {
                d = "page.data[" + r + "].params.data[" + o + "].data[" + s + "].checked";
                t.detail.value.indexOf(i[r].params.data[o].data[s].name) > -1 ? e.setData(a({}, d, !0)) : e.setData(a({}, d, !1));
            } else {
                var d = "page.data[" + r + "].params.data[" + o + "].value";
                e.setData(a({}, d, t.detail.value));
            }
            return !1;
        }
    },
    formSubmit: function(a) {
        var i = this, r = a.detail.value.zofui_sitetemp_fid, o = 0, s = {};
        for (var d in a.detail.value) {
            for (var n = 0; n < i.data.page.data.length; n++) {
                var u = i.data.page.data[n];
                if (u.id == r) {
                    var p = u.params.data;
                    s = u.params;
                    for (var c = 0; c < p.length; c++) if (c == o && (0 == p[c].ismust || void 0 === p[c].ismust)) {
                        if ("string" == typeof a.detail.value[d] && "" == a.detail.value[d]) return e.util.message("请填写" + d, "", "error"), 
                        !1;
                        if ("object" == t(a.detail.value[d]) && a.detail.value[d].length <= 0) return e.util.message("请选择" + d, "", "error"), 
                        !1;
                        if ("img" == p[c].type && "[]" == p[c].upimgarstr) return e.util.message("请设置" + d, "", "error"), 
                        !1;
                    }
                }
            }
            o++;
        }
        delete a.detail.value.zofui_sitetemp_fid;
        var g = JSON.stringify(a.detail.value);
        e.com.http("saveform", "POST", {
            data: g
        }, 0, !0, function(a) {
            a.data.errno ? e.com.alert(a.data.message) : e.com.alert("已提交", function() {
                if ("" == s.type || void 0 === s.type) wx.navigateTo({
                    url: "/zofui_sitetemp/pages/page/page?pid=" + i.data.pageid
                }); else if ("url" == s.type) wx.navigateTo({
                    url: s.url
                }); else if ("weburl" == s.type) {
                    var a = encodeURIComponent(s.weburl);
                    wx.redirectTo({
                        url: "/zofui_sitetemp/pages/webview/webview?url=" + a
                    });
                } else "other" == s.type && wx.navigateToMiniProgram({
                    appId: s.appid,
                    path: s.appurl,
                    fail: function(a) {
                        e.util.message("打开页面失败", "", "error");
                    }
                });
            });
        });
    },
    showvedio: function(a) {
        this.data.actvideourl != a.currentTarget.dataset.url && this.setData({
            actvideourl: a.currentTarget.dataset.url
        }), this.setData({
            showvediobox: !0
        }), wx.createVideoContext("video_play").play();
    },
    hidevideo: function() {
        this.setData({
            showvediobox: !1
        }), wx.createVideoContext("video_play").pause();
    },
    onPullDownRefresh: function() {
        if (this.data.isdown) return !1;
        this.setData({
            isdown: !0
        }), this.onLoad(this.data.options), this.setData({
            isdown: !1
        });
    },
    location: function(a) {
        e.com.location(a);
    },
    otherapp: function(a) {
        e.com.otherapp(a);
    },
    navigateto: function(a) {
        var t = a.currentTarget.dataset.pageid, i = getCurrentPages();
        if (i.length > 1) for (var r = 0; r < i.length; r++) if (i[r].data.pageid > 0 && t > 0 && i[r].data.pageid == t) return wx.navigateBack({
            delta: i.length - r - 1
        }), !1;
        e.com.navigateto(a, this.data.tid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.url;
        if (t.indexOf("zofui_sitetemp/pages/page/page") >= 0 && 1 == a.currentTarget.dataset.isfoot) {
            var i = e.com.theRequest(t);
            i.tid || (i.tid = this.data.tid), this.data.tid != i.tid && (i.changebar = 1), this.onLoad(i);
        } else e.com.redirectto(a, this.data.tid);
    },
    callphone: function(a) {
        e.com.callphone(a);
    },
    toweburl: function(a) {
        e.com.toweburl(a, this);
    },
    showimages: function(a) {
        e.com.showimages(a);
    },
    copy: function(a) {
        e.com.copy(a);
    },
    scan: function(a) {
        wx.scanCode({
            success: function(a) {
                if (a.path) {
                    var t = 0 == a.path.indexOf("/") ? a.path : "/" + a.path;
                    wx.navigateTo({
                        url: t
                    });
                }
            }
        });
    },
    toggleRightPopupart: function() {
        this.setData({
            showRightPopupart: !this.data.showRightPopupart,
            searchfocusart: !this.data.searchfocusart
        });
    },
    searchinputart: function(a) {
        this.setData({
            forart: a.detail.value
        });
    },
    tosearchart: function() {
        if (!this.data.forart) return !1;
        wx.navigateTo({
            url: "/zofui_sitetemp/pages/artlist/artlist?for=" + this.data.forart
        });
    },
    toggleRightPopup: function() {
        this.setData({
            showRightPopup: !this.data.showRightPopup,
            searchfocus: !this.data.searchfocus
        });
    },
    addhist: function(a) {
        e.com.addhist(this, a);
    },
    clearhist: function() {
        e.com.clearhist(this);
    },
    searchinput: function(a) {
        this.setData({
            for: a.detail.value
        });
    },
    tosearch: function() {
        e.com.tosearch(this);
    },
    tosearchhist: function(a) {
        e.com.tosearchhist(a);
    },
    changefimg: function() {
        var a = this;
        a.setData({
            fimgpos: !a.data.fimgpos
        }), a.data.fimgpos && setTimeout(function() {
            a.setData({
                showfimg: !1
            });
        }, 300);
    },
    uploadimg: function(t) {
        var i = this, r = t.currentTarget.dataset.item.upimgar ? t.currentTarget.dataset.item.upimgar : [], o = r.length, s = (t.currentTarget.dataset.item.maxnum > 0 ? t.currentTarget.dataset.item.maxnum : 1) - o;
        if (s <= 0) return e.com.alert("图片数量已经很多了，不能再上传，可点击图片删除"), !1;
        i.chooseimg(s, function(e) {
            for (var o = i.data.page.data, s = 0; s < o.length; s++) if (o[s].id == t.currentTarget.dataset.id) for (var d = 0; d < o[s].params.data.length; d++) if (o[s].params.data[d].id == t.currentTarget.dataset.item.id) {
                var n, u = "page.data[" + s + "].params.data[" + d + "].upimgar", p = "page.data[" + s + "].params.data[" + d + "].upimgarstr";
                return i.setData((n = {}, a(n, u, r.concat(e)), a(n, p, JSON.stringify(r.concat(e))), 
                n)), !1;
            }
        });
    },
    deleteImg: function(t) {
        var i = this, r = t.currentTarget.dataset.id, o = t.currentTarget.dataset.iid, s = t.currentTarget.dataset.mid;
        e.com.confirm("确定要删除此图片吗", function() {
            for (var t = i.data.page.data, e = 0; e < t.length; e++) if (t[e].id == r) for (var d = 0; d < t[e].params.data.length; d++) if (t[e].params.data[d].id == o) for (var n = 0; n < t[e].params.data[d].upimgar.length; n++) if (t[e].params.data[d].upimgar[n].id == s) {
                var u;
                console.log(s);
                var p = "page.data[" + e + "].params.data[" + d + "].upimgar", c = "page.data[" + e + "].params.data[" + d + "].upimgarstr";
                return t[e].params.data[d].upimgar.splice(n, 1), i.setData((u = {}, a(u, p, t[e].params.data[d].upimgar), 
                a(u, c, JSON.stringify(t[e].params.data[d].upimgar)), u)), !1;
            }
        });
    },
    chooseimg: function(a, t) {
        var e = this;
        wx.chooseImage({
            count: a || 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var i = a.tempFilePaths;
                e.uploadImg(i, function(a) {
                    t && t(a);
                });
            }
        });
    },
    uploadImg: function(a, t) {
        if (a.length <= 0) return !1;
        for (var i = [], r = 0; r < a.length; r++) !function(r) {
            wx.showLoading({
                mask: !0,
                title: "上传中"
            }), wx.uploadFile({
                url: e.siteInfo.siteroot + "?i=" + e.siteInfo.uniacid + "&j=&c=utility&a=file&do=upload&type=image&thumb=0",
                filePath: a[r],
                name: "file",
                success: function(e) {
                    var o = JSON.parse(e.data);
                    i.push({
                        id: o.id,
                        att: o.attachment,
                        url: o.url,
                        temp: a[r]
                    }), r == a.length - 1 && t && t(i);
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        }(r);
    },
    updateUserInfo: function(a) {
        var t = this;
        "getUserInfo:ok" == a.detail.errMsg && e.com.getUserInfo(function(a) {
            t.setData({
                showuserbtn: !1,
                wxuser: a.wxInfo
            });
        }, !1, a.detail);
    },
    showuserbtn: function() {
        this.setData({
            showuserbtn: !this.data.showuserbtn
        });
    },
    getTab: function(t) {
        var e = this, i = "page.data[" + t.currentTarget.dataset.id + "].params.actaid";
        e.setData(a({}, i, t.currentTarget.dataset.iiid));
    },
    playaudio: function(a) {
        var t = this, e = a.currentTarget.dataset.id, i = a.currentTarget.dataset.url;
        t.data.playaudioid == e && t.data.playaudioing ? (wx.pauseBackgroundAudio(), t.setData({
            playaudioing: !1
        })) : (t.data.playaudioid != e && wx.stopBackgroundAudio(), wx.playBackgroundAudio({
            dataUrl: i,
            success: function() {
                t.setData({
                    playaudioid: e,
                    playaudioing: !0
                });
            }
        }));
    }
}));