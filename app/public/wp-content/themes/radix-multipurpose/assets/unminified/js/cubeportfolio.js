/*
 * Cube Portfolio - Responsive jQuery Grid Plugin
 *
 * version: 4.3.0 (9 August, 2017)
 * require: jQuery v1.8+
 *
 * Copyright 2013-2017, Mihai Buricea (http://scriptpie.com/cubeportfolio/live-preview/)
 * Licensed under CodeCanyon License (http://codecanyon.net/licenses)
 *
 */
! function(e, t, n, o) {
    "use strict";

    function i(t, n, a) {
        var r = this;
        if (e.data(t, "cubeportfolio")) throw new Error("cubeportfolio is already initialized. Destroy it before initialize again!");
        r.obj = t, r.$obj = e(t), e.data(r.obj, "cubeportfolio", r), n.sortToPreventGaps !== o && (n.sortByDimension = n.sortToPreventGaps, delete n.sortToPreventGaps), r.options = e.extend({}, e.fn.cubeportfolio.options, n, r.$obj.data("cbp-options")), r.isAnimating = !0, r.defaultFilter = r.options.defaultFilter, r.registeredEvents = [], r.queue = [], r.addedWrapp = !1, e.isFunction(a) && r.registerEvent("initFinish", a, !0);
        var s = r.$obj.children();
        r.$obj.addClass("cbp"), (0 === s.length || s.first().hasClass("cbp-item")) && (r.wrapInner(r.obj, "cbp-wrapper"), r.addedWrapp = !0), r.$ul = r.$obj.children().addClass("cbp-wrapper"), r.wrapInner(r.obj, "cbp-wrapper-outer"), r.wrapper = r.$obj.children(".cbp-wrapper-outer"), r.blocks = r.$ul.children(".cbp-item"), r.blocksOn = r.blocks, r.wrapInner(r.blocks, "cbp-item-wrapper"), r.plugins = {}, e.each(i.plugins, function(e, t) {
            var n = t(r);
            n && (r.plugins[e] = n)
        }), r.triggerEvent("afterPlugins"), r.removeAttrAfterStoreData = e.Deferred(), r.loadImages(r.$obj, r.display)
    }
    e.extend(i.prototype, {
        storeData: function(t, n) {
            var o = this;
            n = n || 0, t.each(function(t, i) {
                var a = e(i),
                    r = a.width(),
                    s = a.height();
                a.data("cbp", {
                    index: n + t,
                    indexInitial: n + t,
                    wrapper: a.children(".cbp-item-wrapper"),
                    widthInitial: r,
                    heightInitial: s,
                    width: r,
                    height: s,
                    widthAndGap: r + o.options.gapVertical,
                    heightAndGap: s + o.options.gapHorizontal,
                    left: null,
                    leftNew: null,
                    top: null,
                    topNew: null,
                    pack: !1
                })
            }), this.removeAttrAfterStoreData.resolve()
        },
        wrapInner: function(e, t) {
            var i, a, r;
            if (t = t || "", !(e.length && e.length < 1))
                for (e.length === o && (e = [e]), a = e.length - 1; a >= 0; a--) {
                    for (i = e[a], (r = n.createElement("div")).setAttribute("class", t); i.childNodes.length;) r.appendChild(i.childNodes[0]);
                    i.appendChild(r)
                }
        },
        removeAttrImage: function(e) {
            this.removeAttrAfterStoreData.then(function() {
                e.removeAttribute("width"), e.removeAttribute("height"), e.removeAttribute("style")
            })
        },
        loadImages: function(t, n) {
            var o = this;
            requestAnimationFrame(function() {
                var i = t.find("img").map(function(t, n) {
                        if (n.hasAttribute("width") && n.hasAttribute("height")) {
                            if (n.style.width = n.getAttribute("width") + "px", n.style.height = n.getAttribute("height") + "px", n.hasAttribute("data-cbp-src")) return null;
                            if (null === o.checkSrc(n)) o.removeAttrImage(n);
                            else {
                                var i = e("<img>");
                                i.on("load.cbp error.cbp", function() {
                                    e(this).off("load.cbp error.cbp"), o.removeAttrImage(n)
                                }), n.srcset ? (i.attr("sizes", n.sizes || "100vw"), i.attr("srcset", n.srcset)) : i.attr("src", n.src)
                            }
                            return null
                        }
                        return o.checkSrc(n)
                    }),
                    a = i.length;
                0 !== a ? e.each(i, function(t, i) {
                    var r = e("<img>");
                    r.on("load.cbp error.cbp", function() {
                        e(this).off("load.cbp error.cbp"), 0 === --a && n.call(o)
                    }), i.srcset ? (r.attr("sizes", i.sizes), r.attr("srcset", i.srcset)) : r.attr("src", i.src)
                }) : n.call(o)
            })
        },
        checkSrc: function(t) {
            var n = t.srcset,
                i = t.src;
            if ("" === i) return null;
            var a = e("<img>");
            n ? (a.attr("sizes", t.sizes || "100vw"), a.attr("srcset", n)) : a.attr("src", i);
            var r = a[0];
            return r.complete && r.naturalWidth !== o && 0 !== r.naturalWidth ? null : r
        },
        display: function() {
            var e = this;
            e.width = e.$obj.outerWidth(), e.triggerEvent("initStartRead"), e.triggerEvent("initStartWrite"), e.width > 0 && (e.storeData(e.blocks), e.layoutAndAdjustment()), e.triggerEvent("initEndRead"), e.triggerEvent("initEndWrite"), e.$obj.addClass("cbp-ready"), e.runQueue("delayFrame", e.delayFrame)
        },
        delayFrame: function() {
            var e = this;
            requestAnimationFrame(function() {
                e.resizeEvent(), e.triggerEvent("initFinish"), e.isAnimating = !1, e.$obj.trigger("initComplete.cbp")
            })
        },
        resizeEvent: function() {
            var e = this;
            i["private"].resize.initEvent({
                instance: e,
                fn: function() {
                    e.triggerEvent("beforeResizeGrid");
                    var t = e.$obj.outerWidth();
                    e.width !== t && (e.width = t, "alignCenter" === e.options.gridAdjustment && (e.wrapper[0].style.maxWidth = ""), e.layoutAndAdjustment(), e.triggerEvent("resizeGrid")), e.triggerEvent("resizeWindow")
                }
            })
        },
        gridAdjust: function() {
            var t = this;
            "responsive" === t.options.gridAdjustment ? t.responsiveLayout() : (t.blocks.removeAttr("style"), t.blocks.each(function(n, o) {
                var i = e(o).data("cbp"),
                    a = o.getBoundingClientRect(),
                    r = t.columnWidthTruncate(a.right - a.left),
                    s = Math.round(a.bottom - a.top);
                i.height = s, i.heightAndGap = s + t.options.gapHorizontal, i.width = r, i.widthAndGap = r + t.options.gapVertical
            }), t.widthAvailable = t.width + t.options.gapVertical), t.triggerEvent("gridAdjust")
        },
        layoutAndAdjustment: function(e) {
            var t = this;
            e && (t.width = t.$obj.outerWidth()), t.gridAdjust(), t.layout()
        },
        layout: function() {
            var t = this;
            t.computeBlocks(t.filterConcat(t.defaultFilter)), "slider" === t.options.layoutMode ? (t.sliderLayoutReset(), t.sliderLayout()) : (t.mosaicLayoutReset(), t.mosaicLayout()), t.blocksOff.addClass("cbp-item-off"), t.blocksOn.removeClass("cbp-item-off").each(function(t, n) {
                var o = e(n).data("cbp");
                o.left = o.leftNew, o.top = o.topNew, n.style.left = o.left + "px", n.style.top = o.top + "px"
            }), t.resizeMainContainer()
        },
        computeFilter: function(e) {
            var t = this;
            t.computeBlocks(e), t.mosaicLayoutReset(), t.mosaicLayout(), t.filterLayout()
        },
        filterLayout: function() {
            var t = this;
            t.blocksOff.addClass("cbp-item-off"), t.blocksOn.removeClass("cbp-item-off").each(function(t, n) {
                var o = e(n).data("cbp");
                o.left = o.leftNew, o.top = o.topNew, n.style.left = o.left + "px", n.style.top = o.top + "px"
            }), t.resizeMainContainer(), t.filterFinish()
        },
        filterFinish: function() {
            var e = this;
            e.isAnimating = !1, e.$obj.trigger("filterComplete.cbp"), e.triggerEvent("filterFinish")
        },
        computeBlocks: function(e) {
            var t = this;
            t.blocksOnInitial = t.blocksOn, t.blocksOn = t.blocks.filter(e), t.blocksOff = t.blocks.not(e), t.triggerEvent("computeBlocksFinish", e)
        },
        responsiveLayout: function() {
            var t = this;
            t.cols = t[e.isArray(t.options.mediaQueries) ? "getColumnsBreakpoints" : "getColumnsAuto"](), t.columnWidth = t.columnWidthTruncate((t.width + t.options.gapVertical) / t.cols), t.widthAvailable = t.columnWidth * t.cols, "mosaic" === t.options.layoutMode && t.getMosaicWidthReference(), t.blocks.each(function(n, o) {
                var i, a = e(o).data("cbp"),
                    r = 1;
                "mosaic" === t.options.layoutMode && (r = t.getColsMosaic(a.widthInitial)), i = t.columnWidth * r - t.options.gapVertical, o.style.width = i + "px", a.width = i, a.widthAndGap = i + t.options.gapVertical, o.style.height = ""
            });
            var n = [];
            t.blocks.each(function(t, o) {
                e.each(e(o).find("img").filter("[width][height]"), function(t, o) {
                    var i = 0;
                    e(o).parentsUntil(".cbp-item").each(function(t, n) {
                        var o = e(n).width();
                        if (o > 0) return i = o, !1
                    });
                    var a = parseInt(o.getAttribute("width"), 10),
                        r = parseInt(o.getAttribute("height"), 10),
                        s = parseFloat((a / r).toFixed(10));
                    n.push({
                        el: o,
                        width: i,
                        height: Math.round(i / s)
                    })
                })
            }), e.each(n, function(e, t) {
                t.el.width = t.width, t.el.height = t.height, t.el.style.width = t.width + "px", t.el.style.height = t.height + "px"
            }), t.blocks.each(function(n, o) {
                var i = e(o).data("cbp"),
                    a = o.getBoundingClientRect(),
                    r = Math.round(a.bottom - a.top);
                i.height = r, i.heightAndGap = r + t.options.gapHorizontal
            })
        },
        getMosaicWidthReference: function() {
            var t = this,
                n = [];
            t.blocks.each(function(t, o) {
                var i = e(o).data("cbp");
                n.push(i.widthInitial)
            }), n.sort(function(e, t) {
                return e - t
            }), n[0] ? t.mosaicWidthReference = n[0] : t.mosaicWidthReference = t.columnWidth
        },
        getColsMosaic: function(e) {
            var t = this;
            if (e === t.width) return t.cols;
            var n = e / t.mosaicWidthReference;
            return n = n % 1 >= .79 ? Math.ceil(n) : Math.floor(n), Math.min(Math.max(n, 1), t.cols)
        },
        getColumnsAuto: function() {
            var e = this;
            if (0 === e.blocks.length) return 1;
            var t = e.blocks.first().data("cbp").widthInitial + e.options.gapVertical;
            return Math.max(Math.round(e.width / t), 1)
        },
        getColumnsBreakpoints: function() {
            var t, n = this,
                o = n.width;
            return e.each(n.options.mediaQueries, function(e, n) {
                if (o >= n.width) return t = n, !1
            }), t || (t = n.options.mediaQueries[n.options.mediaQueries.length - 1]), n.triggerEvent("onMediaQueries", t.options), t.cols
        },
        columnWidthTruncate: function(e) {
            return Math.floor(e)
        },
        resizeMainContainer: function() {
            var t, n = this,
                a = Math.max(n.freeSpaces.slice(-1)[0].topStart - n.options.gapHorizontal, 0);
            "alignCenter" === n.options.gridAdjustment && (t = 0, n.blocksOn.each(function(n, o) {
                var i = e(o).data("cbp"),
                    a = i.left + i.width;
                a > t && (t = a)
            }), n.wrapper[0].style.maxWidth = t + "px"), a !== n.height ? (n.obj.style.height = a + "px", n.height !== o && (i["private"].modernBrowser ? n.$obj.one(i["private"].transitionend, function() {
                n.$obj.trigger("pluginResize.cbp")
            }) : n.$obj.trigger("pluginResize.cbp")), n.height = a, n.triggerEvent("resizeMainContainer")) : n.triggerEvent("resizeMainContainer")
        },
        filterConcat: function(e) {
            return e.replace(/\|/gi, "")
        },
        pushQueue: function(e, t) {
            var n = this;
            n.queue[e] = n.queue[e] || [], n.queue[e].push(t)
        },
        runQueue: function(t, n) {
            var o = this,
                i = o.queue[t] || [];
            e.when.apply(e, i).then(e.proxy(n, o))
        },
        clearQueue: function(e) {
            this.queue[e] = []
        },
        registerEvent: function(e, t, n) {
            var o = this;
            o.registeredEvents[e] || (o.registeredEvents[e] = []), o.registeredEvents[e].push({
                func: t,
                oneTime: n || !1
            })
        },
        triggerEvent: function(e, t) {
            var n, o, i = this;
            if (i.registeredEvents[e])
                for (n = 0, o = i.registeredEvents[e].length; n < o; n++) i.registeredEvents[e][n].func.call(i, t), i.registeredEvents[e][n].oneTime && (i.registeredEvents[e].splice(n, 1), n--, o--)
        },
        addItems: function(t, n, o) {
            var a = this;
            a.wrapInner(t, "cbp-item-wrapper"), a.$ul[o](t.addClass("cbp-item-loading").css({
                top: "100%",
                left: 0
            })), i["private"].modernBrowser ? t.last().one(i["private"].animationend, function() {
                a.addItemsFinish(t, n)
            }) : a.addItemsFinish(t, n), a.loadImages(t, function() {
                if (a.$obj.addClass("cbp-updateItems"), "append" === o) a.storeData(t, a.blocks.length), e.merge(a.blocks, t);
                else {
                    a.storeData(t);
                    var n = t.length;
                    a.blocks.each(function(t, o) {
                        e(o).data("cbp").index = n + t
                    }), a.blocks = e.merge(t, a.blocks)
                }
                a.triggerEvent("addItemsToDOM", t), a.triggerEvent("triggerSort"), a.layoutAndAdjustment(!0), a.elems && i["public"].showCounter.call(a.obj, a.elems)
            })
        },
        addItemsFinish: function(t, n) {
            var o = this;
            o.isAnimating = !1, o.$obj.removeClass("cbp-updateItems"), t.removeClass("cbp-item-loading"), e.isFunction(n) && n.call(o, t), o.$obj.trigger("onAfterLoadMore.cbp", [t])
        },
        removeItems: function(t, n) {
            var o = this;
            o.$obj.addClass("cbp-updateItems"), i["private"].modernBrowser ? t.last().one(i["private"].animationend, function() {
                o.removeItemsFinish(t, n)
            }) : o.removeItemsFinish(t, n), t.each(function(t, n) {
                o.blocks.each(function(t, a) {
                    if (n === a) {
                        var r = e(a);
                        o.blocks.splice(t, 1), i["private"].modernBrowser ? (r.one(i["private"].animationend, function() {
                            r.remove()
                        }), r.addClass("cbp-removeItem")) : r.remove()
                    }
                })
            }), o.blocks.each(function(t, n) {
                e(n).data("cbp").index = t
            }), o.triggerEvent("triggerSort"), o.layoutAndAdjustment(!0), o.elems && i["public"].showCounter.call(o.obj, o.elems)
        },
        removeItemsFinish: function(t, n) {
            var o = this;
            o.isAnimating = !1, o.$obj.removeClass("cbp-updateItems"), e.isFunction(n) && n.call(o, t)
        }
    }), e.fn.cubeportfolio = function(e, t, n) {
        return this.each(function() {
            if ("object" == typeof e || !e) return i["public"].init.call(this, e, t);
            if (i["public"][e]) return i["public"][e].call(this, t, n);
            throw new Error("Method " + e + " does not exist on jquery.cubeportfolio.js")
        })
    }, i.plugins = {}, e.fn.cubeportfolio.constructor = i
}(jQuery, window, document),
function(e, t, n, o) {
    "use strict";
    var i = e.fn.cubeportfolio.constructor;
    e.extend(i.prototype, {
        mosaicLayoutReset: function() {
            var t = this;
            t.blocksAreSorted = !1, t.blocksOn.each(function(n, o) {
                e(o).data("cbp").pack = !1, t.options.sortByDimension && (o.style.height = "")
            }), t.freeSpaces = [{
                leftStart: 0,
                leftEnd: t.widthAvailable,
                topStart: 0,
                topEnd: Math.pow(2, 18)
            }]
        },
        mosaicLayout: function() {
            for (var e = this, t = 0, n = e.blocksOn.length; t < n; t++) {
                var o = e.getSpaceIndexAndBlock();
                if (null === o) return e.mosaicLayoutReset(), e.blocksAreSorted = !0, e.sortBlocks(e.blocksOn, "widthAndGap", "heightAndGap", !0), void e.mosaicLayout();
                e.generateF1F2(o.spaceIndex, o.dataBlock), e.generateG1G2G3G4(o.dataBlock), e.cleanFreeSpaces(), e.addHeightToBlocks()
            }
            e.blocksAreSorted && e.sortBlocks(e.blocksOn, "topNew", "leftNew")
        },
        getSpaceIndexAndBlock: function() {
            var t = this,
                n = null;
            return e.each(t.freeSpaces, function(o, i) {
                var a = i.leftEnd - i.leftStart,
                    r = i.topEnd - i.topStart;
                return t.blocksOn.each(function(t, s) {
                    var l = e(s).data("cbp");
                    if (!0 !== l.pack) return l.widthAndGap <= a && l.heightAndGap <= r ? (l.pack = !0, n = {
                        spaceIndex: o,
                        dataBlock: l
                    }, l.leftNew = i.leftStart, l.topNew = i.topStart, !1) : void 0
                }), !t.blocksAreSorted && t.options.sortByDimension && o > 0 ? (n = null, !1) : null === n && void 0
            }), n
        },
        generateF1F2: function(e, t) {
            var n = this,
                o = n.freeSpaces[e],
                i = {
                    leftStart: o.leftStart + t.widthAndGap,
                    leftEnd: o.leftEnd,
                    topStart: o.topStart,
                    topEnd: o.topEnd
                },
                a = {
                    leftStart: o.leftStart,
                    leftEnd: o.leftEnd,
                    topStart: o.topStart + t.heightAndGap,
                    topEnd: o.topEnd
                };
            n.freeSpaces.splice(e, 1), i.leftEnd > i.leftStart && i.topEnd > i.topStart && (n.freeSpaces.splice(e, 0, i), e++), a.leftEnd > a.leftStart && a.topEnd > a.topStart && n.freeSpaces.splice(e, 0, a)
        },
        generateG1G2G3G4: function(t) {
            var n = this,
                o = [];
            e.each(n.freeSpaces, function(e, i) {
                var a = n.intersectSpaces(i, t);
                null !== a ? (n.generateG1(i, a, o), n.generateG2(i, a, o), n.generateG3(i, a, o), n.generateG4(i, a, o)) : o.push(i)
            }), n.freeSpaces = o
        },
        intersectSpaces: function(e, t) {
            var n = {
                leftStart: t.leftNew,
                leftEnd: t.leftNew + t.widthAndGap,
                topStart: t.topNew,
                topEnd: t.topNew + t.heightAndGap
            };
            if (e.leftStart === n.leftStart && e.leftEnd === n.leftEnd && e.topStart === n.topStart && e.topEnd === n.topEnd) return null;
            var o = Math.max(e.leftStart, n.leftStart),
                i = Math.min(e.leftEnd, n.leftEnd),
                a = Math.max(e.topStart, n.topStart),
                r = Math.min(e.topEnd, n.topEnd);
            return i <= o || r <= a ? null : {
                leftStart: o,
                leftEnd: i,
                topStart: a,
                topEnd: r
            }
        },
        generateG1: function(e, t, n) {
            e.topStart !== t.topStart && n.push({
                leftStart: e.leftStart,
                leftEnd: e.leftEnd,
                topStart: e.topStart,
                topEnd: t.topStart
            })
        },
        generateG2: function(e, t, n) {
            e.leftEnd !== t.leftEnd && n.push({
                leftStart: t.leftEnd,
                leftEnd: e.leftEnd,
                topStart: e.topStart,
                topEnd: e.topEnd
            })
        },
        generateG3: function(e, t, n) {
            e.topEnd !== t.topEnd && n.push({
                leftStart: e.leftStart,
                leftEnd: e.leftEnd,
                topStart: t.topEnd,
                topEnd: e.topEnd
            })
        },
        generateG4: function(e, t, n) {
            e.leftStart !== t.leftStart && n.push({
                leftStart: e.leftStart,
                leftEnd: t.leftStart,
                topStart: e.topStart,
                topEnd: e.topEnd
            })
        },
        cleanFreeSpaces: function() {
            var e = this;
            e.freeSpaces.sort(function(e, t) {
                return e.topStart > t.topStart ? 1 : e.topStart < t.topStart ? -1 : e.leftStart > t.leftStart ? 1 : e.leftStart < t.leftStart ? -1 : 0
            }), e.correctSubPixelValues(), e.removeNonMaximalFreeSpaces()
        },
        correctSubPixelValues: function() {
            var e, t, n, o, i = this;
            for (e = 0, t = i.freeSpaces.length - 1; e < t; e++) n = i.freeSpaces[e], (o = i.freeSpaces[e + 1]).topStart - n.topStart <= 1 && (o.topStart = n.topStart)
        },
        removeNonMaximalFreeSpaces: function() {
            var t = this;
            t.uniqueFreeSpaces(), t.freeSpaces = e.map(t.freeSpaces, function(n, o) {
                return e.each(t.freeSpaces, function(e, t) {
                    if (o !== e) return t.leftStart <= n.leftStart && t.leftEnd >= n.leftEnd && t.topStart <= n.topStart && t.topEnd >= n.topEnd ? (n = null, !1) : void 0
                }), n
            })
        },
        uniqueFreeSpaces: function() {
            var t = this,
                n = [];
            e.each(t.freeSpaces, function(t, o) {
                e.each(n, function(e, t) {
                    if (t.leftStart === o.leftStart && t.leftEnd === o.leftEnd && t.topStart === o.topStart && t.topEnd === o.topEnd) return o = null, !1
                }), null !== o && n.push(o)
            }), t.freeSpaces = n
        },
        addHeightToBlocks: function() {
            var t = this;
            e.each(t.freeSpaces, function(n, o) {
                t.blocksOn.each(function(n, i) {
                    var a = e(i).data("cbp");
                    !0 === a.pack && t.intersectSpaces(o, a) && -1 === o.topStart - a.topNew - a.heightAndGap && (i.style.height = a.height - 1 + "px")
                })
            })
        },
        sortBlocks: function(t, n, o, i) {
            o = void 0 === o ? "leftNew" : o, i = void 0 === i ? 1 : -1, t.sort(function(t, a) {
                var r = e(t).data("cbp"),
                    s = e(a).data("cbp");
                return r[n] > s[n] ? i : r[n] < s[n] ? -i : r[o] > s[o] ? i : r[o] < s[o] ? -i : r.index > s.index ? i : r.index < s.index ? -i : void 0
            })
        }
    })
}(jQuery, window, document), jQuery.fn.cubeportfolio.options = {
        filters: "",
        search: "",
        layoutMode: "grid",
        sortByDimension: !1,
        drag: !0,
        auto: !1,
        autoTimeout: 5e3,
        autoPauseOnHover: !0,
        showNavigation: !0,
        showPagination: !0,
        rewindNav: !0,
        scrollByPage: !1,
        defaultFilter: "*",
        filterDeeplinking: !1,
        animationType: "fadeOut",
        gridAdjustment: "responsive",
        mediaQueries: !1,
        gapHorizontal: 10,
        gapVertical: 10,
        caption: "pushTop",
        displayType: "fadeIn",
        displayTypeSpeed: 400,
        lightboxDelegate: ".cbp-lightbox",
        lightboxGallery: !0,
        lightboxTitleSrc: "data-title",
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        singlePageDelegate: ".cbp-singlePage",
        singlePageDeeplinking: !0,
        singlePageStickyNavigation: !0,
        singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
        singlePageAnimation: "left",
        singlePageCallback: null,
        singlePageInlineDelegate: ".cbp-singlePageInline",
        singlePageInlineDeeplinking: !1,
        singlePageInlinePosition: "top",
        singlePageInlineInFocus: !0,
        singlePageInlineCallback: null,
        plugins: {}
    },
    function(e, t, n, o) {
        "use strict";
        var i = e.fn.cubeportfolio.constructor,
            a = e(t);
        i["private"] = {
            publicEvents: function(t, n, o) {
                var i = this;
                i.events = [], i.initEvent = function(e) {
                    0 === i.events.length && i.scrollEvent(), i.events.push(e)
                }, i.destroyEvent = function(n) {
                    i.events = e.map(i.events, function(e, t) {
                        if (e.instance !== n) return e
                    }), 0 === i.events.length && a.off(t)
                }, i.scrollEvent = function() {
                    var r;
                    a.on(t, function() {
                        clearTimeout(r), r = setTimeout(function() {
                            e.isFunction(o) && o.call(i) || e.each(i.events, function(e, t) {
                                t.fn.call(t.instance)
                            })
                        }, n)
                    })
                }
            },
            checkInstance: function(t) {
                var n = e.data(this, "cubeportfolio");
                if (!n) throw new Error("cubeportfolio is not initialized. Initialize it before calling " + t + " method!");
                return n.triggerEvent("publicMethod"), n
            },
            browserInfo: function() {
                var e, n, o = i["private"],
                    a = navigator.appVersion; - 1 !== a.indexOf("MSIE 8.") ? o.browser = "ie8" : -1 !== a.indexOf("MSIE 9.") ? o.browser = "ie9" : -1 !== a.indexOf("MSIE 10.") ? o.browser = "ie10" : t.ActiveXObject || "ActiveXObject" in t ? o.browser = "ie11" : /android/gi.test(a) ? o.browser = "android" : /iphone|ipad|ipod/gi.test(a) ? o.browser = "ios" : /chrome/gi.test(a) ? o.browser = "chrome" : o.browser = "", void 0 !== typeof o.styleSupport("perspective") && (e = o.styleSupport("transition"), o.transitionend = {
                    WebkitTransition: "webkitTransitionEnd",
                    transition: "transitionend"
                }[e], n = o.styleSupport("animation"), o.animationend = {
                    WebkitAnimation: "webkitAnimationEnd",
                    animation: "animationend"
                }[n], o.animationDuration = {
                    WebkitAnimation: "webkitAnimationDuration",
                    animation: "animationDuration"
                }[n], o.animationDelay = {
                    WebkitAnimation: "webkitAnimationDelay",
                    animation: "animationDelay"
                }[n], o.transform = o.styleSupport("transform"), e && n && o.transform && (o.modernBrowser = !0))
            },
            styleSupport: function(e) {
                var t, o = "Webkit" + e.charAt(0).toUpperCase() + e.slice(1),
                    i = n.createElement("div");
                return e in i.style ? t = e : o in i.style && (t = o), i = null, t
            }
        }, i["private"].browserInfo(), i["private"].resize = new i["private"].publicEvents("resize.cbp", 50, function() {
            if (t.innerHeight == screen.height) return !0
        })
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";
        var i = e.fn.cubeportfolio.constructor;
        i["public"] = {
            init: function(e, t) {
                new i(this, e, t)
            },
            destroy: function(t) {
                var n = i["private"].checkInstance.call(this, "destroy");
                n.triggerEvent("beforeDestroy"), e.removeData(this, "cubeportfolio"), n.blocks.removeData("cbp"), n.$obj.removeClass("cbp-ready").removeAttr("style"), n.$ul.removeClass("cbp-wrapper"), i["private"].resize.destroyEvent(n), n.$obj.off(".cbp"), n.blocks.removeClass("cbp-item-off").removeAttr("style"), n.blocks.find(".cbp-item-wrapper").each(function(t, n) {
                    var o = e(n),
                        i = o.children();
                    i.length ? i.unwrap() : o.remove()
                }), n.destroySlider && n.destroySlider(), n.$ul.unwrap(), n.addedWrapp && n.blocks.unwrap(), 0 === n.blocks.length && n.$ul.remove(), e.each(n.plugins, function(e, t) {
                    "function" == typeof t.destroy && t.destroy()
                }), e.isFunction(t) && t.call(n), n.triggerEvent("afterDestroy")
            },
            filter: function(t, n) {
                var o, a = i["private"].checkInstance.call(this, "filter");
                if (!a.isAnimating) {
                    if (a.isAnimating = !0, e.isFunction(n) && a.registerEvent("filterFinish", n, !0), e.isFunction(t)) {
                        if (void 0 === (o = t.call(a, a.blocks))) throw new Error("When you call cubeportfolio API `filter` method with a param of type function you must return the blocks that will be visible.")
                    } else {
                        if (a.options.filterDeeplinking) {
                            var r = location.href.replace(/#cbpf=(.*?)([#\?&]|$)/gi, "");
                            location.href = r + "#cbpf=" + encodeURIComponent(t), a.singlePage && a.singlePage.url && (a.singlePage.url = location.href)
                        }
                        a.defaultFilter = t, o = a.filterConcat(a.defaultFilter)
                    }
                    a.triggerEvent("filterStart", o), a.singlePageInline && a.singlePageInline.isOpen ? a.singlePageInline.close("promise", {
                        callback: function() {
                            a.computeFilter(o)
                        }
                    }) : a.computeFilter(o)
                }
            },
            showCounter: function(t, n) {
                var o = i["private"].checkInstance.call(this, "showCounter");
                e.isFunction(n) && o.registerEvent("showCounterFinish", n, !0), o.elems = t, t.each(function() {
                    var t = e(this),
                        n = o.blocks.filter(t.data("filter")).length;
                    t.find(".cbp-filter-counter").text(n)
                }), o.triggerEvent("showCounterFinish", t)
            },
            appendItems: function(e, t) {
                i["public"].append.call(this, e, t)
            },
            append: function(t, n) {
                var o = i["private"].checkInstance.call(this, "append"),
                    a = e(t).filter(".cbp-item");
                o.isAnimating || a.length < 1 ? e.isFunction(n) && n.call(o, a) : (o.isAnimating = !0, o.singlePageInline && o.singlePageInline.isOpen ? o.singlePageInline.close("promise", {
                    callback: function() {
                        o.addItems(a, n, "append")
                    }
                }) : o.addItems(a, n, "append"))
            },
            prepend: function(t, n) {
                var o = i["private"].checkInstance.call(this, "prepend"),
                    a = e(t).filter(".cbp-item");
                o.isAnimating || a.length < 1 ? e.isFunction(n) && n.call(o, a) : (o.isAnimating = !0, o.singlePageInline && o.singlePageInline.isOpen ? o.singlePageInline.close("promise", {
                    callback: function() {
                        o.addItems(a, n, "prepend")
                    }
                }) : o.addItems(a, n, "prepend"))
            },
            remove: function(t, n) {
                var o = i["private"].checkInstance.call(this, "remove"),
                    a = e(t).filter(".cbp-item");
                o.isAnimating || a.length < 1 ? e.isFunction(n) && n.call(o, a) : (o.isAnimating = !0, o.singlePageInline && o.singlePageInline.isOpen ? o.singlePageInline.close("promise", {
                    callback: function() {
                        o.removeItems(a, n)
                    }
                }) : o.removeItems(a, n))
            },
            layout: function(t) {
                var n = i["private"].checkInstance.call(this, "layout");
                n.width = n.$obj.outerWidth(), n.isAnimating || n.width <= 0 ? e.isFunction(t) && t.call(n) : ("alignCenter" === n.options.gridAdjustment && (n.wrapper[0].style.maxWidth = ""), n.storeData(n.blocks), n.layoutAndAdjustment(), e.isFunction(t) && t.call(n))
            }
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";
        var i = e.fn.cubeportfolio.constructor;
        e.extend(i.prototype, {
            updateSliderPagination: function() {
                var t, n, o = this;
                if (o.options.showPagination) {
                    for (t = Math.ceil(o.blocksOn.length / o.cols), o.navPagination.empty(), n = t - 1; n >= 0; n--) e("<div/>", {
                        "class": "cbp-nav-pagination-item",
                        "data-slider-action": "jumpTo"
                    }).appendTo(o.navPagination);
                    o.navPaginationItems = o.navPagination.children()
                }
                o.enableDisableNavSlider()
            },
            destroySlider: function() {
                var t = this;
                "slider" === t.options.layoutMode && (t.$obj.removeClass("cbp-mode-slider"), t.$ul.removeAttr("style"), t.$ul.off(".cbp"), e(n).off(".cbp"), t.options.auto && t.stopSliderAuto())
            },
            nextSlider: function(e) {
                var t = this;
                if (t.isEndSlider()) {
                    if (!t.isRewindNav()) return;
                    t.sliderActive = 0
                } else t.options.scrollByPage ? t.sliderActive = Math.min(t.sliderActive + t.cols, t.blocksOn.length - t.cols) : t.sliderActive += 1;
                t.goToSlider()
            },
            prevSlider: function(e) {
                var t = this;
                if (t.isStartSlider()) {
                    if (!t.isRewindNav()) return;
                    t.sliderActive = t.blocksOn.length - t.cols
                } else t.options.scrollByPage ? t.sliderActive = Math.max(0, t.sliderActive - t.cols) : t.sliderActive -= 1;
                t.goToSlider()
            },
            jumpToSlider: function(e) {
                var t = this,
                    n = Math.min(e.index() * t.cols, t.blocksOn.length - t.cols);
                n !== t.sliderActive && (t.sliderActive = n, t.goToSlider())
            },
            jumpDragToSlider: function(e) {
                var t, n, o, i = this,
                    a = e > 0;
                i.options.scrollByPage ? (t = i.cols * i.columnWidth, n = i.cols) : (t = i.columnWidth, n = 1), e = Math.abs(e), o = Math.floor(e / t) * n, e % t > 20 && (o += n), i.sliderActive = a ? Math.min(i.sliderActive + o, i.blocksOn.length - i.cols) : Math.max(0, i.sliderActive - o), i.goToSlider()
            },
            isStartSlider: function() {
                return 0 === this.sliderActive
            },
            isEndSlider: function() {
                var e = this;
                return e.sliderActive + e.cols > e.blocksOn.length - 1
            },
            goToSlider: function() {
                var e = this;
                e.enableDisableNavSlider(), e.updateSliderPosition()
            },
            startSliderAuto: function() {
                var e = this;
                e.isDrag ? e.stopSliderAuto() : e.timeout = setTimeout(function() {
                    e.nextSlider(), e.startSliderAuto()
                }, e.options.autoTimeout)
            },
            stopSliderAuto: function() {
                clearTimeout(this.timeout)
            },
            enableDisableNavSlider: function() {
                var e, t, n = this;
                n.isRewindNav() || (t = n.isStartSlider() ? "addClass" : "removeClass", n.navPrev[t]("cbp-nav-stop"), t = n.isEndSlider() ? "addClass" : "removeClass", n.navNext[t]("cbp-nav-stop")), n.options.showPagination && (e = n.options.scrollByPage ? Math.ceil(n.sliderActive / n.cols) : n.isEndSlider() ? n.navPaginationItems.length - 1 : Math.floor(n.sliderActive / n.cols), n.navPaginationItems.removeClass("cbp-nav-pagination-active").eq(e).addClass("cbp-nav-pagination-active")), n.customPagination && (e = n.options.scrollByPage ? Math.ceil(n.sliderActive / n.cols) : n.isEndSlider() ? n.customPaginationItems.length - 1 : Math.floor(n.sliderActive / n.cols), n.customPaginationItems.removeClass(n.customPaginationClass).eq(e).addClass(n.customPaginationClass))
            },
            isRewindNav: function() {
                var e = this;
                return !e.options.showNavigation || !(e.blocksOn.length <= e.cols) && !!e.options.rewindNav
            },
            sliderItemsLength: function() {
                return this.blocksOn.length <= this.cols
            },
            sliderLayout: function() {
                var t = this;
                t.blocksOn.each(function(n, o) {
                    var i = e(o).data("cbp");
                    i.leftNew = t.columnWidth * n, i.topNew = 0, t.sliderFreeSpaces.push({
                        topStart: i.heightAndGap
                    })
                }), t.getFreeSpacesForSlider(), t.$ul.width(t.columnWidth * t.blocksOn.length - t.options.gapVertical)
            },
            getFreeSpacesForSlider: function() {
                var e = this;
                e.freeSpaces = e.sliderFreeSpaces.slice(e.sliderActive, e.sliderActive + e.cols), e.freeSpaces.sort(function(e, t) {
                    return e.topStart > t.topStart ? 1 : e.topStart < t.topStart ? -1 : void 0
                })
            },
            updateSliderPosition: function() {
                var e = this,
                    t = -e.sliderActive * e.columnWidth;
                i["private"].modernBrowser ? e.$ul[0].style[i["private"].transform] = "translate3d(" + t + "px, 0px, 0)" : e.$ul[0].style.left = t + "px", e.getFreeSpacesForSlider(), e.resizeMainContainer()
            },
            dragSlider: function() {
                function a(t) {
                    b.sliderItemsLength() || (w ? h = t : t.preventDefault(), b.options.auto && b.stopSliderAuto(), m ? e(d).one("click.cbp", function() {
                        return !1
                    }) : (d = e(t.target), c = p(t).x, u = 0, f = -b.sliderActive * b.columnWidth, g = b.columnWidth * (b.blocksOn.length - b.cols), v.on(y.move, s), v.on(y.end, r), b.$obj.addClass("cbp-mode-slider-dragStart")))
                }

                function r(e) {
                    b.$obj.removeClass("cbp-mode-slider-dragStart"), m = !0, 0 !== u ? (d.one("click.cbp", function(e) {
                        return !1
                    }), requestAnimationFrame(function() {
                        b.jumpDragToSlider(u), b.$ul.one(i["private"].transitionend, l)
                    })) : l.call(b), v.off(y.move), v.off(y.end)
                }

                function s(e) {
                    ((u = c - p(e).x) > 8 || u < -8) && e.preventDefault(), b.isDrag = !0;
                    var t = f - u;
                    u < 0 && u < f ? t = (f - u) / 5 : u > 0 && f - u < -g && (t = (g + f - u) / 5 - g), i["private"].modernBrowser ? b.$ul[0].style[i["private"].transform] = "translate3d(" + t + "px, 0px, 0)" : b.$ul[0].style.left = t + "px"
                }

                function l() {
                    if (m = !1, b.isDrag = !1, b.options.auto) {
                        if (b.mouseIsEntered) return;
                        b.startSliderAuto()
                    }
                }

                function p(e) {
                    return e.originalEvent !== o && e.originalEvent.touches !== o && (e = e.originalEvent.touches[0]), {
                        x: e.pageX,
                        y: e.pageY
                    }
                }
                var c, u, d, f, g, h, b = this,
                    v = e(n),
                    m = !1,
                    y = {},
                    w = !1;
                b.isDrag = !1, "ontouchstart" in t || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? (y = {
                    start: "touchstart.cbp",
                    move: "touchmove.cbp",
                    end: "touchend.cbp"
                }, w = !0) : y = {
                    start: "mousedown.cbp",
                    move: "mousemove.cbp",
                    end: "mouseup.cbp"
                }, b.$ul.on(y.start, a)
            },
            sliderLayoutReset: function() {
                var e = this;
                e.freeSpaces = [], e.sliderFreeSpaces = []
            }
        })
    }(jQuery, window, document), "function" != typeof Object.create && (Object.create = function(e) {
        function t() {}
        return t.prototype = e, new t
    }),
    function() {
        for (var e = 0, t = ["moz", "webkit"], n = 0; n < t.length && !window.requestAnimationFrame; n++) window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(t, n) {
            var o = (new Date).getTime(),
                i = Math.max(0, 16 - (o - e)),
                a = window.setTimeout(function() {
                    t(o + i)
                }, i);
            return e = o + i, a
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
            clearTimeout(e)
        })
    }(),
    function(e, t, n, o) {
        "use strict";

        function i(e) {
            var t = this;
            t.parent = e, e.filterLayout = t.filterLayout, e.registerEvent("computeBlocksFinish", function(t) {
                e.blocksOn2On = e.blocksOnInitial.filter(t), e.blocksOn2Off = e.blocksOnInitial.not(t)
            })
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.filterLayout = function() {
            function t() {
                n.blocks.removeClass("cbp-item-on2off cbp-item-off2on cbp-item-on2on").each(function(t, n) {
                    var o = e(n).data("cbp");
                    o.left = o.leftNew, o.top = o.topNew, n.style.left = o.left + "px", n.style.top = o.top + "px", n.style[a["private"].transform] = ""
                }), n.blocksOff.addClass("cbp-item-off"), n.$obj.removeClass("cbp-animation-" + n.options.animationType), n.filterFinish()
            }
            var n = this;
            n.$obj.addClass("cbp-animation-" + n.options.animationType), n.blocksOn2On.addClass("cbp-item-on2on").each(function(t, n) {
                var o = e(n).data("cbp");
                n.style[a["private"].transform] = "translate3d(" + (o.leftNew - o.left) + "px, " + (o.topNew - o.top) + "px, 0)"
            }), n.blocksOn2Off.addClass("cbp-item-on2off"), n.blocksOff2On = n.blocksOn.filter(".cbp-item-off").removeClass("cbp-item-off").addClass("cbp-item-off2on").each(function(t, n) {
                var o = e(n).data("cbp");
                n.style.left = o.leftNew + "px", n.style.top = o.topNew + "px"
            }), n.blocksOn2Off.length ? n.blocksOn2Off.last().data("cbp").wrapper.one(a["private"].animationend, t) : n.blocksOff2On.length ? n.blocksOff2On.last().data("cbp").wrapper.one(a["private"].animationend, t) : n.blocksOn2On.length ? n.blocksOn2On.last().one(a["private"].transitionend, t) : t(), n.resizeMainContainer()
        }, i.prototype.destroy = function() {
            var e = this.parent;
            e.$obj.removeClass("cbp-animation-" + e.options.animationType)
        }, a.plugins.animationClassic = function(t) {
            return !a["private"].modernBrowser || e.inArray(t.options.animationType, ["boxShadow", "fadeOut", "flipBottom", "flipOut", "quicksand", "scaleSides", "skew"]) < 0 ? null : new i(t)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(e) {
            var t = this;
            t.parent = e, e.filterLayout = t.filterLayout
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.filterLayout = function() {
            function t() {
                n.wrapper[0].removeChild(o), "sequentially" === n.options.animationType && n.blocksOn.each(function(t, n) {
                    e(n).data("cbp").wrapper[0].style[a["private"].animationDelay] = ""
                }), n.$obj.removeClass("cbp-animation-" + n.options.animationType), n.filterFinish()
            }
            var n = this,
                o = n.$ul[0].cloneNode(!0);
            o.setAttribute("class", "cbp-wrapper-helper"), n.wrapper[0].insertBefore(o, n.$ul[0]), requestAnimationFrame(function() {
                n.$obj.addClass("cbp-animation-" + n.options.animationType), n.blocksOff.addClass("cbp-item-off"), n.blocksOn.removeClass("cbp-item-off").each(function(t, o) {
                    var i = e(o).data("cbp");
                    i.left = i.leftNew, i.top = i.topNew, o.style.left = i.left + "px", o.style.top = i.top + "px", "sequentially" === n.options.animationType && (i.wrapper[0].style[a["private"].animationDelay] = 60 * t + "ms")
                }), n.blocksOn.length ? n.blocksOn.last().data("cbp").wrapper.one(a["private"].animationend, t) : n.blocksOnInitial.length ? n.blocksOnInitial.last().data("cbp").wrapper.one(a["private"].animationend, t) : t(), n.resizeMainContainer()
            })
        }, i.prototype.destroy = function() {
            var e = this.parent;
            e.$obj.removeClass("cbp-animation-" + e.options.animationType)
        }, a.plugins.animationClone = function(t) {
            return !a["private"].modernBrowser || e.inArray(t.options.animationType, ["fadeOutTop", "slideLeft", "sequentially"]) < 0 ? null : new i(t)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(e) {
            var t = this;
            t.parent = e, e.filterLayout = t.filterLayout
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.filterLayout = function() {
            function t() {
                n.wrapper[0].removeChild(o[0]), n.$obj.removeClass("cbp-animation-" + n.options.animationType), n.blocks.each(function(t, n) {
                    e(n).data("cbp").wrapper[0].style[a["private"].animationDelay] = ""
                }), n.filterFinish()
            }
            var n = this,
                o = n.$ul.clone(!0, !0);
            o[0].setAttribute("class", "cbp-wrapper-helper"), n.wrapper[0].insertBefore(o[0], n.$ul[0]);
            var i = o.find(".cbp-item").not(".cbp-item-off");
            n.blocksAreSorted && n.sortBlocks(i, "top", "left"), i.children(".cbp-item-wrapper").each(function(e, t) {
                t.style[a["private"].animationDelay] = 50 * e + "ms"
            }), requestAnimationFrame(function() {
                n.$obj.addClass("cbp-animation-" + n.options.animationType), n.blocksOff.addClass("cbp-item-off"), n.blocksOn.removeClass("cbp-item-off").each(function(t, n) {
                    var o = e(n).data("cbp");
                    o.left = o.leftNew, o.top = o.topNew, n.style.left = o.left + "px", n.style.top = o.top + "px", o.wrapper[0].style[a["private"].animationDelay] = 50 * t + "ms"
                });
                var o = n.blocksOn.length,
                    r = i.length;
                0 === o && 0 === r ? t() : o < r ? i.last().children(".cbp-item-wrapper").one(a["private"].animationend, t) : n.blocksOn.last().data("cbp").wrapper.one(a["private"].animationend, t), n.resizeMainContainer()
            })
        }, i.prototype.destroy = function() {
            var e = this.parent;
            e.$obj.removeClass("cbp-animation-" + e.options.animationType)
        }, a.plugins.animationCloneDelay = function(t) {
            return !a["private"].modernBrowser || e.inArray(t.options.animationType, ["3dflip", "flipOutDelay", "foldLeft", "frontRow", "rotateRoom", "rotateSides", "scaleDown", "slideDelay", "unfold"]) < 0 ? null : new i(t)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(e) {
            var t = this;
            t.parent = e, e.filterLayout = t.filterLayout
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.filterLayout = function() {
            function t() {
                n.wrapper[0].removeChild(o), n.$obj.removeClass("cbp-animation-" + n.options.animationType), n.filterFinish()
            }
            var n = this,
                o = n.$ul[0].cloneNode(!0);
            o.setAttribute("class", "cbp-wrapper-helper"), n.wrapper[0].insertBefore(o, n.$ul[0]), requestAnimationFrame(function() {
                n.$obj.addClass("cbp-animation-" + n.options.animationType), n.blocksOff.addClass("cbp-item-off"), n.blocksOn.removeClass("cbp-item-off").each(function(t, n) {
                    var o = e(n).data("cbp");
                    o.left = o.leftNew, o.top = o.topNew, n.style.left = o.left + "px", n.style.top = o.top + "px"
                }), n.blocksOn.length ? n.$ul.one(a["private"].animationend, t) : n.blocksOnInitial.length ? e(o).one(a["private"].animationend, t) : t(), n.resizeMainContainer()
            })
        }, i.prototype.destroy = function() {
            var e = this.parent;
            e.$obj.removeClass("cbp-animation-" + e.options.animationType)
        }, a.plugins.animationWrapper = function(t) {
            return !a["private"].modernBrowser || e.inArray(t.options.animationType, ["bounceBottom", "bounceLeft", "bounceTop", "moveLeft"]) < 0 ? null : new i(t)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(e) {
            var t = this,
                n = e.options;
            t.parent = e, t.captionOn = n.caption, e.registerEvent("onMediaQueries", function(e) {
                e && e.hasOwnProperty("caption") ? t.captionOn !== e.caption && (t.destroy(), t.captionOn = e.caption, t.init()) : t.captionOn !== n.caption && (t.destroy(), t.captionOn = n.caption, t.init())
            }), t.init()
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.init = function() {
            var e = this;
            "" != e.captionOn && ("expand" === e.captionOn || a["private"].modernBrowser || (e.parent.options.caption = e.captionOn = "minimal"), e.parent.$obj.addClass("cbp-caption-active cbp-caption-" + e.captionOn))
        }, i.prototype.destroy = function() {
            this.parent.$obj.removeClass("cbp-caption-active cbp-caption-" + this.captionOn)
        }, a.plugins.caption = function(e) {
            return new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            this.parent = t, t.registerEvent("initFinish", function() {
                t.$obj.on("click.cbp", ".cbp-caption-defaultWrap", function(n) {
                    if (n.preventDefault(), !t.isAnimating) {
                        t.isAnimating = !0;
                        var o = e(this),
                            i = o.next(),
                            a = o.parent(),
                            r = {
                                position: "relative",
                                height: i.outerHeight(!0)
                            },
                            s = {
                                position: "relative",
                                height: 0
                            };
                        if (t.$obj.addClass("cbp-caption-expand-active"), a.hasClass("cbp-caption-expand-open")) {
                            var l = s;
                            s = r, r = l, a.removeClass("cbp-caption-expand-open")
                        }
                        i.css(r), t.$obj.one("pluginResize.cbp", function() {
                            t.isAnimating = !1, t.$obj.removeClass("cbp-caption-expand-active"), 0 === r.height && (a.removeClass("cbp-caption-expand-open"), i.attr("style", ""))
                        }), t.layoutAndAdjustment(!0), i.css(s), requestAnimationFrame(function() {
                            a.addClass("cbp-caption-expand-open"), i.css(r), t.triggerEvent("gridAdjust"), t.triggerEvent("resizeGrid")
                        })
                    }
                })
            }, !0)
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.destroy = function() {
            this.parent.$obj.find(".cbp-caption-defaultWrap").off("click.cbp").parent().removeClass("cbp-caption-expand-active")
        }, a.plugins.captionExpand = function(e) {
            return "expand" !== e.options.caption ? null : new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            t.registerEvent("initEndWrite", function() {
                if (!(t.width <= 0)) {
                    var n = e.Deferred();
                    t.pushQueue("delayFrame", n), t.blocksOn.each(function(e, n) {
                        n.style[a["private"].animationDelay] = e * t.options.displayTypeSpeed + "ms"
                    }), t.$obj.addClass("cbp-displayType-bottomToTop"), t.blocksOn.last().one(a["private"].animationend, function() {
                        t.$obj.removeClass("cbp-displayType-bottomToTop"), t.blocksOn.each(function(e, t) {
                            t.style[a["private"].animationDelay] = ""
                        }), n.resolve()
                    })
                }
            }, !0)
        }
        var a = e.fn.cubeportfolio.constructor;
        a.plugins.displayBottomToTop = function(e) {
            return a["private"].modernBrowser && "bottomToTop" === e.options.displayType && 0 !== e.blocksOn.length ? new i(e) : null
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            t.registerEvent("initEndWrite", function() {
                if (!(t.width <= 0)) {
                    var n = e.Deferred();
                    t.pushQueue("delayFrame", n), t.obj.style[a["private"].animationDuration] = t.options.displayTypeSpeed + "ms", t.$obj.addClass("cbp-displayType-fadeIn"), t.$obj.one(a["private"].animationend, function() {
                        t.$obj.removeClass("cbp-displayType-fadeIn"), t.obj.style[a["private"].animationDuration] = "", n.resolve()
                    })
                }
            }, !0)
        }
        var a = e.fn.cubeportfolio.constructor;
        a.plugins.displayFadeIn = function(e) {
            return !a["private"].modernBrowser || "lazyLoading" !== e.options.displayType && "fadeIn" !== e.options.displayType || 0 === e.blocksOn.length ? null : new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            t.registerEvent("initEndWrite", function() {
                if (!(t.width <= 0)) {
                    var n = e.Deferred();
                    t.pushQueue("delayFrame", n), t.obj.style[a["private"].animationDuration] = t.options.displayTypeSpeed + "ms", t.$obj.addClass("cbp-displayType-fadeInToTop"), t.$obj.one(a["private"].animationend, function() {
                        t.$obj.removeClass("cbp-displayType-fadeInToTop"), t.obj.style[a["private"].animationDuration] = "", n.resolve()
                    })
                }
            }, !0)
        }
        var a = e.fn.cubeportfolio.constructor;
        a.plugins.displayFadeInToTop = function(e) {
            return a["private"].modernBrowser && "fadeInToTop" === e.options.displayType && 0 !== e.blocksOn.length ? new i(e) : null
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            t.registerEvent("initEndWrite", function() {
                if (!(t.width <= 0)) {
                    var n = e.Deferred();
                    t.pushQueue("delayFrame", n), t.blocksOn.each(function(e, n) {
                        n.style[a["private"].animationDelay] = e * t.options.displayTypeSpeed + "ms"
                    }), t.$obj.addClass("cbp-displayType-sequentially"), t.blocksOn.last().one(a["private"].animationend, function() {
                        t.$obj.removeClass("cbp-displayType-sequentially"), t.blocksOn.each(function(e, t) {
                            t.style[a["private"].animationDelay] = ""
                        }), n.resolve()
                    })
                }
            }, !0)
        }
        var a = e.fn.cubeportfolio.constructor;
        a.plugins.displaySequentially = function(e) {
            return a["private"].modernBrowser && "sequentially" === e.options.displayType && 0 !== e.blocksOn.length ? new i(e) : null
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.filters = e(t.options.filters), n.filterData = [], t.registerEvent("afterPlugins", function(e) {
                n.filterFromUrl(), n.registerFilter()
            }), t.registerEvent("resetFiltersVisual", function() {
                var o = t.options.defaultFilter.split("|");
                n.filters.each(function(t, n) {
                    var i = e(n).find(".cbp-filter-item");
                    e.each(o, function(e, t) {
                        var n = i.filter('[data-filter="' + t + '"]');
                        if (n.length) return n.addClass("active").siblings().removeClass("active"), o.splice(e, 1), !1
                    })
                }), t.defaultFilter = t.options.defaultFilter
            })
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.registerFilter = function() {
            var t = this,
                n = t.parent,
                o = n.defaultFilter.split("|");
            t.wrap = t.filters.find(".cbp-l-filters-dropdownWrap").on({
                "mouseover.cbp": function() {
                    e(this).addClass("cbp-l-filters-dropdownWrap-open")
                },
                "mouseleave.cbp": function() {
                    e(this).removeClass("cbp-l-filters-dropdownWrap-open")
                }
            }), t.filters.each(function(i, a) {
                var r = e(a),
                    s = "*",
                    l = r.find(".cbp-filter-item"),
                    p = {};
                r.hasClass("cbp-l-filters-dropdown") && (p.wrap = r.find(".cbp-l-filters-dropdownWrap"), p.header = r.find(".cbp-l-filters-dropdownHeader"), p.headerText = p.header.text()), n.$obj.cubeportfolio("showCounter", l), e.each(o, function(e, t) {
                    if (l.filter('[data-filter="' + t + '"]').length) return s = t, o.splice(e, 1), !1
                }), e.data(a, "filterName", s), t.filterData.push(a), t.filtersCallback(p, l.filter('[data-filter="' + s + '"]')), l.on("click.cbp", function() {
                    var o = e(this);
                    if (!o.hasClass("active") && !n.isAnimating) {
                        t.filtersCallback(p, o), e.data(a, "filterName", o.data("filter"));
                        var i = e.map(t.filterData, function(t, n) {
                            var o = e.data(t, "filterName");
                            return "" !== o && "*" !== o ? o : null
                        });
                        i.length < 1 && (i = ["*"]);
                        var r = i.join("|");
                        n.defaultFilter !== r && n.$obj.cubeportfolio("filter", r)
                    }
                })
            })
        }, i.prototype.filtersCallback = function(t, n) {
            e.isEmptyObject(t) || (t.wrap.trigger("mouseleave.cbp"), t.headerText ? t.headerText = "" : t.header.html(n.html())), n.addClass("active").siblings().removeClass("active")
        }, i.prototype.filterFromUrl = function() {
            var e = /#cbpf=(.*?)([#\?&]|$)/gi.exec(location.href);
            null !== e && (this.parent.defaultFilter = decodeURIComponent(e[1]))
        }, i.prototype.destroy = function() {
            var e = this;
            e.filters.find(".cbp-filter-item").off(".cbp"), e.wrap.off(".cbp")
        }, a.plugins.filters = function(e) {
            return "" === e.options.filters ? null : new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = t.options.gapVertical,
                o = t.options.gapHorizontal;
            t.registerEvent("onMediaQueries", function(i) {
                t.options.gapVertical = i && i.hasOwnProperty("gapVertical") ? i.gapVertical : n, t.options.gapHorizontal = i && i.hasOwnProperty("gapHorizontal") ? i.gapHorizontal : o, t.blocks.each(function(n, o) {
                    var i = e(o).data("cbp");
                    i.widthAndGap = i.width + t.options.gapVertical, i.heightAndGap = i.height + t.options.gapHorizontal
                })
            })
        }
        e.fn.cubeportfolio.constructor.plugins.changeGapOnMediaQueries = function(e) {
            return new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.options = e.extend({}, r, n.parent.options.plugins.inlineSlider), n.runInit(), t.registerEvent("addItemsToDOM", function() {
                n.runInit()
            })
        }

        function a(e) {
            var t = this;
            e.hasClass("cbp-slider-inline-ready") || (e.addClass("cbp-slider-inline-ready"), t.items = e.find(".cbp-slider-wrapper").children(".cbp-slider-item"), t.active = t.items.filter(".cbp-slider-item--active").index(), t.total = t.items.length - 1, t.updateLeft(), e.find(".cbp-slider-next").on("click.cbp", function(e) {
                e.preventDefault(), t.active < t.total ? (t.active++, t.updateLeft()) : t.active === t.total && (t.active = 0, t.updateLeft())
            }), e.find(".cbp-slider-prev").on("click.cbp", function(e) {
                e.preventDefault(), t.active > 0 ? (t.active--, t.updateLeft()) : 0 === t.active && (t.active = t.total, t.updateLeft())
            }))
        }
        var r = {},
            s = e.fn.cubeportfolio.constructor;
        a.prototype.updateLeft = function() {
            var e = this;
            e.items.removeClass("cbp-slider-item--active"), e.items.eq(e.active).addClass("cbp-slider-item--active"), e.items.each(function(t, n) {
                n.style.left = t - e.active + "00%"
            })
        }, i.prototype.runInit = function() {
            var t = this;
            t.parent.$obj.find(".cbp-slider-inline").not(".cbp-slider-inline-ready").each(function(n, o) {
                var i = e(o),
                    r = i.find(".cbp-slider-item--active").find("img")[0];
                r.hasAttribute("data-cbp-src") ? t.parent.$obj.on("lazyLoad.cbp", function(e, t) {
                    t.src === r.src && new a(i)
                }) : new a(i)
            })
        }, i.prototype.destroy = function() {
            var t = this;
            t.parent.$obj.find(".cbp-slider-next").off("click.cbp"), t.parent.$obj.find(".cbp-slider-prev").off("click.cbp"), t.parent.$obj.off("lazyLoad.cbp"), t.parent.$obj.find(".cbp-slider-inline").each(function(t, n) {
                var o = e(n);
                o.removeClass("cbp-slider-inline-ready");
                var i = o.find(".cbp-slider-item");
                i.removeClass("cbp-slider-item--active"), i.removeAttr("style"), i.eq(0).addClass("cbp-slider-item--active")
            })
        }, s.plugins.inlineSlider = function(e) {
            return new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.options = e.extend({}, a, n.parent.options.plugins.lazyLoad), t.registerEvent("initFinish", function() {
                n.loadImages(), t.registerEvent("resizeMainContainer", function() {
                    n.loadImages()
                }), t.registerEvent("filterFinish", function() {
                    n.loadImages()
                }), r["private"].lazyLoadScroll.initEvent({
                    instance: n,
                    fn: n.loadImages
                })
            }, !0)
        }
        var a = {
                loadingClass: "cbp-lazyload",
                threshold: 400
            },
            r = e.fn.cubeportfolio.constructor,
            s = e(t);
        r["private"].lazyLoadScroll = new r["private"].publicEvents("scroll.cbplazyLoad", 50), i.prototype.loadImages = function() {
            var t = this,
                n = t.parent.$obj.find("img").filter("[data-cbp-src]");
            0 !== n.length && (t.screenHeight = s.height(), n.each(function(n, o) {
                var i = e(o.parentNode);
                if (t.isElementInScreen(o)) {
                    var a = o.getAttribute("data-cbp-src");
                    null === t.parent.checkSrc(e("<img>").attr("src", a)) ? (t.removeLazyLoad(o, a), i.removeClass(t.options.loadingClass)) : (i.addClass(t.options.loadingClass), e("<img>").on("load.cbp error.cbp", function() {
                        t.removeLazyLoad(o, a, i)
                    }).attr("src", a))
                } else i.addClass(t.options.loadingClass)
            }))
        }, i.prototype.removeLazyLoad = function(t, n, o) {
            var i = this;
            t.src = n, t.removeAttribute("data-cbp-src"), i.parent.removeAttrImage(t), i.parent.$obj.trigger("lazyLoad.cbp", t), o && (r["private"].modernBrowser ? e(t).one(r["private"].transitionend, function() {
                o.removeClass(i.options.loadingClass)
            }) : o.removeClass(i.options.loadingClass))
        }, i.prototype.isElementInScreen = function(e) {
            var t = this,
                n = e.getBoundingClientRect(),
                o = n.bottom + t.options.threshold,
                i = t.screenHeight + o - (n.top - t.options.threshold);
            return o >= 0 && o <= i
        }, i.prototype.destroy = function() {
            r["private"].lazyLoadScroll.destroyEvent(this)
        }, r.plugins.lazyLoad = function(e) {
            return new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.options = e.extend({}, a, n.parent.options.plugins.loadMore), n.loadMore = e(n.options.element).find(".cbp-l-loadMore-link"), 0 !== n.loadMore.length && (n.loadItems = n.loadMore.find(".cbp-l-loadMore-loadItems"), "0" === n.loadItems.text() && n.loadMore.addClass("cbp-l-loadMore-stop"), t.registerEvent("filterStart", function(e) {
                n.populateItems().then(function() {
                    var t = n.items.filter(e).length;
                    t > 0 ? (n.loadMore.removeClass("cbp-l-loadMore-stop"), n.loadItems.html(t)) : n.loadMore.addClass("cbp-l-loadMore-stop")
                })
            }), n[n.options.action]())
        }
        var a = {
                element: "",
                action: "click",
                loadItems: 3
            },
            r = e.fn.cubeportfolio.constructor;
        i.prototype.populateItems = function() {
            var t = this;
            return t.items ? e.Deferred().resolve() : (t.items = e(), e.ajax({
                url: t.loadMore.attr("href"),
                type: "GET",
                dataType: "HTML"
            }).done(function(n) {
                var o = e.map(n.split(/\r?\n/), function(t, n) {
                    return e.trim(t)
                }).join("");
                0 !== o.length && e.each(e.parseHTML(o), function(n, o) {
                    e(o).hasClass("cbp-item") ? t.items = t.items.add(o) : e.each(o.children, function(n, o) {
                        e(o).hasClass("cbp-item") && (t.items = t.items.add(o))
                    })
                })
            }).fail(function() {
                t.items = null, t.loadMore.removeClass("cbp-l-loadMore-loading")
            }))
        }, i.prototype.populateInsertItems = function(t) {
            var n = this,
                o = [],
                i = n.parent.defaultFilter,
                a = 0;
            n.items.each(function(t, r) {
                if (a === n.options.loadItems) return !1;
                i && "*" !== i ? e(r).filter(i).length && (o.push(r), n.items[t] = null, a++) : (o.push(r), n.items[t] = null, a++)
            }), n.items = n.items.map(function(e, t) {
                return t
            }), 0 !== o.length ? n.parent.$obj.cubeportfolio("append", o, t) : n.loadMore.removeClass("cbp-l-loadMore-loading").addClass("cbp-l-loadMore-stop")
        }, i.prototype.click = function() {
            function e() {
                t.loadMore.removeClass("cbp-l-loadMore-loading");
                var e, n = t.parent.defaultFilter;
                0 === (e = n && "*" !== n ? t.items.filter(n).length : t.items.length) ? t.loadMore.addClass("cbp-l-loadMore-stop") : t.loadItems.html(e)
            }
            var t = this;
            t.loadMore.on("click.cbp", function(n) {
                n.preventDefault(), t.parent.isAnimating || t.loadMore.hasClass("cbp-l-loadMore-stop") || (t.loadMore.addClass("cbp-l-loadMore-loading"), t.populateItems().then(function() {
                    t.populateInsertItems(e)
                }))
            })
        }, i.prototype.auto = function() {
            function n() {
                s || i.loadMore.hasClass("cbp-l-loadMore-stop") || i.loadMore.offset().top - 200 > a.scrollTop() + a.height() || (s = !0, i.populateItems().then(function() {
                    i.populateInsertItems(o)
                }).fail(function() {
                    s = !1
                }))
            }

            function o() {
                var e, t = i.parent.defaultFilter;
                0 === (e = t && "*" !== t ? i.items.filter(t).length : i.items.length) ? i.loadMore.removeClass("cbp-l-loadMore-loading").addClass("cbp-l-loadMore-stop") : (i.loadItems.html(e), a.trigger("scroll.loadMore")), s = !1, 0 === i.items.length && (r["private"].loadMoreScroll.destroyEvent(i), i.parent.$obj.off("filterComplete.cbp"))
            }
            var i = this,
                a = e(t),
                s = !1;
            r["private"].loadMoreScroll = new r["private"].publicEvents("scroll.loadMore", 100), i.parent.$obj.one("initComplete.cbp", function() {
                i.loadMore.addClass("cbp-l-loadMore-loading").on("click.cbp", function(e) {
                    e.preventDefault()
                }), r["private"].loadMoreScroll.initEvent({
                    instance: i,
                    fn: function() {
                        i.parent.isAnimating || n()
                    }
                }), i.parent.$obj.on("filterComplete.cbp", function() {
                    n()
                }), n()
            })
        }, i.prototype.destroy = function() {
            this.loadMore.off(".cbp"), r["private"].loadMoreScroll && r["private"].loadMoreScroll.destroyEvent(this)
        }, r.plugins.loadMore = function(e) {
            var t = e.options.plugins;
            return e.options.loadMore && (t.loadMore || (t.loadMore = {}), t.loadMore.element = e.options.loadMore), e.options.loadMoreAction && (t.loadMore || (t.loadMore = {}), t.loadMore.action = e.options.loadMoreAction), t.loadMore && void 0 !== t.loadMore.selector && (t.loadMore.element = t.loadMore.selector, delete t.loadMore.selector), t.loadMore && t.loadMore.element ? new i(e) : null
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(e) {
            var t = this;
            t.parent = e, !1 === e.options.lightboxShowCounter && (e.options.lightboxCounter = ""), !1 === e.options.singlePageShowCounter && (e.options.singlePageCounter = ""), e.registerEvent("initStartRead", function() {
                t.run()
            }, !0)
        }
        var a = e.fn.cubeportfolio.constructor,
            r = {
                delay: 0
            },
            s = {
                init: function(t, o) {
                    var i, a = this;
                    if (a.cubeportfolio = t, a.type = o, a.isOpen = !1, a.options = a.cubeportfolio.options, "lightbox" === o && (a.cubeportfolio.registerEvent("resizeWindow", function() {
                            a.resizeImage()
                        }), a.localOptions = e.extend({}, r, a.cubeportfolio.options.plugins.lightbox)), "singlePageInline" !== o) {
                        if (a.createMarkup(), "singlePage" === o) {
                            if (a.cubeportfolio.registerEvent("resizeWindow", function() {
                                    if (a.options.singlePageStickyNavigation) {
                                        var e = a.contentWrap[0].clientWidth;
                                        e > 0 && (a.navigationWrap.width(e), a.navigation.width(e))
                                    }
                                }), a.options.singlePageDeeplinking) {
                                a.url = location.href, "#" === a.url.slice(-1) && (a.url = a.url.slice(0, -1));
                                var s = a.url.split("#cbp="),
                                    l = s.shift();
                                if (e.each(s, function(t, n) {
                                        if (a.cubeportfolio.blocksOn.each(function(t, o) {
                                                var r = e(o).find(a.options.singlePageDelegate + '[href="' + n + '"]');
                                                if (r.length) return i = r, !1
                                            }), i) return !1
                                    }), i) {
                                    a.url = l;
                                    var p = i,
                                        c = p.attr("data-cbp-singlePage"),
                                        u = [];
                                    c ? u = p.closest(e(".cbp-item")).find('[data-cbp-singlePage="' + c + '"]') : a.cubeportfolio.blocksOn.each(function(t, n) {
                                        var o = e(n);
                                        o.not(".cbp-item-off") && o.find(a.options.singlePageDelegate).each(function(t, n) {
                                            e(n).attr("data-cbp-singlePage") || u.push(n)
                                        })
                                    }), a.openSinglePage(u, i[0])
                                } else if (s.length) {
                                    var d = n.createElement("a");
                                    d.setAttribute("href", s[0]), a.openSinglePage([d], d)
                                }
                            }
                            a.localOptions = e.extend({}, r, a.cubeportfolio.options.plugins.singlePage)
                        }
                    } else {
                        if (a.height = 0, a.createMarkupSinglePageInline(), a.cubeportfolio.registerEvent("resizeGrid", function() {
                                a.isOpen && a.close()
                            }), a.options.singlePageInlineDeeplinking) {
                            a.url = location.href, "#" === a.url.slice(-1) && (a.url = a.url.slice(0, -1));
                            l = (s = a.url.split("#cbpi=")).shift();
                            e.each(s, function(t, n) {
                                if (a.cubeportfolio.blocksOn.each(function(t, o) {
                                        var r = e(o).find(a.options.singlePageInlineDelegate + '[href="' + n + '"]');
                                        if (r.length) return i = r, !1
                                    }), i) return !1
                            }), i && a.cubeportfolio.registerEvent("initFinish", function() {
                                a.openSinglePageInline(a.cubeportfolio.blocksOn, i[0])
                            }, !0)
                        }
                        a.localOptions = e.extend({}, r, a.cubeportfolio.options.plugins.singlePageInline)
                    }
                },
                createMarkup: function() {
                    var t = this,
                        o = "";
                    "singlePage" === t.type && "left" !== t.options.singlePageAnimation && (o = " cbp-popup-singlePage-" + t.options.singlePageAnimation), t.wrap = e("<div/>", {
                        "class": "cbp-popup-wrap cbp-popup-" + t.type + o,
                        "data-action": "lightbox" === t.type ? "close" : ""
                    }).on("click.cbp", function(n) {
                        if (!t.stopEvents) {
                            var o = e(n.target).attr("data-action");
                            t[o] && (t[o](), n.preventDefault())
                        }
                    }), "singlePage" === t.type ? (t.contentWrap = e("<div/>", {
                        "class": "cbp-popup-content-wrap"
                    }).appendTo(t.wrap), "ios" === a["private"].browser && t.contentWrap.css("overflow", "auto"), t.content = e("<div/>", {
                        "class": "cbp-popup-content"
                    }).appendTo(t.contentWrap)) : t.content = e("<div/>", {
                        "class": "cbp-popup-content"
                    }).appendTo(t.wrap), e("<div/>", {
                        "class": "cbp-popup-loadingBox"
                    }).appendTo(t.wrap), "ie8" === a["private"].browser && (t.bg = e("<div/>", {
                        "class": "cbp-popup-ie8bg",
                        "data-action": "lightbox" === t.type ? "close" : ""
                    }).appendTo(t.wrap)), "singlePage" === t.type && !1 === t.options.singlePageStickyNavigation ? t.navigationWrap = e("<div/>", {
                        "class": "cbp-popup-navigation-wrap"
                    }).appendTo(t.contentWrap) : t.navigationWrap = e("<div/>", {
                        "class": "cbp-popup-navigation-wrap"
                    }).appendTo(t.wrap), t.navigation = e("<div/>", {
                        "class": "cbp-popup-navigation"
                    }).appendTo(t.navigationWrap), t.closeButton = e("<div/>", {
                        "class": "cbp-popup-close",
                        title: "Close (Esc arrow key)",
                        "data-action": "close"
                    }).appendTo(t.navigation), t.nextButton = e("<div/>", {
                        "class": "cbp-popup-next",
                        title: "Next (Right arrow key)",
                        "data-action": "next"
                    }).appendTo(t.navigation), t.prevButton = e("<div/>", {
                        "class": "cbp-popup-prev",
                        title: "Previous (Left arrow key)",
                        "data-action": "prev"
                    }).appendTo(t.navigation), "singlePage" === t.type && (t.options.singlePageCounter && (t.counter = e(t.options.singlePageCounter).appendTo(t.navigation), t.counter.text("")), t.content.on("click.cbp", t.options.singlePageDelegate, function(e) {
                        e.preventDefault();
                        var o, i, a = t.dataArray.length,
                            r = this.getAttribute("href");
                        for (o = 0; o < a; o++)
                            if (t.dataArray[o].url === r) {
                                i = o;
                                break
                            }
                        if (void 0 === i) {
                            var s = n.createElement("a");
                            s.setAttribute("href", r), t.dataArray = [{
                                url: r,
                                element: s
                            }], t.counterTotal = 1, t.nextButton.hide(), t.prevButton.hide(), t.singlePageJumpTo(0)
                        } else t.singlePageJumpTo(i - t.current)
                    }), t.contentWrap.on("mousewheel.cbp DOMMouseScroll.cbp", function(e) {
                        e.stopImmediatePropagation()
                    })), e(n).on("keydown.cbp", function(e) {
                        t.isOpen && (t.stopEvents || (l && e.stopImmediatePropagation(), 37 === e.keyCode ? t.prev() : 39 === e.keyCode ? t.next() : 27 === e.keyCode && t.close()))
                    })
                },
                createMarkupSinglePageInline: function() {
                    var t = this;
                    t.wrap = e("<div/>", {
                        "class": "cbp-popup-singlePageInline"
                    }).on("click.cbp", function(n) {
                        if (!t.stopEvents) {
                            var o = e(n.target).attr("data-action");
                            o && t[o] && (t[o](), n.preventDefault())
                        }
                    }), t.content = e("<div/>", {
                        "class": "cbp-popup-content"
                    }).appendTo(t.wrap), t.navigation = e("<div/>", {
                        "class": "cbp-popup-navigation"
                    }).appendTo(t.wrap), t.closeButton = e("<div/>", {
                        "class": "cbp-popup-close",
                        title: "Close (Esc arrow key)",
                        "data-action": "close"
                    }).appendTo(t.navigation)
                },
                destroy: function() {
                    var t = this,
                        o = e("body");
                    e(n).off("keydown.cbp"), o.off("click.cbp", t.options.lightboxDelegate), o.off("click.cbp", t.options.singlePageDelegate), t.content.off("click.cbp", t.options.singlePageDelegate), t.cubeportfolio.$obj.off("click.cbp", t.options.singlePageInlineDelegate), t.cubeportfolio.$obj.off("click.cbp", t.options.lightboxDelegate), t.cubeportfolio.$obj.off("click.cbp", t.options.singlePageDelegate), t.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"), t.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"), t.wrap.remove()
                },
                openLightbox: function(o, i) {
                    var a, r, s = this,
                        p = 0,
                        c = [];
                    if (!s.isOpen) {
                        if (l = !0, s.isOpen = !0, s.stopEvents = !1, s.dataArray = [], s.current = null, null === (a = i.getAttribute("href"))) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                        e.each(o, function(t, n) {
                            var o, i = n.getAttribute("href"),
                                r = i,
                                l = "isImage";
                            if (-1 === e.inArray(i, c)) {
                                if (a === i) s.current = p;
                                else if (!s.options.lightboxGallery) return;
                                if (/youtu\.?be/i.test(i)) {
                                    var u = i.lastIndexOf("v=") + 2;
                                    1 === u && (u = i.lastIndexOf("/") + 1), o = i.substring(u), /autoplay=/i.test(o) || (o += "&autoplay=1"), r = "//www.youtube.com/embed/" + (o = o.replace(/\?|&/, "?")), l = "isYoutube"
                                } else /vimeo\.com/i.test(i) ? (o = i.substring(i.lastIndexOf("/") + 1), /autoplay=/i.test(o) || (o += "&autoplay=1"), r = "//player.vimeo.com/video/" + (o = o.replace(/\?|&/, "?")), l = "isVimeo") : /www\.ted\.com/i.test(i) ? (r = "http://embed.ted.com/talks/" + i.substring(i.lastIndexOf("/") + 1) + ".html", l = "isTed") : /soundcloud\.com/i.test(i) ? (r = i, l = "isSoundCloud") : /(\.mp4)|(\.ogg)|(\.ogv)|(\.webm)/i.test(i) ? (r = -1 !== i.indexOf("|") ? i.split("|") : i.split("%7C"), l = "isSelfHostedVideo") : /\.mp3$/i.test(i) && (r = i, l = "isSelfHostedAudio");
                                s.dataArray.push({
                                    src: r,
                                    title: n.getAttribute(s.options.lightboxTitleSrc),
                                    type: l
                                }), p++
                            }
                            c.push(i)
                        }), s.counterTotal = s.dataArray.length, 1 === s.counterTotal ? (s.nextButton.hide(), s.prevButton.hide(), s.dataActionImg = "") : (s.nextButton.show(), s.prevButton.show(), s.dataActionImg = 'data-action="next"'), s.wrap.appendTo(n.body), s.scrollTop = e(t).scrollTop(), s.originalStyle = e("html").attr("style"), e("html").css({
                            overflow: "hidden",
                            marginRight: t.innerWidth - e(n).width()
                        }), s.wrap.addClass("cbp-popup-transitionend"), s.wrap.show(), r = s.dataArray[s.current], s[r.type](r)
                    }
                },
                openSinglePage: function(o, i) {
                    var r, s = this,
                        l = 0,
                        p = [];
                    if (!s.isOpen) {
                        if (s.cubeportfolio.singlePageInline && s.cubeportfolio.singlePageInline.isOpen && s.cubeportfolio.singlePageInline.close(), s.isOpen = !0, s.stopEvents = !1, s.dataArray = [], s.current = null, null === (r = i.getAttribute("href"))) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                        if (e.each(o, function(t, n) {
                                var o = n.getAttribute("href"); - 1 === e.inArray(o, p) && (r === o && (s.current = l), s.dataArray.push({
                                    url: o,
                                    element: n
                                }), l++), p.push(o)
                            }), s.counterTotal = s.dataArray.length, 1 === s.counterTotal ? (s.nextButton.hide(), s.prevButton.hide()) : (s.nextButton.show(), s.prevButton.show()), s.wrap.appendTo(n.body), s.scrollTop = e(t).scrollTop(), s.contentWrap.scrollTop(0), s.wrap.show(), s.finishOpen = 2, s.navigationMobile = e(), s.wrap.one(a["private"].transitionend, function() {
                                e("html").css({
                                    overflow: "hidden",
                                    marginRight: t.innerWidth - e(n).width()
                                }), s.wrap.addClass("cbp-popup-transitionend"), s.options.singlePageStickyNavigation && (s.wrap.addClass("cbp-popup-singlePage-sticky"), s.navigationWrap.width(s.contentWrap[0].clientWidth)), --s.finishOpen <= 0 && s.updateSinglePageIsOpen.call(s)
                            }), "ie8" !== a["private"].browser && "ie9" !== a["private"].browser || (e("html").css({
                                overflow: "hidden",
                                marginRight: t.innerWidth - e(n).width()
                            }), s.wrap.addClass("cbp-popup-transitionend"), s.options.singlePageStickyNavigation && (s.navigationWrap.width(s.contentWrap[0].clientWidth), setTimeout(function() {
                                s.wrap.addClass("cbp-popup-singlePage-sticky")
                            }, 1e3)), s.finishOpen--), s.wrap.addClass("cbp-popup-loading"), s.wrap.offset(), s.wrap.addClass("cbp-popup-singlePage-open"), s.options.singlePageDeeplinking && (s.url = s.url.split("#cbp=")[0], location.href = s.url + "#cbp=" + s.dataArray[s.current].url), e.isFunction(s.options.singlePageCallback) && s.options.singlePageCallback.call(s, s.dataArray[s.current].url, s.dataArray[s.current].element), "ios" === a["private"].browser) {
                            var c = s.contentWrap[0];
                            c.addEventListener("touchstart", function() {
                                var e = c.scrollTop,
                                    t = c.scrollHeight,
                                    n = e + c.offsetHeight;
                                0 === e ? c.scrollTop = 1 : n === t && (c.scrollTop = e - 1)
                            })
                        }
                    }
                },
                openSinglePageInline: function(n, o, i) {
                    var a, r, s, l = this;
                    if (i = i || !1, l.fromOpen = i, l.storeBlocks = n, l.storeCurrentBlock = o, l.isOpen) return r = l.cubeportfolio.blocksOn.index(e(o).closest(".cbp-item")), void(l.dataArray[l.current].url !== o.getAttribute("href") || l.current !== r ? l.cubeportfolio.singlePageInline.close("open", {
                        blocks: n,
                        currentBlock: o,
                        fromOpen: !0
                    }) : l.close());
                    if (l.isOpen = !0, l.stopEvents = !1, l.dataArray = [], l.current = null, null === (a = o.getAttribute("href"))) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                    if (s = e(o).closest(".cbp-item")[0], n.each(function(e, t) {
                            s === t && (l.current = e)
                        }), l.dataArray[l.current] = {
                            url: a,
                            element: o
                        }, e(l.dataArray[l.current].element).parents(".cbp-item").addClass("cbp-singlePageInline-active"), l.counterTotal = n.length, l.wrap.insertBefore(l.cubeportfolio.wrapper), l.topDifference = 0, "top" === l.options.singlePageInlinePosition) l.blocksToMove = n, l.top = 0;
                    else if ("bottom" === l.options.singlePageInlinePosition) l.blocksToMove = e(), l.top = l.cubeportfolio.height;
                    else if ("above" === l.options.singlePageInlinePosition) {
                        var p = e(n[l.current]),
                            c = (u = p.data("cbp").top) + p.height();
                        l.top = u, l.blocksToMove = e(), n.each(function(t, n) {
                            var o = e(n),
                                i = o.data("cbp").top,
                                a = i + o.height();
                            a <= u || (i >= u && (l.blocksToMove = l.blocksToMove.add(n)), i < u && a > u && (l.top = a + l.options.gapHorizontal, a - u > l.topDifference && (l.topDifference = a - u + l.options.gapHorizontal)))
                        }), l.top = Math.max(l.top - l.options.gapHorizontal, 0)
                    } else {
                        var u = (p = e(n[l.current])).data("cbp").top,
                            c = u + p.height();
                        l.top = c, l.blocksToMove = e(), n.each(function(t, n) {
                            var o = e(n),
                                i = o.height(),
                                a = o.data("cbp").top,
                                r = a + i;
                            r <= c || (a >= c - i / 2 ? l.blocksToMove = l.blocksToMove.add(n) : r > c && a < c && (r > l.top && (l.top = r), r - c > l.topDifference && (l.topDifference = r - c)))
                        })
                    }
                    if (l.wrap[0].style.height = l.wrap.outerHeight(!0) + "px", l.deferredInline = e.Deferred(), l.options.singlePageInlineInFocus) {
                        l.scrollTop = e(t).scrollTop();
                        var d = l.cubeportfolio.$obj.offset().top + l.top - 100;
                        l.scrollTop !== d ? e("html,body").animate({
                            scrollTop: d
                        }, 350).promise().then(function() {
                            l.resizeSinglePageInline(), l.deferredInline.resolve()
                        }) : (l.resizeSinglePageInline(), l.deferredInline.resolve())
                    } else l.resizeSinglePageInline(), l.deferredInline.resolve();
                    l.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-open"), l.wrap.css({
                        top: l.top
                    }), l.options.singlePageInlineDeeplinking && (l.url = l.url.split("#cbpi=")[0], location.href = l.url + "#cbpi=" + l.dataArray[l.current].url), e.isFunction(l.options.singlePageInlineCallback) && l.options.singlePageInlineCallback.call(l, l.dataArray[l.current].url, l.dataArray[l.current].element)
                },
                resizeSinglePageInline: function() {
                    var e = this;
                    e.height = 0 === e.top || e.top === e.cubeportfolio.height ? e.wrap.outerHeight(!0) : e.wrap.outerHeight(!0) - e.options.gapHorizontal, e.height += e.topDifference, e.storeBlocks.each(function(e, t) {
                        a["private"].modernBrowser ? t.style[a["private"].transform] = "" : t.style.marginTop = ""
                    }), e.blocksToMove.each(function(t, n) {
                        a["private"].modernBrowser ? n.style[a["private"].transform] = "translate3d(0px, " + e.height + "px, 0)" : n.style.marginTop = e.height + "px"
                    }), e.cubeportfolio.obj.style.height = e.cubeportfolio.height + e.height + "px"
                },
                revertResizeSinglePageInline: function() {
                    var t = this;
                    t.deferredInline = e.Deferred(), t.storeBlocks.each(function(e, t) {
                        a["private"].modernBrowser ? t.style[a["private"].transform] = "" : t.style.marginTop = ""
                    }), t.cubeportfolio.obj.style.height = t.cubeportfolio.height + "px"
                },
                appendScriptsToWrap: function(e) {
                    var t = this,
                        o = 0,
                        i = function(a) {
                            var r = n.createElement("script"),
                                s = a.src;
                            r.type = "text/javascript", r.readyState ? r.onreadystatechange = function() {
                                "loaded" != r.readyState && "complete" != r.readyState || (r.onreadystatechange = null, e[++o] && i(e[o]))
                            } : r.onload = function() {
                                e[++o] && i(e[o])
                            }, s ? r.src = s : r.text = a.text, t.content[0].appendChild(r)
                        };
                    i(e[0])
                },
                updateSinglePage: function(t, n, o) {
                    var i, a = this;
                    a.content.addClass("cbp-popup-content").removeClass("cbp-popup-content-basic"), !1 === o && a.content.removeClass("cbp-popup-content").addClass("cbp-popup-content-basic"), a.counter && (i = e(a.getCounterMarkup(a.options.singlePageCounter, a.current + 1, a.counterTotal)), a.counter.text(i.text())), a.fromAJAX = {
                        html: t,
                        scripts: n
                    }, --a.finishOpen <= 0 && a.updateSinglePageIsOpen.call(a)
                },
                updateSinglePageIsOpen: function() {
                    var e, t = this;
                    t.wrap.addClass("cbp-popup-ready"), t.wrap.removeClass("cbp-popup-loading"), t.content.html(t.fromAJAX.html), t.fromAJAX.scripts && t.appendScriptsToWrap(t.fromAJAX.scripts), t.fromAJAX = {}, t.cubeportfolio.$obj.trigger("updateSinglePageStart.cbp"), (e = t.content.find(".cbp-slider")).length ? (e.find(".cbp-slider-item").addClass("cbp-item"), t.slider = e.cubeportfolio({
                        layoutMode: "slider",
                        mediaQueries: [{
                            width: 1,
                            cols: 1
                        }],
                        gapHorizontal: 0,
                        gapVertical: 0,
                        caption: "",
                        coverRatio: ""
                    })) : t.slider = null, t.checkForSocialLinks(t.content), t.cubeportfolio.$obj.trigger("updateSinglePageComplete.cbp")
                },
                checkForSocialLinks: function(e) {
                    var t = this;
                    t.createFacebookShare(e.find(".cbp-social-fb")), t.createTwitterShare(e.find(".cbp-social-twitter")), t.createGooglePlusShare(e.find(".cbp-social-googleplus")), t.createPinterestShare(e.find(".cbp-social-pinterest"))
                },
                createFacebookShare: function(e) {
                    e.length && !e.attr("onclick") && e.attr("onclick", "window.open('http://www.facebook.com/sharer.php?u=" + encodeURIComponent(t.location.href) + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=400'); return false;")
                },
                createTwitterShare: function(e) {
                    e.length && !e.attr("onclick") && e.attr("onclick", "window.open('https://twitter.com/intent/tweet?source=" + encodeURIComponent(t.location.href) + "&text=" + encodeURIComponent(n.title) + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=300'); return false;")
                },
                createGooglePlusShare: function(e) {
                    e.length && !e.attr("onclick") && e.attr("onclick", "window.open('https://plus.google.com/share?url=" + encodeURIComponent(t.location.href) + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=450'); return false;")
                },
                createPinterestShare: function(e) {
                    if (e.length && !e.attr("onclick")) {
                        var n = "",
                            o = this.content.find("img")[0];
                        o && (n = o.src), e.attr("onclick", "window.open('http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(t.location.href) + "&media=" + n + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=400'); return false;")
                    }
                },
                updateSinglePageInline: function(e, t) {
                    var n = this;
                    n.content.html(e), t && n.appendScriptsToWrap(t), n.cubeportfolio.$obj.trigger("updateSinglePageInlineStart.cbp"), 0 !== n.localOptions.delay ? setTimeout(function() {
                        n.singlePageInlineIsOpen.call(n)
                    }, n.localOptions.delay) : n.singlePageInlineIsOpen.call(n)
                },
                singlePageInlineIsOpen: function() {
                    function e() {
                        t.wrap.addClass("cbp-popup-singlePageInline-ready"), t.wrap[0].style.height = "", t.resizeSinglePageInline(), t.cubeportfolio.$obj.trigger("updateSinglePageInlineComplete.cbp")
                    }
                    var t = this;
                    t.cubeportfolio.loadImages(t.wrap, function() {
                        var n = t.content.find(".cbp-slider");
                        n.length ? (n.find(".cbp-slider-item").addClass("cbp-item"), n.one("initComplete.cbp", function() {
                            t.deferredInline.done(e)
                        }), n.on("pluginResize.cbp", function() {
                            t.deferredInline.done(e)
                        }), t.slider = n.cubeportfolio({
                            layoutMode: "slider",
                            displayType: "default",
                            mediaQueries: [{
                                width: 1,
                                cols: 1
                            }],
                            gapHorizontal: 0,
                            gapVertical: 0,
                            caption: "",
                            coverRatio: ""
                        })) : (t.slider = null, t.deferredInline.done(e)), t.checkForSocialLinks(t.content)
                    })
                },
                isImage: function(t) {
                    var n = this;
                    new Image;
                    n.tooggleLoading(!0), n.cubeportfolio.loadImages(e('<div><img src="' + t.src + '"></div>'), function() {
                        n.updateImagesMarkup(t.src, t.title, n.getCounterMarkup(n.options.lightboxCounter, n.current + 1, n.counterTotal)), n.tooggleLoading(!1)
                    })
                },
                isVimeo: function(e) {
                    var t = this;
                    t.updateVideoMarkup(e.src, e.title, t.getCounterMarkup(t.options.lightboxCounter, t.current + 1, t.counterTotal))
                },
                isYoutube: function(e) {
                    var t = this;
                    t.updateVideoMarkup(e.src, e.title, t.getCounterMarkup(t.options.lightboxCounter, t.current + 1, t.counterTotal))
                },
                isTed: function(e) {
                    var t = this;
                    t.updateVideoMarkup(e.src, e.title, t.getCounterMarkup(t.options.lightboxCounter, t.current + 1, t.counterTotal))
                },
                isSoundCloud: function(e) {
                    var t = this;
                    t.updateVideoMarkup(e.src, e.title, t.getCounterMarkup(t.options.lightboxCounter, t.current + 1, t.counterTotal))
                },
                isSelfHostedVideo: function(e) {
                    var t = this;
                    t.updateSelfHostedVideo(e.src, e.title, t.getCounterMarkup(t.options.lightboxCounter, t.current + 1, t.counterTotal))
                },
                isSelfHostedAudio: function(e) {
                    var t = this;
                    t.updateSelfHostedAudio(e.src, e.title, t.getCounterMarkup(t.options.lightboxCounter, t.current + 1, t.counterTotal))
                },
                getCounterMarkup: function(e, t, n) {
                    if (!e.length) return "";
                    var o = {
                        current: t,
                        total: n
                    };
                    return e.replace(/\{\{current}}|\{\{total}}/gi, function(e) {
                        return o[e.slice(2, -2)]
                    })
                },
                updateSelfHostedVideo: function(e, t, n) {
                    var o, i = this;
                    i.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var a = '<div class="cbp-popup-lightbox-iframe"><video controls="controls" height="auto" style="width: 100%">';
                    for (o = 0; o < e.length; o++) /(\.mp4)/i.test(e[o]) ? a += '<source src="' + e[o] + '" type="video/mp4">' : /(\.ogg)|(\.ogv)/i.test(e[o]) ? a += '<source src="' + e[o] + '" type="video/ogg">' : /(\.webm)/i.test(e[o]) && (a += '<source src="' + e[o] + '" type="video/webm">');
                    a += 'Your browser does not support the video tag.</video><div class="cbp-popup-lightbox-bottom">' + (t ? '<div class="cbp-popup-lightbox-title">' + t + "</div>" : "") + n + "</div></div>", i.content.html(a), i.wrap.addClass("cbp-popup-ready"), i.preloadNearbyImages()
                },
                updateSelfHostedAudio: function(e, t, n) {
                    var o = this;
                    o.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var i = '<div class="cbp-popup-lightbox-iframe"><div class="cbp-misc-video"><audio controls="controls" height="auto" style="width: 75%"><source src="' + e + '" type="audio/mpeg">Your browser does not support the audio tag.</audio></div><div class="cbp-popup-lightbox-bottom">' + (t ? '<div class="cbp-popup-lightbox-title">' + t + "</div>" : "") + n + "</div></div>";
                    o.content.html(i), o.wrap.addClass("cbp-popup-ready"), o.preloadNearbyImages()
                },
                updateVideoMarkup: function(e, t, n) {
                    var o = this;
                    o.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var i = '<div class="cbp-popup-lightbox-iframe"><iframe src="' + e + '" frameborder="0" allowfullscreen scrolling="no"></iframe><div class="cbp-popup-lightbox-bottom">' + (t ? '<div class="cbp-popup-lightbox-title">' + t + "</div>" : "") + n + "</div></div>";
                    o.content.html(i), o.wrap.addClass("cbp-popup-ready"), o.preloadNearbyImages()
                },
                updateImagesMarkup: function(e, t, n) {
                    var o = this;
                    o.wrap.removeClass("cbp-popup-lightbox-isIframe");
                    var i = '<div class="cbp-popup-lightbox-figure"><img src="' + e + '" class="cbp-popup-lightbox-img" ' + o.dataActionImg + ' /><div class="cbp-popup-lightbox-bottom">' + (t ? '<div class="cbp-popup-lightbox-title">' + t + "</div>" : "") + n + "</div></div>";
                    o.content.html(i), o.wrap.addClass("cbp-popup-ready"), o.resizeImage(), o.preloadNearbyImages()
                },
                next: function() {
                    var e = this;
                    e[e.type + "JumpTo"](1)
                },
                prev: function() {
                    var e = this;
                    e[e.type + "JumpTo"](-1)
                },
                lightboxJumpTo: function(e) {
                    var t, n = this;
                    n.current = n.getIndex(n.current + e), n[(t = n.dataArray[n.current]).type](t)
                },
                singlePageJumpTo: function(t) {
                    var n = this;
                    n.current = n.getIndex(n.current + t), e.isFunction(n.options.singlePageCallback) && (n.resetWrap(), n.contentWrap.scrollTop(0), n.wrap.addClass("cbp-popup-loading"), n.slider && a["private"].resize.destroyEvent(e.data(n.slider[0], "cubeportfolio")), n.options.singlePageCallback.call(n, n.dataArray[n.current].url, n.dataArray[n.current].element), n.options.singlePageDeeplinking && (location.href = n.url + "#cbp=" + n.dataArray[n.current].url))
                },
                resetWrap: function() {
                    var e = this;
                    "singlePage" === e.type && e.options.singlePageDeeplinking && (location.href = e.url + "#"), "singlePageInline" === e.type && e.options.singlePageInlineDeeplinking && (location.href = e.url + "#")
                },
                getIndex: function(e) {
                    var t = this;
                    return (e %= t.counterTotal) < 0 && (e = t.counterTotal + e), e
                },
                close: function(n, o) {
                    function i() {
                        s.slider && a["private"].resize.destroyEvent(e.data(s.slider[0], "cubeportfolio")), s.content.html(""), s.wrap.detach(), s.cubeportfolio.$obj.removeClass("cbp-popup-singlePageInline-open cbp-popup-singlePageInline-close"), "promise" === n && e.isFunction(o.callback) && o.callback.call(s.cubeportfolio)
                    }

                    function r() {
                        var o = e(t).scrollTop();
                        s.resetWrap(), e(t).scrollTop(o), s.options.singlePageInlineInFocus && "promise" !== n ? e("html,body").animate({
                            scrollTop: s.scrollTop
                        }, 350).promise().then(function() {
                            i()
                        }) : i()
                    }
                    var s = this;
                    s.isOpen = !1, "singlePageInline" === s.type ? "open" === n ? (s.wrap.removeClass("cbp-popup-singlePageInline-ready"), e(s.dataArray[s.current].element).closest(".cbp-item").removeClass("cbp-singlePageInline-active"), s.openSinglePageInline(o.blocks, o.currentBlock, o.fromOpen)) : (s.height = 0, s.revertResizeSinglePageInline(), s.wrap.removeClass("cbp-popup-singlePageInline-ready"), s.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-close"), s.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"), a["private"].modernBrowser ? s.wrap.one(a["private"].transitionend, function() {
                        r()
                    }) : r()) : "singlePage" === s.type ? (s.resetWrap(), e(t).scrollTop(s.scrollTop), s.stopScroll = !0, s.wrap.removeClass("cbp-popup-ready cbp-popup-transitionend cbp-popup-singlePage-open cbp-popup-singlePage-sticky"), e("html").css({
                        overflow: "",
                        marginRight: "",
                        position: ""
                    }), "ie8" !== a["private"].browser && "ie9" !== a["private"].browser || (s.slider && a["private"].resize.destroyEvent(e.data(s.slider[0], "cubeportfolio")), s.content.html(""), s.wrap.detach()), s.wrap.one(a["private"].transitionend, function() {
                        s.slider && a["private"].resize.destroyEvent(e.data(s.slider[0], "cubeportfolio")), s.content.html(""), s.wrap.detach()
                    })) : (l = !1, s.originalStyle ? e("html").attr("style", s.originalStyle) : e("html").css({
                        overflow: "",
                        marginRight: ""
                    }), e(t).scrollTop(s.scrollTop), s.slider && a["private"].resize.destroyEvent(e.data(s.slider[0], "cubeportfolio")), s.content.html(""), s.wrap.detach())
                },
                tooggleLoading: function(e) {
                    var t = this;
                    t.stopEvents = e, t.wrap[e ? "addClass" : "removeClass"]("cbp-popup-loading")
                },
                resizeImage: function() {
                    if (this.isOpen) {
                        var n = this.content.find("img"),
                            o = n.parent(),
                            i = e(t).height() - (o.outerHeight(!0) - o.height()) - this.content.find(".cbp-popup-lightbox-bottom").outerHeight(!0);
                        n.css("max-height", i + "px")
                    }
                },
                preloadNearbyImages: function() {
                    for (var e = this, t = [e.getIndex(e.current + 1), e.getIndex(e.current + 2), e.getIndex(e.current + 3), e.getIndex(e.current - 1), e.getIndex(e.current - 2), e.getIndex(e.current - 3)], n = t.length - 1; n >= 0; n--) "isImage" === e.dataArray[t[n]].type && e.cubeportfolio.checkSrc(e.dataArray[t[n]])
                }
            },
            l = !1,
            p = !1,
            c = !1;
        i.prototype.run = function() {
            var t = this,
                o = t.parent,
                i = e(n.body);
            o.lightbox = null, o.options.lightboxDelegate && !p && (p = !0, o.lightbox = Object.create(s), o.lightbox.init(o, "lightbox"), i.on("click.cbp", o.options.lightboxDelegate, function(n) {
                n.preventDefault();
                var i = e(this),
                    a = i.attr("data-cbp-lightbox"),
                    r = t.detectScope(i),
                    s = r.data("cubeportfolio"),
                    l = [];
                s ? s.blocksOn.each(function(t, n) {
                    var i = e(n);
                    i.not(".cbp-item-off") && i.find(o.options.lightboxDelegate).each(function(t, n) {
                        a ? e(n).attr("data-cbp-lightbox") === a && l.push(n) : l.push(n)
                    })
                }) : l = a ? r.find(o.options.lightboxDelegate + "[data-cbp-lightbox=" + a + "]") : r.find(o.options.lightboxDelegate), o.lightbox.openLightbox(l, i[0])
            })), o.singlePage = null, o.options.singlePageDelegate && !c && (c = !0, o.singlePage = Object.create(s), o.singlePage.init(o, "singlePage"), i.on("click.cbp", o.options.singlePageDelegate, function(n) {
                n.preventDefault();
                var i = e(this),
                    a = i.attr("data-cbp-singlePage"),
                    r = t.detectScope(i),
                    s = r.data("cubeportfolio"),
                    l = [];
                s ? s.blocksOn.each(function(t, n) {
                    var i = e(n);
                    i.not(".cbp-item-off") && i.find(o.options.singlePageDelegate).each(function(t, n) {
                        a ? e(n).attr("data-cbp-singlePage") === a && l.push(n) : l.push(n)
                    })
                }) : l = a ? r.find(o.options.singlePageDelegate + "[data-cbp-singlePage=" + a + "]") : r.find(o.options.singlePageDelegate), o.singlePage.openSinglePage(l, i[0])
            })), o.singlePageInline = null, o.options.singlePageInlineDelegate && (o.singlePageInline = Object.create(s), o.singlePageInline.init(o, "singlePageInline"), o.$obj.on("click.cbp", o.options.singlePageInlineDelegate, function(t) {
                t.preventDefault();
                var n = e.data(this, "cbp-locked"),
                    i = e.data(this, "cbp-locked", +new Date);
                (!n || i - n > 300) && o.singlePageInline.openSinglePageInline(o.blocksOn, this)
            }))
        }, i.prototype.detectScope = function(t) {
            var o, i, a;
            return (o = t.closest(".cbp-popup-singlePageInline")).length ? (a = t.closest(".cbp", o[0]), a.length ? a : o) : (i = t.closest(".cbp-popup-singlePage")).length ? (a = t.closest(".cbp", i[0]), a.length ? a : i) : (a = t.closest(".cbp"), a.length ? a : e(n.body))
        }, i.prototype.destroy = function() {
            var t = this.parent;
            e(n.body).off("click.cbp"), p = !1, c = !1, t.lightbox && t.lightbox.destroy(), t.singlePage && t.singlePage.destroy(), t.singlePageInline && t.singlePageInline.destroy()
        }, a.plugins.popUp = function(e) {
            return new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.searchInput = e(t.options.search), n.searchInput.each(function(t, n) {
                var o = n.getAttribute("data-search");
                o || (o = "*"), e.data(n, "searchData", {
                    value: n.value,
                    el: o
                })
            });
            var o = null;
            n.searchInput.on("keyup.cbp paste.cbp", function(t) {
                t.preventDefault();
                var i = e(this);
                clearTimeout(o), o = setTimeout(function() {
                    n.runEvent.call(n, i)
                }, 350)
            }), n.searchNothing = n.searchInput.siblings(".cbp-search-nothing").detach(), n.searchNothingHeight = null, n.searchNothingHTML = n.searchNothing.html(), n.searchInput.siblings(".cbp-search-icon").on("click.cbp", function(t) {
                t.preventDefault(), n.runEvent.call(n, e(this).prev().val(""))
            })
        }
        var a = e.fn.cubeportfolio.constructor;
        i.prototype.runEvent = function(t) {
            var n = this,
                o = t.val(),
                i = t.data("searchData"),
                a = new RegExp(o, "i");
            i.value === o || n.parent.isAnimating || (i.value = o, o.length > 0 ? t.attr("value", o) : t.removeAttr("value"), n.parent.$obj.cubeportfolio("filter", function(t) {
                var r = t.filter(function(t, n) {
                    if (e(n).find(i.el).text().search(a) > -1) return !0
                });
                if (0 === r.length && n.searchNothing.length) {
                    var s = n.searchNothingHTML.replace("{{query}}", o);
                    n.searchNothing.html(s), n.searchNothing.appendTo(n.parent.$obj), null === n.searchNothingHeight && (n.searchNothingHeight = n.searchNothing.outerHeight(!0)), n.parent.registerEvent("resizeMainContainer", function() {
                        n.parent.height = n.parent.height + n.searchNothingHeight, n.parent.obj.style.height = n.parent.height + "px"
                    }, !0)
                } else n.searchNothing.detach();
                return n.parent.triggerEvent("resetFiltersVisual"), r
            }, function() {
                t.trigger("keyup.cbp")
            }))
        }, i.prototype.destroy = function() {
            var t = this;
            t.searchInput.off(".cbp"), t.searchInput.next(".cbp-search-icon").off(".cbp"), t.searchInput.each(function(t, n) {
                e.removeData(n)
            })
        }, a.plugins.search = function(e) {
            return "" === e.options.search ? null : new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.options = e.extend({}, a, n.parent.options.plugins.slider);
            var o = e(n.options.pagination);
            o.length > 0 && (n.parent.customPagination = o, n.parent.customPaginationItems = o.children(), n.parent.customPaginationClass = n.options.paginationClass, n.parent.customPaginationItems.on("click.cbp", function(t) {
                t.preventDefault(), t.stopImmediatePropagation(), t.stopPropagation(), n.parent.sliderStopEvents || n.parent.jumpToSlider(e(this))
            })), n.parent.registerEvent("gridAdjust", function() {
                n.sliderMarkup.call(n.parent), n.parent.registerEvent("gridAdjust", function() {
                    n.updateSlider.call(n.parent)
                })
            }, !0)
        }
        var a = {
                pagination: "",
                paginationClass: "cbp-pagination-active"
            },
            r = e.fn.cubeportfolio.constructor;
        i.prototype.sliderMarkup = function() {
            var t = this;
            t.sliderStopEvents = !1, t.sliderActive = 0, t.$obj.one("initComplete.cbp", function() {
                t.$obj.addClass("cbp-mode-slider")
            }), t.nav = e("<div/>", {
                "class": "cbp-nav"
            }), t.nav.on("click.cbp", "[data-slider-action]", function(n) {
                if (n.preventDefault(), n.stopImmediatePropagation(), n.stopPropagation(), !t.sliderStopEvents) {
                    var o = e(this),
                        i = o.attr("data-slider-action");
                    t[i + "Slider"] && t[i + "Slider"](o)
                }
            }), t.options.showNavigation && (t.controls = e("<div/>", {
                "class": "cbp-nav-controls"
            }), t.navPrev = e("<div/>", {
                "class": "cbp-nav-prev",
                "data-slider-action": "prev"
            }).appendTo(t.controls), t.navNext = e("<div/>", {
                "class": "cbp-nav-next",
                "data-slider-action": "next"
            }).appendTo(t.controls), t.controls.appendTo(t.nav)), t.options.showPagination && (t.navPagination = e("<div/>", {
                "class": "cbp-nav-pagination"
            }).appendTo(t.nav)), (t.controls || t.navPagination) && t.nav.appendTo(t.$obj), t.updateSliderPagination(), t.options.auto && (t.options.autoPauseOnHover && (t.mouseIsEntered = !1, t.$obj.on("mouseenter.cbp", function(e) {
                t.mouseIsEntered = !0, t.stopSliderAuto()
            }).on("mouseleave.cbp", function(e) {
                t.mouseIsEntered = !1, t.startSliderAuto()
            })), t.startSliderAuto()), t.options.drag && r["private"].modernBrowser && t.dragSlider()
        }, i.prototype.updateSlider = function() {
            var e = this;
            e.updateSliderPosition(), e.updateSliderPagination()
        }, i.prototype.destroy = function() {
            var e = this;
            e.parent.customPaginationItems && e.parent.customPaginationItems.off(".cbp"), (e.parent.controls || e.parent.navPagination) && (e.parent.nav.off(".cbp"), e.parent.nav.remove())
        }, r.plugins.slider = function(e) {
            return "slider" !== e.options.layoutMode ? null : new i(e)
        }
    }(jQuery, window, document),
    function(e, t, n, o) {
        "use strict";

        function i(t) {
            var n = this;
            n.parent = t, n.options = e.extend({}, a, n.parent.options.plugins.sort), n.element = e(n.options.element), 0 !== n.element.length && (n.sort = "", n.sortBy = "string:asc", n.element.on("click.cbp", ".cbp-sort-item", function(o) {
                o.preventDefault(), n.target = o.target, e(n.target).hasClass("cbp-l-dropdown-item--active") || t.isAnimating || (n.processSort(), t.$obj.cubeportfolio("filter", t.defaultFilter))
            }), t.registerEvent("triggerSort", function() {
                n.target && (n.processSort(), t.$obj.cubeportfolio("filter", t.defaultFilter))
            }), n.dropdownWrap = n.element.find(".cbp-l-dropdown-wrap").on({
                "mouseover.cbp": function() {
                    e(this).addClass("cbp-l-dropdown-wrap--open")
                },
                "mouseleave.cbp": function() {
                    e(this).removeClass("cbp-l-dropdown-wrap--open")
                }
            }), n.dropdownHeader = n.element.find(".cbp-l-dropdown-header"))
        }
        var a = {
                element: ""
            },
            r = e.fn.cubeportfolio.constructor;
        i.prototype.processSort = function() {
            var t = this,
                n = t.parent,
                o = (c = t.target).hasAttribute("data-sort"),
                i = c.hasAttribute("data-sortBy");
            if (o && i) t.sort = c.getAttribute("data-sort"), t.sortBy = c.getAttribute("data-sortBy");
            else if (o) t.sort = c.getAttribute("data-sort");
            else {
                if (!i) return;
                t.sortBy = c.getAttribute("data-sortBy")
            }
            var a = t.sortBy.split(":"),
                r = "string",
                s = 1;
            if ("int" === a[0] ? r = "int" : "float" === a[0] && (r = "float"), "desc" === a[1] && (s = -1), t.sort) {
                var l = [];
                n.blocks.each(function(n, o) {
                    var i = e(o),
                        a = i.find(t.sort).text();
                    "int" === r && (a = parseInt(a, 10)), "float" === r && (a = parseFloat(a, 10)), l.push({
                        sortText: a,
                        data: i.data("cbp")
                    })
                }), l.sort(function(e, t) {
                    var n = e.sortText,
                        o = t.sortText;
                    return "string" === r && (n = n.toUpperCase(), o = o.toUpperCase()), n < o ? -s : n > o ? s : 0
                }), e.each(l, function(e, t) {
                    t.data.index = e
                })
            } else {
                var p = []; - 1 === s && (n.blocks.each(function(t, n) {
                    p.push(e(n).data("cbp").indexInitial)
                }), p.sort(function(e, t) {
                    return t - e
                })), n.blocks.each(function(t, n) {
                    var o = e(n).data("cbp");
                    o.index = -1 === s ? p[o.indexInitial] : o.indexInitial
                })
            }
            n.sortBlocks(n.blocks, "index"), t.dropdownWrap.trigger("mouseleave.cbp");
            var c = e(t.target),
                u = e(t.target).parent();
            u.hasClass("cbp-l-dropdown-list") ? (t.dropdownHeader.html(c.html()), c.addClass("cbp-l-dropdown-item--active").siblings(".cbp-l-dropdown-item").removeClass("cbp-l-dropdown-item--active")) : u.hasClass("cbp-l-direction") && (0 === c.index() ? u.addClass("cbp-l-direction--second").removeClass("cbp-l-direction--first") : u.addClass("cbp-l-direction--first").removeClass("cbp-l-direction--second"))
        }, i.prototype.destroy = function() {
            this.element.off("click.cbp")
        }, r.plugins.sort = function(e) {
            return new i(e)
        }
    }(jQuery, window, document);