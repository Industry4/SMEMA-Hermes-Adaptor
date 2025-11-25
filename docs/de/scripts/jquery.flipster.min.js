/* 
 * jquery.flipster
 * built 2015-03-06 
*/

"use strict";
!function (n) {
    n.fn.flipster = function (t) {
        var u = "string" == typeof t ? !0 : !1, f, e;
        if (u) f = t, e = Array.prototype.slice.call(arguments, 1);
        else var o = { itemContainer: "ul", itemSelector: "li", style: "coverflow", start: "center", enableKeyboard: !0, enableMousewheel: !0, enableTouch: !0, onItemSwitch: n.noop, disableRotation: !1, enableNav: !1, navPosition: "before", enableNavButtons: !1, prevText: "Previous", nextText: "Next" },
        i = n.extend({},
        o, t),
        r = n(window);
        return this.each(function () {
            function g() { l = 0 }
            function y() {
                c.height(nt());
                s.css("height", "auto");
                "carousel" === i.style && c.width(t.width())
            }
            function nt() {
                var i = 0; return t.each(function () { n(this).height() > i && (i = n(this).height()) }),
                i
            }
            function tt() {
                var f, e, c;
                if (i.enableNav && t.length > 1) {
                    var u = [], o = [], r = []; t.each(function () {
                        var t = n(this).data("flip-category"),
                        i = n(this).attr("id"),
                        e = n(this).attr("title"),
                        f; ("undefined" != typeof t && n.inArray(t, u) < 0 && (u.push(t),
                        r[t] = '<li class="flip-nav-category"><a href="#" class="flip-nav-category-link" data-flip-category="' + t + '">' + t + '<\/a>\n<ul class="flip-nav-items">\n'),
                        n.inArray(i, o) < 0) && (o.push(i),
                        f = '<a href="#' + i + '" class="flip-nav-item-link">' + e + "<\/a><\/li>\n", "undefined" != typeof t ? r[t] = r[t] + '<li class="flip-nav-item">' + f : r[i] = '<li class="flip-nav-item no-category">' + f)
                    });
                    f = '<ul class="flipster-nav">\n'; for (e in u) r[u[e]] = r[u[e]] + "<\/ul>\n<\/li>\n"; for (c in r) f += r[c]; f += "<\/ul>"; w = "after" != i.navPosition.toLowerCase() ? n(f).prependTo(s) : n(f).appendTo(s);
                    b = w.find("a").on("click", function (i) {
                        var r; r = n(this).hasClass("flip-nav-category-link") ? t.filter("[data-flip-category='" + n(this).data("flip-category") + "']") : n(this.hash);
                        r.length && (h(r),
                        i.preventDefault())
                    })
                }
            }
            function it() {
                if (i.enableNav && t.length > 1) {
                    var r = n(t[o]);
                    w.find(".flip-nav-current").removeClass("flip-nav-current");
                    b.filter("[href='#" + r.attr("id") + "']").addClass("flip-nav-current");
                    b.filter("[data-flip-category='" + r.data("flip-category") + "']").parent().addClass("flip-nav-current")
                }
            }
            function rt() {
                i.enableNavButtons && t.length > 1 && (s.find(".flipto-prev, .flipto-next").remove(),
                s.append("<a href='#' class='flipto-prev'>" + i.prevText + "<\/a> <a href='#' class='flipto-next'>" + i.nextText + "<\/a>"),
                s.children(".flipto-prev").on("click", function (n) {
                    h("left");
                    n.preventDefault()
                }),
                s.children(".flipto-next").on("click", function (n) {
                    h("right");
                    n.preventDefault()
                }))
            }
            function p() {
                var u = n(t[o]).addClass("flip-current"),
                r, f, a, v, e, p;
                if (t.removeClass("flip-prev flip-next flip-current flip-past flip-future no-transition"),
                "carousel" === i.style) {
                    t.addClass("flip-hidden");
                    var w = n(t[o + 1]),
                    s = n(t[o + 2]),
                    h = n(t[o - 1]),
                    l = n(t[o - 2]);
                    0 === o ? (h = t.last(),
                    l = h.prev()) : 1 === o ? l = t.last() : o === t.length - 2 ? s = t.first() : o === t.length - 1 && (w = t.first(),
                    s = n(t[1]));
                    s.removeClass("flip-hidden").addClass("flip-future");
                    l.removeClass("flip-hidden").addClass("flip-past");
                    w.removeClass("flip-hidden").addClass("flip-next");
                    h.removeClass("flip-hidden").addClass("flip-prev")
                }
                else {
                    var b = u.outerWidth() / 2, k = 0, tt = c.width(),
                    g = u.outerWidth(),
                    nt = t.index(u) * g / 2 + b / 2; for (t.removeClass("flip-hidden"),
                    r = 0; r < t.length; r++) f = n(t[r]),
                    a = f.outerWidth(),
                    o > r ? f.addClass("flip-past").css({ "z-index": r, left: r * a / 2 + 50 + "px" }) : r > o && f.addClass("flip-future").css({ "z-index": t.length - r, left: r * a / 2 - 50 + b + "px" });

                    if (u.css({ "z-index": t.length + 1, left: nt + "px" }),
                    k = nt + g / 2 - tt / 2, v = -1 * k + "px", d) {
                        for (e = n(".flip-past"),
                        p = n(".flip-future"),
                        n(".flip-current").css("zoom", "1.0"),
                        r = 0; r < e.length; r++) n(e[r]).css("zoom", 100 - 5 * (e.length - r) + "%");
                        for (r = 0; r < p.length; r++) n(p[r]).css("zoom", 100 - 5 * (r + 1) + "%");
                        c.animate({ left: v },
                        333)
                    }
                    else c.css("left", v)
                }
                u.addClass("flip-current").removeClass("flip-prev flip-next flip-past flip-future flip-hidden");
                y();
                it();
                i.onItemSwitch.call(this)
            }
            function h(n) {
                t.length > 1 && ("left" === n ? o > 0 ? o-- : o = t.length - 1 : "right" === n ? o < t.length - 1 ? o++ : o = 0 : o = "number" == typeof n ? n : t.index(n),
                p())
            }
            function ut() {
                var f, u, e; s.addClass("flipster flipster-active flipster-" + i.style).css("visibility", "hidden");
                i.disableRotation && s.addClass("no-rotate");
                c = s.find(i.itemContainer).addClass("flip-items");
                t = c.find(i.itemSelector).addClass("flip-item flip-hidden").wrapInner("<div class='flip-content' />");
                f = !1; u = document.createElement("b");
                u.innerHTML = "<!--[if IE 9]><i><\/i><![endif]-->"; e = 1 === u.getElementsByTagName("i").length; (f || e) && (d = !0, c.addClass("compatibility"));
                tt();
                rt();
                i.start && t.length > 1 && (o = "center" === i.start ? !t.length % 2 ? t.length / 2 + 1 : Math.floor(t.length / 2) : i.start);
                y();
                s.hide().css("visibility", "visible").fadeIn(400, function () { p() });
                r.on("resize.flipster", function () {
                    y();
                    p()
                });
                t.on("click", function (i) {
                    n(this).hasClass("flip-current") || i.preventDefault();
                    h(t.index(this))
                });
                i.enableKeyboard && t.length > 1 && (r.on("keydown.flipster", function (n) {
                    if (l++, l % 7 == 0 || 1 === l) {
                        var t = n.which; 37 === t ? (n.preventDefault(),
                        h("left")) : 39 === t && (n.preventDefault(),
                        h("right"))
                    }
                }),
                r.on("keyup.flipster", function () { l = 0 }));
                i.enableMousewheel && t.length > 1 && s.on("mousewheel.flipster", function (n) {
                    k = window.setTimeout(g, 500);
                    l++; (l % 4 == 0 || 1 === l) && (window.clearTimeout(k),
                    h(n.originalEvent.wheelDelta / 120 > 0 ? "left" : "right"),
                    n.preventDefault())
                });
                i.enableTouch && t.length > 1 && (s.on("touchstart.flipster", function (n) { a = n.originalEvent.targetTouches[0].screenX }),
                s.on("touchmove.flipster", function (n) {
                    n.preventDefault();
                    var i = n.originalEvent.targetTouches[0].screenX, r = i - a; r > t[0].clientWidth / 1.75 ? (h("left"),
                    a = i) : r < -1 * (t[0].clientWidth / 1.75) && (h("right"),
                    a = i)
                }),
                s.on("touchend.flipster", function () { a = 0 }))
            }
            var v, s = n(this);

            if (u) return v = s.data("methods"),
            v[f].apply(this, e);
            var c, t, w, b, k, d, o = 0, a = 0, l = 0; v = { jump: h };
            s.data("methods", v);
            s.hasClass("flipster-active") || ut()
        })
    }
}(jQuery);
