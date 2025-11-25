/*
* ==============================
* TEMPLATE - TWOSIDE
* ==============================
* Documentation: www.framework-y.com/templates/fullpage/template-fullpage-twosides-documentation.html
* 
* Schiocco - Copyright (c) Federico Schiocchet - Schiocco - Framework Y
*/

"use strict";
function openSection(i) {
    jQuery.fn.openSection(i);
}
function closeSection() {
    jQuery.fn.closeSection();
}
(function ($) {
    var index;

    $.fn.openSection = function (i) {
        index = i;
        $(".center-box").animate({ opacity: '0' }, 200, function () {
            $(".half-side.right").css("border-left-style", "solid");
        });
        $(".half-side.left").animate({ marginLeft: '-450px' }, 600);
        $(".half-side.right").animate({ marginRight: '-450px' }, 600, function () {
            var t = $("#twosides-main .section").eq(index);
            $("#twosides-main .section").css("display", "");
            $(t).css("display", "table");
            setPosMiddle(".center-box .content");
            $(t).animate({ opacity: '1' }, 600);
            $(".close-button").css("display", "block");
            $(".close-button").animate({ opacity: '1' }, 600);
            $(".center-bg").animate({ opacity: '0.6' }, 600);

            if ($.isFunction($.fn.googleMap)) {
                $(t).find(".google-map").googleMap();
            }
            if ($.isFunction($.fn.initFlexSlider)) {
                $(t).find(".flexslider").each(function () {
                    $(this).initFlexSlider();
                });
            }
        });
        $(".sec-twoside").addClass("twoside-opened");
    }
    $.fn.closeSection = function () {
        $(".section:eq(" + index + "),.close-button,.center-bg").animate({ opacity: '0' }, 600, function () {
            $(".half-side.right").animate({ marginRight: '0px' }, 600);
            $(".half-side.left").animate({ marginLeft: '0px' }, 600, function () {
                $(".sec-twoside").removeClass("twoside-opened");
            });
            $(".half-side.right").css("border-left", "none");
        });
    }
    function setPosMiddle(target) {
        var th = 0;
        if ($("header").length) th = $("header")[0].clientHeight;
        var h = parseInt($(".sec-twoside")[0].clientHeight,10);
        var os = $(".sec-twoside").attr("data-offset");
        if (isEmpty(os)) os = 0;
        $(target).each(function () {
            var sh = parseInt($(this)[0].clientHeight, 10);
            if (sh < h) $(this).css("margin-top", "-" + (((sh / 2) + (th / 2)) + parseInt(os * -1, 10)) + "px");
        });
    }

    $("body").on("click", ".twoside-open", function () {
        $.fn.openSection($(this).index());
    });
    $("body").on("click", ".close-button", function () {
        $.fn.closeSection();
    });

    setPosMiddle(".half-side .content,.center-box .content");
    setTimeout(function () {
        setPosMiddle(".half-side .content,.center-box .content");
    }, 150);

    if ($(window).width() < 769) {
        if ($.isFunction($.fn.googleMap)) {
            $(".google-map").googleMap();
        }
        if ($.isFunction($.fn.initFlexSlider)) {
            $(".flexslider").each(function () {
                $(this).initFlexSlider();
            });
        }
    }
}(jQuery));
