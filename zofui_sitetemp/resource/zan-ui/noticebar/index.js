function t(t, i, e) {
    return i in t ? Object.defineProperty(t, i, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[i] = e, t;
}

var i = {
    initZanNoticeBarScroll: function(t, i) {
        this.zanNoticeBarNode = this.zanNoticeBarNode || {}, this.zanNoticeBarNode["" + t] = {
            width: void 0,
            wrapWidth: void 0,
            animation: null,
            resetAnimation: null
        };
        var e = this.zanNoticeBarNode["" + t], n = this;
        wx.createSelectorQuery().select("#" + t + "__content").boundingClientRect(function(a) {
            a && a.width ? (e.width = a.width, wx.createSelectorQuery().select("#" + t + "__content-wrap").boundingClientRect(function(a) {
                if (e.wrapWidth = a.width, e.wrapWidth < e.width) {
                    var o = e.width / 40 * 1e3;
                    e.animation = wx.createAnimation({
                        duration: o,
                        timingFunction: "linear"
                    }), e.resetAnimation = wx.createAnimation({
                        duration: 0,
                        timingFunction: "linear"
                    }), n.scrollZanNoticeBar(t, o, i);
                }
            }).exec()) : console.warn("页面缺少 noticebar 元素");
        }).exec();
    },
    scrollZanNoticeBar: function(i, e, n) {
        var a = this.zanNoticeBarNode["" + i], o = a.resetAnimation.translateX(a.wrapWidth).step();
        this.setData(t({}, n + ".animationData", o.export()));
        var r = a.animation.translateX(40 * -e / 1e3).step(), c = this;
        setTimeout(function() {
            c.setData(t({}, n + ".animationData", r.export()));
        }, 100), c.adtimer = setTimeout(function() {
            c.scrollZanNoticeBar(i, e, n);
        }, e);
    }
};

module.exports = i;