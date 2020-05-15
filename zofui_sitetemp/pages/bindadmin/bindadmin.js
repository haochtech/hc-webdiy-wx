var t = getApp();

Page({
    data: {
        isinit: !1,
        wxuser: !1,
        status: 1,
        mess: "暂时无法绑定",
        scene: 0,
        pageurl: "/zofui_sitetemp/pages/bindadmin/bindadmin"
    },
    onLoad: function(s) {
        var e = this;
        t.com.auth(function(n) {
            e.setData({
                wxuser: n.wxInfo
            }), t.com.http("bindadmin", "POST", {
                scene: s.scene,
                op: "check"
            }, 0, !0, "", "", function(t) {
                t.data.errno ? e.setData({
                    status: t.data.errno,
                    mess: t.data.message
                }) : e.setData({
                    status: 3,
                    mess: "绑定管理员",
                    scene: s.scene
                });
            });
        }, e);
    },
    onShow: function() {},
    onReady: function() {},
    bind: function() {
        var s = this;
        t.com.http("bindadmin", "POST", {
            scene: s.data.scene,
            op: "bind"
        }, 0, !0, "", "", function(e) {
            e.data.errno || (t.com.toast("已绑定"), s.setData({
                status: 1,
                mess: "绑定成功"
            }));
        });
    },
    updateUserInfo: function(s) {
        var e = this;
        "getUserInfo:ok" == s.detail.errMsg && t.com.getUserInfo(function(t) {
            e.setData({
                showuserbtn: !1,
                wxuser: t.wxInfo
            });
        }, !1, s.detail);
    },
    showuserbtn: function() {
        this.setData({
            showuserbtn: !this.data.showuserbtn
        });
    }
});