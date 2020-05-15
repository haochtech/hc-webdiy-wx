var t = getApp();

Page({
    data: {
        isinit: !1,
        wxuser: !1,
        status: 1,
        mess: "暂时无法绑定",
        scene: 0,
        pageurl: "/zofui_sitetemp/pages/admin/admin"
    },
    onLoad: function(s) {
        var e = this;
        t.com.auth(function(n) {
            e.setData({
                wxuser: n.wxInfo,
                scene: s.scene
            }), t.com.http("bindadmin", "POST", {
                scene: s.scene
            }, 0, !0, function(t) {
                t.data.message.errno || e.setData({
                    status: 3,
                    mess: "绑定管理员"
                });
            }, function(t) {
                console.log(t.data.errno), e.setData({
                    status: t.data.errno,
                    mess: t.data.message
                });
            });
        });
    },
    onShow: function() {},
    onReady: function() {},
    bind: function() {
        var s = this;
        t.com.http("bindadmin", "POST", {
            scene: s.data.scene,
            op: "bind"
        }, 0, !0, function(t) {
            t.data.message.errno || wx.showModal({
                title: "提示",
                content: "已绑定",
                showCancel: !1,
                success: function(t) {
                    s.setData({
                        status: 1,
                        mess: "绑定成功"
                    });
                }
            });
        });
    }
});