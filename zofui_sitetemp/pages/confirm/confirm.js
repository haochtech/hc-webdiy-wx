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
        shopinfo: "",
        tel: "",
        mess: "",
        form: []
    },
    onLoad: function(a) {
        var e = this;
        e.setData({
            pageurl: "/" + t.com.getUrlArgs(),
            tid: a.tid ? a.tid : null
        }), t.com.auth(function(a) {
            e.setData({
                wxuser: a.wxInfo
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
        var r = this, o = {
            op: "confirm",
            taketype: a
        };
        e && (o.address = 1), t.com.http("confirm", "POST", o, 0, !0, "", "", function(a) {
            a.data.errno ? t.util.message(a.data.message, "", "error") : (r.setData({
                buyarr: a.data.data.res,
                taketype: a.data.data.res.taketype,
                shopinfo: a.data.data.shopinfo
            }), e && r.setData({
                form: a.data.data.form ? a.data.data.form : []
            }), e && (a.data.data.address || a.data.data.tel) && r.setData({
                address: a.data.data.address,
                tel: a.data.data.tel
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
    payit: function(a) {
        var e = this;
        if (1 == e.data.taketype && !e.data.address) return t.util.message("请选择地址", "", "error"), 
        !1;
        if (2 == e.data.taketype && !e.data.tel) return t.util.message("请填写联系电话", "", "error"), 
        !1;
        if (2 == e.data.taketype && !t.com.verify("mobile", e.data.tel)) return t.util.message("请填写正确的电话号码", "", "error"), 
        !1;
        var r = a.detail.value, o = [];
        if (e.data.form.length > 0) for (var s = 0; s < e.data.form.length; s++) for (var i in r) if (e.data.form[s].id == i) {
            if (1 != e.data.form[s].ismust && (!r[i] || r[i].length <= 0)) {
                var n = "请选择";
                return "0" != e.data.form[s].type && "1" != e.data.form[s].type || (n = "请填写"), 
                t.com.alert(n + e.data.form[s].name), !1;
            }
            o.push({
                id: i,
                value: r[i]
            });
        }
        var d = {
            op: "pay",
            taketype: e.data.taketype,
            address: JSON.stringify(e.data.address),
            tel: e.data.tel,
            mess: e.data.mess,
            formid: a.detail.formId,
            form: JSON.stringify(o)
        };
        t.com.http("confirm", "POST", d, 0, !0, "", "", function(a) {
            a.data.errno ? t.util.message(a.data.message, "", "error") : wx.requestPayment({
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
            });
        });
    },
    bindformChange: function(t) {
        for (var e = this, r = e.data.form, o = 0; o < r.length; o++) if (r[o].id == t.currentTarget.dataset.i) {
            if ("checkbox" == t.currentTarget.dataset.type) for (var s in r[o].sitem) {
                i = "form[" + o + "].checkbox[" + s + "]";
                t.detail.value.indexOf(r[o].sitem[s]) > -1 ? e.setData(a({}, i, !0)) : e.setData(a({}, i, !1));
            } else {
                var i = "form[" + o + "].value";
                e.setData(a({}, i, t.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        t.com.navigateto(a, this.data.tid);
    }
}));