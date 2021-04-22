/*
 * jQuery pagination plugin v1.4.1
 * http://esimakin.github.io/twbs-pagination/
 *
 * Copyright 2014-2016, Eugene Simakin
 * Released under Apache 2.0 license
 * http://apache.org/licenses/LICENSE-2.0.html
 */

"use strict";
(function ($, window, document, undefined) {

    'use strict';

    var old = $.fn.twbsPagination;

    // PROTOTYPE AND CONSTRUCTOR

    var TwbsPagination = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.twbsPagination.defaults, options);

        if (this.options.startPage < 1 || this.options.startPage > this.options.totalPages) {
            throw new Error('Start page option is incorrect');
        }

        this.options.totalPages = parseInt(this.options.totalPages);
        if (isNaN(this.options.totalPages)) {
            throw new Error('Total pages option is not correct!');
        }

        this.options.visiblePages = parseInt(this.options.visiblePages);
        if (isNaN(this.options.visiblePages)) {
            throw new Error('Visible pages option is not correct!');
        }

        if (this.options.onPageClick instanceof Function) {
            this.$element.first().on('page', this.options.onPageClick);
        }

        // hide if only one page exists
        if (this.options.hideOnlyOnePage && this.options.totalPages == 1) {
            this.$element.trigger('page', 1);
            return this;
        }

        if (this.options.totalPages < this.options.visiblePages) {
            this.options.visiblePages = this.options.totalPages;
        }

        if (this.options.href) {
            this.options.startPage = this.getPageFromQueryString();
            if (!this.options.startPage) {
                this.options.startPage = 1;
            }
        }

        var tagName = (typeof this.$element.prop === 'function') ?
            this.$element.prop('tagName') : this.$element.attr('tagName');

        if (tagName === 'UL') {
            this.$listContainer = this.$element;
        } else {
            this.$listContainer = $('<ul></ul>');
        }

        this.$listContainer.addClass(this.options.paginationClass);

        if (tagName !== 'UL') {
            this.$element.append(this.$listContainer);
        }

        if (this.options.initiateStartPageClick) {
            this.show(this.options.startPage);
        } else {
            this.currentPage = this.options.startPage;
            this.render(this.getPages(this.options.startPage));
            this.setupEvents();
        }

        return this;
    };

    TwbsPagination.prototype = {

        constructor: TwbsPagination,

        destroy: function () {
            this.$element.empty();
            this.$element.removeData('twbs-pagination');
            this.$element.off('page');

            return this;
        },

        show: function (page) {
            if (page < 1 || page > this.options.totalPages) {
                throw new Error('Page is incorrect.');
            }
            this.currentPage = page;

            this.render(this.getPages(page));
            this.setupEvents();

            this.$element.trigger('page', page);

            return this;
        },

        enable: function () {
            this.show(this.currentPage);
        },

        disable: function () {
            var _this = this;
            this.$listContainer.off('click').on('click', 'li', function (evt) {
                evt.preventDefault();
            });
            this.$listContainer.children().each(function () {
                var $this = $(this);
                if (!$this.hasClass(_this.options.activeClass)) {
                    $(this).addClass(_this.options.disabledClass);
                }
            });
        },

        buildListItems: function (pages) {
            var listItems = [];

            if (this.options.first) {
                listItems.push(this.buildItem('first', 1));
            }

            if (this.options.prev) {
                var prev = pages.currentPage > 1 ? pages.currentPage - 1 : this.options.loop ? this.options.totalPages : 1;
                listItems.push(this.buildItem('prev', prev));
            }

            for (var i = 0; i < pages.numeric.length; i++) {
                listItems.push(this.buildItem('page', pages.numeric[i]));
            }

            if (this.options.next) {
                var next = pages.currentPage < this.options.totalPages ? pages.currentPage + 1 : this.options.loop ? 1 : this.options.totalPages;
                listItems.push(this.buildItem('next', next));
            }

            if (this.options.last) {
                listItems.push(this.buildItem('last', this.options.totalPages));
            }

            return listItems;
        },

        buildItem: function (type, page) {
            var $itemContainer = $('<li></li>'),
                $itemContent = $('<a></a>'),
                itemText = this.options[type] ? this.makeText(this.options[type], page) : page;

            $itemContainer.addClass(this.options[type + 'Class']);
            $itemContainer.data('page', page);
            $itemContainer.data('page-type', type);
            $itemContainer.append($itemContent.attr('href', this.makeHref(page)).addClass(this.options.anchorClass).html(itemText));

            return $itemContainer;
        },

        getPages: function (currentPage) {
            var pages = [];

            var half = Math.floor(this.options.visiblePages / 2);
            var start = currentPage - half + 1 - this.options.visiblePages % 2;
            var end = currentPage + half;

            // handle boundary case
            if (start <= 0) {
                start = 1;
                end = this.options.visiblePages;
            }
            if (end > this.options.totalPages) {
                start = this.options.totalPages - this.options.visiblePages + 1;
                end = this.options.totalPages;
            }

            var itPage = start;
            while (itPage <= end) {
                pages.push(itPage);
                itPage++;
            }

            return { "currentPage": currentPage, "numeric": pages };
        },

        render: function (pages) {
            var _this = this;
            this.$listContainer.children().remove();
            var items = this.buildListItems(pages);
            $.each(items, function (key, item) {
                _this.$listContainer.append(item);
            });

            this.$listContainer.children().each(function () {
                var $this = $(this),
                    pageType = $this.data('page-type');

                switch (pageType) {
                    case 'page':
                        if ($this.data('page') === pages.currentPage) {
                            $this.addClass(_this.options.activeClass);
                        }
                        break;
                    case 'first':
                        $this.toggleClass(_this.options.disabledClass, pages.currentPage === 1);
                        break;
                    case 'last':
                        $this.toggleClass(_this.options.disabledClass, pages.currentPage === _this.options.totalPages);
                        break;
                    case 'prev':
                        $this.toggleClass(_this.options.disabledClass, !_this.options.loop && pages.currentPage === 1);
                        break;
                    case 'next':
                        $this.toggleClass(_this.options.disabledClass,
                            !_this.options.loop && pages.currentPage === _this.options.totalPages);
                        break;
                    default:
                        break;
                }

            });
        },

        setupEvents: function () {
            var _this = this;
            this.$listContainer.off('click').on('click', 'li', function (evt) {
                var $this = $(this);
                if ($this.hasClass(_this.options.disabledClass) || $this.hasClass(_this.options.activeClass)) {
                    return false;
                }
                // Prevent click event if href is not set.
                !_this.options.href && evt.preventDefault();
                _this.show(parseInt($this.data('page')));
            });
        },

        makeHref: function (page) {
            return this.options.href ? this.generateQueryString(page) : "#";
        },

        makeText: function (text, page) {
            return text.replace(this.options.pageVariable, page)
                .replace(this.options.totalPagesVariable, this.options.totalPages)
        },
        getPageFromQueryString: function (searchStr) {
            var search = this.getSearchString(searchStr),
                regex = new RegExp(this.options.pageVariable + '(=([^&#]*)|&|#|$)'),
                page = regex.exec(search);
            if (!page || !page[2]) {
                return null;
            }
            page = decodeURIComponent(page[2]);
            page = parseInt(page);
            if (isNaN(page)) {
                return null;
            }
            return page;
        },
        generateQueryString: function (pageNumber, searchStr) {
            var search = this.getSearchString(searchStr),
                regex = new RegExp(this.options.pageVariable + '=*[^&#]*');
            if (!search) return '';
            return '?' + search.replace(regex, this.options.pageVariable + '=' + pageNumber);

        },
        getSearchString: function (searchStr) {
            var search = searchStr || window.location.search;
            if (search === '') {
                return null;
            }
            if (search.indexOf('?') === 0) search = search.substr(1);
            return search;
        },
        getCurrentPage: function () {
            return this.currentPage;
        }
    };

    // PLUGIN DEFINITION

    $.fn.twbsPagination = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('twbs-pagination');
        var options = typeof option === 'object' ? option : {};

        if (!data) $this.data('twbs-pagination', (data = new TwbsPagination(this, options)));
        if (typeof option === 'string') methodReturn = data[option].apply(data, args);

        return (methodReturn === undefined) ? $this : methodReturn;
    };

    $.fn.twbsPagination.defaults = {
        totalPages: 1,
        startPage: 1,
        visiblePages: 5,
        initiateStartPageClick: true,
        hideOnlyOnePage: false,
        href: false,
        pageVariable: '{{page}}',
        totalPagesVariable: '{{total_pages}}',
        page: null,
        first: 'First',
        prev: 'Previous',
        next: 'Next',
        last: 'Last',
        loop: false,
        onPageClick: null,
        paginationClass: 'pagination',
        nextClass: 'page-item next',
        prevClass: 'page-item prev',
        lastClass: 'page-item last',
        firstClass: 'page-item first',
        pageClass: 'page-item',
        activeClass: 'active',
        disabledClass: 'disabled',
        anchorClass: 'page-link'
    };

    $.fn.twbsPagination.Constructor = TwbsPagination;

    $.fn.twbsPagination.noConflict = function () {
        $.fn.twbsPagination = old;
        return this;
    };

    $.fn.twbsPagination.version = "1.4.1";

})(window.jQuery, window, document);


/*
* ===========================================================
* PAGINATION - LOAD MORE - ALBUMS - FRAMEWORK Y
* ===========================================================
* This script manage the pagination and load more system of the grid list and masonry list container components.
* This script manage also the album components. The script require Isotope only is used with masonry list.
* Documentation: www.framework-y.com/containers/list-grid.html#gallery-pagiantion
* Documentation: www.framework-y.com/containers/list-masonry.html#masonry-gallery-load-more
* 
* Schiocco - Copyright (c) Federico Schiocchet - Schiocco - Framework Y
*/

(function ($) {
    var isRLI;
    $.fn.initTwbsPagination = function () {
        var opt = $(this).attr("data-options");
        var a = $(this).attr("data-pagination-anima");
        var p = parseInt($(this).attr("data-page-items"), 10);
        var c = $(this).closest(".grid-list");
        var t = $(c).find(".grid-box .grid-item");
        var n = $(t).length;
        var type = "pagination";
        if ($(this).hasClass('load-more-grid')) type = 'load-more';

        $(t).css("display", "none");
        for (var i = 0; i < p; i++) {
            $($(t)[i]).css("display", "block");
        }

        if (type == 'pagination') {
            var optionsArr;
            var options = {
                totalPages: Math.ceil(n / p),
                visiblePages: 7,
                first: "<i class='fa fa-angle-double-left'></i> <span>First</span>",
                last: "<span>Last</span> <i class='fa fa-angle-double-right'></i>",
                next: "<span>Next</span> <i class='fa fa-angle-right'></i>",
                prev: " <i class='fa fa-angle-left'></i> <span>Previous</span>",
                onPageClick: function (event, page) {
                    $(t).css("display", "none");
                    for (var i = (p * (page - 1)) ; i < (p * (page)) ; i++) {
                        var o = $($(t)[i]);
                        if (!isEmpty(a)) {
                            $(o).css("opacity", "0");
                            $(o).showAnima(a);
                        }
                        $(o).css("display", "block");
                        if (isRLI) $(o).renderLoadedImgs();
                    }
                    if (!isEmpty(opt) && opt.indexOf("scrollTop:true") != -1) $(c).scrollTo();
                    if ($.isFunction($.fn.initFlexSlider)) {
                        var i = 0;
                        $(t).find(".flexslider").each(function () {
                            $(this).initFlexSlider();
                            i++;
                        });
                        if (i) $(window).trigger('resize').trigger('scroll');
                    }
                }
            }
            if (!isEmpty(opt)) {
                optionsArr = opt.split(",");
                options = getOptionsString(opt, options);
            }
            $(this).twbsPagination(options);
        }
        if (type == 'load-more') {
            if (!isEmpty(opt) && opt.indexOf("lazyLoad:true") != -1) {
                var ths = this;
                $(window).scroll(function () {
                    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                        loadMoreGrid(ths);
                    }
                });
            }
            $(this).on("click", function () {
                loadMoreGrid(this);
            });
        }
        function loadMoreGrid(obj) {
            var page = $(obj).attr("data-current-page");
            if (isEmpty(page)) page = 1;
            page++;
            $(obj).attr("data-current-page", page);
            var s = p * (page - 1);
            var e = p * (page);

            for (var i = s ; i < (p * (page)) ; i++) {
                var o = $($(t)[i]);
                if (!isEmpty(a)) {
                    $(o).css("opacity", "0");
                    $(o).showAnima(a);
                }
                $(o).css("display", "block");
            }
            if (e >= n) $(obj).hide(300);
        }
    }
    $(document).ready(function () {
        isRLI = $.fn.renderLoadedImgs;
        $(".pagination-grid,.load-more-grid").each(function () {
            $(this).initTwbsPagination();
        });

        //ALBUM
        var alb = ".cont-album-box";
        $(".album-item").hide();
        $("body").on("click", ".album-box", function () {
            var t = $(this).closest(".album-main");
            var a = $(t).attr("data-album-anima");
            var ida = $("#" + $(this).attr("data-album-id"));
            if (isEmpty(ida)) {
                ida = $(t).find(alb + " .album-item:eq(" + $(this).index() + ")");
            }
            $(alb + " .album-item").hide();
            $(t).find(".album-list").hide();
            $(t).find(alb + " .album-title span").html($(this).find(".album-name").html().replace("<br>", " ").replace("<br />", " "));
            $(t).find(alb + " .album-title").show();
            if (!isEmpty(a)) {
                $(ida).css("opacity", 0);
                $(ida).showAnima(a);
            }
            $(ida).css("display", "block");
            if ($.isFunction($.fn.initIsotope)) $(ida).find(".maso-list").initIsotope();
            if (isRLI) $(t).find(ida).renderLoadedImgs();

            $(ida).find(".load-more-maso").attr("data-current-page", "1").css("display", "inline-block");
        });

        $("body").on("click", alb + " .album-title", function () {
            var t = $(this).closest(".album-main");
            var a = $(t).attr("data-album-anima");
            var b = $(t).find(".album-list");
            $(alb + " .album-item").hide();
            $(alb + " .album-title").hide();
            if (!isEmpty(a)) {
                $(b).css("opacity", 0);
                $(b).showAnima(a);
            }
            $(b).css("display", "block");
        });
    });
}(jQuery));


