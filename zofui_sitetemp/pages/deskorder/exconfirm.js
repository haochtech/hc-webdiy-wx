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
    postchange: function(a, e) {
        var d = this, s = {
            op: "confirm",
            taketype: a,
            deskid: d.data.deskid,
            plug: 1
        };
        e && (s.address = 1), t.com.http("exconfirm", "POST", s, 0, !0, "", "", function(a) {
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
        var d = a.detail.value, s = [];
        if (e.data.form.length > 0) for (var r = 0; r < e.data.form.length; r++) for (var o in d) if (e.data.form[r].id == o) {
            if (1 != e.data.form[r].ismust && (!d[o] || d[o].length <= 0)) {
                var i = "请选择";
                return "0" != e.data.form[r].type && "1" != e.data.form[r].type || (i = "请填写"), 
                t.com.alert(i + e.data.form[r].name), !1;
            }
            s.push({
                id: o,
                value: d[o]
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
            form: JSON.stringify(s),
            deskid: e.data.deskid,
            plug: 1
        };
        t.com.http("exconfirm", "POST", n, 0, !0, "", "", function(a) {
            a.data.errno ? t.util.message(a.data.message, "", "error") : 0 == e.data.paytype ? wx.requestPayment({
                timeStamp: a.data.data.timeStamp,
                nonceStr: a.data.data.nonceStr,
                package: a.data.data.package,
                signType: "MD5",
                paySign: a.data.data.paySign,
                success: function(e) {
                    console.log(e), "requestPayment:ok" == e.errMsg && t.util.message("支付完成", "navigate:/zofui_sitetemp/pages/deskorder/orderinfo?oid=" + a.data.data.orderid, "success");
                },
                fail: function(a) {
                    console.log("失败");
                }
            }) : 1 == e.data.paytype && t.util.message("已提交订单", "navigate:/zofui_sitetemp/pages/deskorder/orderinfo?oid=" + a.data.data.orderid, "success");
        });
    },
    bindformChange: function(t) {
        for (var e = this, d = e.data.form, s = 0; s < d.length; s++) if (d[s].id == t.currentTarget.dataset.i) {
            if ("checkbox" == t.currentTarget.dataset.type) for (var r in d[s].sitem) {
                o = "form[" + s + "].checkbox[" + r + "]";
                t.detail.value.indexOf(d[s].sitem[r]) > -1 ? e.setData(a({}, o, !0)) : e.setData(a({}, o, !1));
            } else {
                var o = "form[" + s + "].value";
                e.setData(a({}, o, t.detail.value));
            }
            return !1;
        }
    },
    navigateto: function(a) {
        t.com.navigateto(a);
    }
}));