function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var t = getApp();

Page(Object.assign({}, t.zan.Field, {
    data: {
        wxuser: null,
        address: "",
        buyarr: null,
        taketype: 1,
        paytype: 0,
        shopinfo: "",
        tel: "",
        mess: "",
        sets: null,
        form: [],
        deskid: 0
    },
    onLoad: function(a) {
        var e = this;
        t.com.comfunc(this), e.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : null
        }), t.com.auth(function(t) {
            e.setData({
                wxuser: t.wxInfo,
                deskid: a.deskid ? a.deskid : 0
            }), e.postchange(e.data.taketype, !0);
        }), t.com.setBar(e, function(a) {
            a.topcolor && a.topbg && wx.setNavigationBarColor({
                frontColor: a.topcolor,
                backgroundColor: a.topbg
            });
        }, a.tid), wx.setNavigationBarTitle({
            title: "确认订单"
        });
    },
    onReady: function() {},
    changeTakeType: function(a) {
        var t = a.currentTarget.dataset.type;
        if (t == this.data.taketype) return !1;
        this.postchange(t, !1);
    },
    postchange: function(a, e) {
        var d = this, r = {
            op: "confirm",
            taketype: a,
            deskid: d.data.deskid,
            plug: 0
        };
        e && (r.address = 1), t.com.http("exconfirm", "POST", r, 0, !0, "", "", function(a) {
            a.data.errno ? t.util.message(a.data.message, "", "error") : (d.setData({
                buyarr: a.data.data.res,
                taketype: a.data.data.res.taketype,
                shopinfo: a.data.data.shopinfo
            }), e && (a.data.data.address || a.data.data.tel) && d.setData({
                address: a.data.data.address,
                tel: a.data.data.tel,
                sets: a.data.data.sets,
                form: a.data.data.form ? a.data.data.form : []
            }));
        });
    },
    selectAddress: function(a) {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                t.setData({
                    address: {
                        name: a.userName,
                        province: a.provinceName,
                        city: a.cityName,
                        county: a.countyName,
                        detail: a.detailInfo,
                        tel: a.telNumber
                    }
                });
            }
        });
    },
    handleZanFieldChange: function(a) {
        a.componentId;
        var t = a.detail;
        this.setData({
            tel: t.value
        });
    },
    messchange: function(a) {
        this.setData({
            mess: a.detail.value
        });
    },
    changepayType: function(a) {
        var t = a.currentTarget.dataset.type;
        if (t == this.data.paytype) return !1;
        this.setData({
            paytype: t
        });
    },
    payit: function(a) {
        var e = this;
        if (!e.data.address && !e.data.deskid) return t.util.message("请选择地址", "", "error"), 
        !1;
        var d = a.detail.value, r = [];
        if (e.data.form.length > 0) for (var s = 0; s < e.data.form.length; s++) for (var i in d) if (e.data.form[s].id == i) {
            if (1 != e.data.form[s].ismust && (!d[i] || d[i].length <= 0)) {
                var o = "请选择";
                return "0" != e.data.form[s].type && "1" != e.data.form[s].type || (o = "请填写"), 
                t.com.alert(o + e.data.form[s].name), !1;
            }
            r.push({
                id: i,
                value: d[i]
            });
        }
        var n = {
            op: "pay",
            taketype: e.data.taketype,
            paytype: e.data.paytype,
            address: JSON.stringify(e.data.address),
            tel: e.data.tel,
            mess: e.data.mess,
            formid: a.detail.formId,
            form: JSON.stringify(r),
            deskid: e.data.deskid
        };
        t.com.http("exconfirm", "POST", n, 0, !0, "", "", function(a) {
            a.data.errno ? t.util.message(a.data.message, "", "error") : 0 == e.data.paytype ? wx.requestPayment({
                timeStamp: a.data.data.timeStamp,
                nonceStr: a.data.data.nonceStr,
                package: a.data.data.package,
                signType: "MD5",
                paySign: a.data.data.paySign,
                success: function(e) {
                    console.log(e), "requestPayment:ok" == e.errMsg && t.util.message("支付完成", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + a.data.data.orderid, "success");
                },
                fail: function(a) {
                    console.log("失败");
                }
            }) : 1 == e.data.paytype && t.util.message("已提交订单", "navigate:/zofui_sitetemp/pages/orderinfo/orderinfo?oid=" + a.data.data.orderid, "success");
        });
    },
    bindformChange: function(t) {
        for (var e = this, d = e.data.form, r = 0; r < d.length; r++) if (d[r].id == t.currentTarget.dataset.i) {
            if ("checkbox" == t.currentTarget.dataset.type) for (var s in d[r].sitem) {
                i = "form[" + r + "].checkbox[" + s + "]";
                t.detail.value.indexOf(d[r].sitem[s]) > -1 ? e.setData(a({}, i, !0)) : e.setData(a({}, i, !1));
            } else {
                var i = "form[" + r + "].value";
                e.setData(a({}, i, t.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        t.com.navigateto(a, this.data.tid);
    }
}));