/*
 * jquery-countTo
 * Copyright (c) 2012-2014 Matt Huggins - The MIT License
 * URL: https://github.com/mhuggins/jquery-countTo/
 */

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var CountTo = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
        this.init();
    };

    CountTo.DEFAULTS = {
        from: 0,               // the number the element should start at
        to: 0,                 // the number the element should end at
        speed: 1000,           // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,           // the number of decimal places to show
        formatter: formatter,  // handler for formatting the value before rendering
        onUpdate: null,        // callback method for every time the element is updated
        onComplete: null       // callback method for when the element finishes updating
    };

    CountTo.prototype.init = function () {
        this.value = this.options.from;
        this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
        this.loopCount = 0;
        this.increment = (this.options.to - this.options.from) / this.loops;
    };

    CountTo.prototype.dataOptions = function () {
        var options = {
            from: this.$element.data('from'),
            to: this.$element.data('to'),
            speed: this.$element.data('speed'),
            refreshInterval: this.$element.data('refresh-interval'),
            decimals: this.$element.data('decimals')
        };

        var keys = Object.keys(options);

        for (var i in keys) {
            var key = keys[i];

            if (typeof (options[key]) === 'undefined') {
                delete options[key];
            }
        }

        return options;
    };

    CountTo.prototype.update = function () {
        this.value += this.increment;
        this.loopCount++;

        this.render();

        if (typeof (this.options.onUpdate) == 'function') {
            this.options.onUpdate.call(this.$element, this.value);
        }

        if (this.loopCount >= this.loops) {
            clearInterval(this.interval);
            this.value = this.options.to;

            if (typeof (this.options.onComplete) == 'function') {
                this.options.onComplete.call(this.$element, this.value);
            }
        }
    };

    CountTo.prototype.render = function () {
        var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
        this.$element.text(formattedValue);
    };

    CountTo.prototype.restart = function () {
        this.stop();
        this.init();
        this.start();
    };

    CountTo.prototype.start = function () {
        this.stop();
        this.render();
        this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
    };

    CountTo.prototype.stop = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };

    CountTo.prototype.toggle = function () {
        if (this.interval) {
            this.stop();
        } else {
            this.start();
        }
    };

    function formatter(value, options) {
        return value.toFixed(options.decimals);
    }

    $.fn.countTo = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('countTo');
            var init = !data || typeof (option) === 'object';
            var options = typeof (option) === 'object' ? option : {};
            var method = typeof (option) === 'string' ? option : 'start';

            if (init) {
                if (data) data.stop();
                $this.data('countTo', data = new CountTo(this, options));
            }

            data[method].call(data);
        });
    };
}));

/**
 * jquery-circle-progress - jQuery Plugin to draw animated circular progress bars:
 * {@link http://kottenator.github.io/jquery-circle-progress/}
 *
 * @author Rostyslav Bryzgunov <kottenator@gmail.com>
 * @version 1.2.2
 * @licence MIT
 * @preserve
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD - register as an anonymous module
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        var $ = require('jquery');
        factory($);
        module.exports = $;
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function ($) {
    /**
     * Inner implementation of the circle progress bar.
     * The class is not exposed _yet_ but you can create an instance through jQuery method call.
     *
     * @param {object} config - You can customize any class member (property or method).
     * @class
     * @alias CircleProgress
     */
    function CircleProgress(config) {
        this.init(config);
    }

    CircleProgress.prototype = {
        //--------------------------------------- public options ---------------------------------------
        /**
         * This is the only required option. It should be from `0.0` to `1.0`.
         * @type {number}
         * @default 0.0
         */
        value: 0.0,

        /**
         * Size of the canvas in pixels.
         * It's a square so we need only one dimension.
         * @type {number}
         * @default 100.0
         */
        size: 100.0,

        /**
         * Initial angle for `0.0` value in radians.
         * @type {number}
         * @default -Math.PI
         */
        startAngle: -Math.PI,

        /**
         * Width of the arc in pixels.
         * If it's `'auto'` - the value is calculated as `[this.size]{@link CircleProgress#size} / 14`.
         * @type {number|string}
         * @default 'auto'
         */
        thickness: 'auto',

        /**
         * Fill of the arc. You may set it to:
         *
         *   - solid color:
         *     - `'#3aeabb'`
         *     - `{ color: '#3aeabb' }`
         *     - `{ color: 'rgba(255, 255, 255, .3)' }`
         *   - linear gradient _(left to right)_:
         *     - `{ gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }`
         *     - `{ gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }`
         *     - `{ gradient: [["red", .2], ["green", .3], ["blue", .8]] }`
         *   - image:
         *     - `{ image: 'http://i.imgur.com/pT0i89v.png' }`
         *     - `{ image: imageObject }`
         *     - `{ color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' }` -
         *       color displayed until the image is loaded
         *
         * @default {gradient: ['#3aeabb', '#fdd250']}
         */
        fill: {
            gradient: ['#3aeabb', '#fdd250']
        },

        /**
         * Color of the "empty" arc. Only a color fill supported by now.
         * @type {string}
         * @default 'rgba(0, 0, 0, .1)'
         */
        emptyFill: 'rgba(0, 0, 0, .1)',

        /**
         * jQuery Animation config.
         * You can pass `false` to disable the animation.
         * @see http://api.jquery.com/animate/
         * @type {object|boolean}
         * @default {duration: 1200, easing: 'circleProgressEasing'}
         */
        animation: {
            duration: 1200,
            easing: 'circleProgressEasing'
        },

        /**
         * Default animation starts at `0.0` and ends at specified `value`. Let's call this _direct animation_.
         * If you want to make _reversed animation_ - set `animationStartValue: 1.0`.
         * Also you may specify any other value from `0.0` to `1.0`.
         * @type {number}
         * @default 0.0
         */
        animationStartValue: 0.0,

        /**
         * Reverse animation and arc draw.
         * By default, the arc is filled from `0.0` to `value`, _clockwise_.
         * With `reverse: true` the arc is filled from `1.0` to `value`, _counter-clockwise_.
         * @type {boolean}
         * @default false
         */
        reverse: false,

        /**
         * Arc line cap: `'butt'`, `'round'` or `'square'` -
         * [read more]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap}.
         * @type {string}
         * @default 'butt'
         */
        lineCap: 'butt',

        /**
         * Canvas insertion mode: append or prepend it into the parent element?
         * @type {string}
         * @default 'prepend'
         */
        insertMode: 'prepend',

        //------------------------------ protected properties and methods ------------------------------
        /**
         * Link to {@link CircleProgress} constructor.
         * @protected
         */
        constructor: CircleProgress,

        /**
         * Container element. Should be passed into constructor config.
         * @protected
         * @type {jQuery}
         */
        el: null,

        /**
         * Canvas element. Automatically generated and prepended to [this.el]{@link CircleProgress#el}.
         * @protected
         * @type {HTMLCanvasElement}
         */
        canvas: null,

        /**
         * 2D-context of [this.canvas]{@link CircleProgress#canvas}.
         * @protected
         * @type {CanvasRenderingContext2D}
         */
        ctx: null,

        /**
         * Radius of the outer circle. Automatically calculated as `[this.size]{@link CircleProgress#size} / 2`.
         * @protected
         * @type {number}
         */
        radius: 0.0,

        /**
         * Fill of the main arc. Automatically calculated, depending on [this.fill]{@link CircleProgress#fill} option.
         * @protected
         * @type {string|CanvasGradient|CanvasPattern}
         */
        arcFill: null,

        /**
         * Last rendered frame value.
         * @protected
         * @type {number}
         */
        lastFrameValue: 0.0,

        /**
         * Init/re-init the widget.
         *
         * Throws a jQuery event:
         *
         * - `circle-inited(jqEvent)`
         *
         * @param {object} config - You can customize any class member (property or method).
         */
        init: function (config) {
            $.extend(this, config);
            this.radius = this.size / 2;
            this.initWidget();
            this.initFill();
            this.draw();
            this.el.trigger('circle-inited');
        },

        /**
         * Initialize `<canvas>`.
         * @protected
         */
        initWidget: function () {
            if (!this.canvas)
                this.canvas = $('<canvas>')[this.insertMode == 'prepend' ? 'prependTo' : 'appendTo'](this.el)[0];

            var canvas = this.canvas;
            canvas.width = this.size;
            canvas.height = this.size;
            this.ctx = canvas.getContext('2d');

            if (window.devicePixelRatio > 1) {
                var scaleBy = window.devicePixelRatio;
                canvas.style.width = canvas.style.height = this.size + 'px';
                canvas.width = canvas.height = this.size * scaleBy;
                this.ctx.scale(scaleBy, scaleBy);
            }
        },

        /**
         * This method sets [this.arcFill]{@link CircleProgress#arcFill}.
         * It could do this (on image load).
         * @protected
         */
        initFill: function () {
            var self = this,
              fill = this.fill,
              ctx = this.ctx,
              size = this.size;

            if (!fill)
                throw Error("The fill is not specified!");

            if (typeof fill == 'string')
                fill = { color: fill };

            if (fill.color)
                this.arcFill = fill.color;

            if (fill.gradient) {
                var gr = fill.gradient;

                if (gr.length == 1) {
                    this.arcFill = gr[0];
                } else if (gr.length > 1) {
                    var ga = fill.gradientAngle || 0, // gradient direction angle; 0 by default
                      gd = fill.gradientDirection || [
                          size / 2 * (1 - Math.cos(ga)), // x0
                          size / 2 * (1 + Math.sin(ga)), // y0
                          size / 2 * (1 + Math.cos(ga)), // x1
                          size / 2 * (1 - Math.sin(ga))  // y1
                      ];

                    var lg = ctx.createLinearGradient.apply(ctx, gd);

                    for (var i = 0; i < gr.length; i++) {
                        var color = gr[i],
                          pos = i / (gr.length - 1);

                        if ($.isArray(color)) {
                            pos = color[1];
                            color = color[0];
                        }

                        lg.addColorStop(pos, color);
                    }

                    this.arcFill = lg;
                }
            }

            if (fill.image) {
                var img;

                if (fill.image instanceof Image) {
                    img = fill.image;
                } else {
                    img = new Image();
                    img.src = fill.image;
                }

                if (img.complete)
                    setImageFill();
                else
                    img.onload = setImageFill;
            }

            function setImageFill() {
                var bg = $('<canvas>')[0];
                bg.width = self.size;
                bg.height = self.size;
                bg.getContext('2d').drawImage(img, 0, 0, size, size);
                self.arcFill = self.ctx.createPattern(bg, 'no-repeat');
                self.drawFrame(self.lastFrameValue);
            }
        },

        /**
         * Draw the circle.
         * @protected
         */
        draw: function () {
            if (this.animation)
                this.drawAnimated(this.value);
            else
                this.drawFrame(this.value);
        },

        /**
         * Draw a single animation frame.
         * @protected
         * @param {number} v - Frame value.
         */
        drawFrame: function (v) {
            this.lastFrameValue = v;
            this.ctx.clearRect(0, 0, this.size, this.size);
            this.drawEmptyArc(v);
            this.drawArc(v);
        },

        /**
         * Draw the arc (part of the circle).
         * @protected
         * @param {number} v - Frame value.
         */
        drawArc: function (v) {
            if (v === 0)
                return;

            var ctx = this.ctx,
              r = this.radius,
              t = this.getThickness(),
              a = this.startAngle;

            ctx.save();
            ctx.beginPath();

            if (!this.reverse) {
                ctx.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
            } else {
                ctx.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
            }

            ctx.lineWidth = t;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = this.arcFill;
            ctx.stroke();
            ctx.restore();
        },

        /**
         * Draw the _empty (background)_ arc (part of the circle).
         * @protected
         * @param {number} v - Frame value.
         */
        drawEmptyArc: function (v) {
            var ctx = this.ctx,
              r = this.radius,
              t = this.getThickness(),
              a = this.startAngle;

            if (v < 1) {
                ctx.save();
                ctx.beginPath();

                if (v <= 0) {
                    ctx.arc(r, r, r - t / 2, 0, Math.PI * 2);
                } else {
                    if (!this.reverse) {
                        ctx.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
                    } else {
                        ctx.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
                    }
                }

                ctx.lineWidth = t;
                ctx.strokeStyle = this.emptyFill;
                ctx.stroke();
                ctx.restore();
            }
        },

        /**
         * Animate the progress bar.
         *
         * Throws 3 jQuery events:
         *
         * - `circle-animation-start(jqEvent)`
         * - `circle-animation-progress(jqEvent, animationProgress, stepValue)` - multiple event
         *   animationProgress: from `0.0` to `1.0`; stepValue: from `0.0` to `value`
         * - `circle-animation-end(jqEvent)`
         *
         * @protected
         * @param {number} v - Final value.
         */
        drawAnimated: function (v) {
            var self = this,
              el = this.el,
              canvas = $(this.canvas);

            // stop previous animation before new "start" event is triggered
            canvas.stop(true, false);
            el.trigger('circle-animation-start');

            canvas
              .css({ animationProgress: 0 })
              .animate({ animationProgress: 1 }, $.extend({}, this.animation, {
                  step: function (animationProgress) {
                      var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
                      self.drawFrame(stepValue);
                      el.trigger('circle-animation-progress', [animationProgress, stepValue]);
                  }
              }))
              .promise()
              .always(function () {
                  // trigger on both successful & failure animation end
                  el.trigger('circle-animation-end');
              });
        },

        /**
         * Get the circle thickness.
         * @see CircleProgress#thickness
         * @protected
         * @returns {number}
         */
        getThickness: function () {
            return $.isNumeric(this.thickness) ? this.thickness : this.size / 14;
        },

        /**
         * Get current value.
         * @protected
         * @return {number}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * Set current value (with smooth animation transition).
         * @protected
         * @param {number} newValue
         */
        setValue: function (newValue) {
            if (this.animation)
                this.animationStartValue = this.lastFrameValue;
            this.value = newValue;
            this.draw();
        }
    };

    //----------------------------------- Initiating jQuery plugin -----------------------------------
    $.circleProgress = {
        // Default options (you may override them)
        defaults: CircleProgress.prototype
    };

    // ease-in-out-cubic
    $.easing.circleProgressEasing = function (x) {
        if (x < 0.5) {
            x = 2 * x;
            return 0.5 * x * x * x;
        } else {
            x = 2 - 2 * x;
            return 1 - 0.5 * x * x * x;
        }
    };

    /**
     * Creates an instance of {@link CircleProgress}.
     * Produces [init event]{@link CircleProgress#init} and [animation events]{@link CircleProgress#drawAnimated}.
     *
     * @param {object} [configOrCommand] - Config object or command name.
     *
     * Config example (you can specify any {@link CircleProgress} property):
     *
     * ```js
     * { value: 0.75, size: 50, animation: false }
     * ```
     *
     * Commands:
     *
     * ```js
     * el.circleProgress('widget'); // get the <canvas>
     * el.circleProgress('value'); // get the value
     * el.circleProgress('value', newValue); // update the value
     * el.circleProgress('redraw'); // redraw the circle
     * el.circleProgress(); // the same as 'redraw'
     * ```
     *
     * @param {string} [commandArgument] - Some commands (like `'value'`) may require an argument.
     * @see CircleProgress
     * @alias "$(...).circleProgress"
     */
    $.fn.circleProgress = function (configOrCommand, commandArgument) {
        var dataName = 'circle-progress',
          firstInstance = this.data(dataName);

        if (configOrCommand == 'widget') {
            if (!firstInstance)
                throw Error('Calling "widget" method on not initialized instance is forbidden');
            return firstInstance.canvas;
        }

        if (configOrCommand == 'value') {
            if (!firstInstance)
                throw Error('Calling "value" method on not initialized instance is forbidden');
            if (typeof commandArgument == 'undefined') {
                return firstInstance.getValue();
            } else {
                var newValue = arguments[1];
                return this.each(function () {
                    $(this).data(dataName).setValue(newValue);
                });
            }
        }

        return this.each(function () {
            var el = $(this),
              instance = el.data(dataName),
              config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                instance.init(config);
            } else {
                var initialConfig = $.extend({}, el.data());
                if (typeof initialConfig.fill == 'string')
                    initialConfig.fill = JSON.parse(initialConfig.fill);
                if (typeof initialConfig.animation == 'string')
                    initialConfig.animation = JSON.parse(initialConfig.animation);
                config = $.extend(initialConfig, config);
                config.el = el;
                instance = new CircleProgress(config);
                el.data(dataName, instance);
            }
        });
    };
});

/**
 * downCount: Simple Countdown clock with offset
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

(function ($) {

    $.fn.downCount = function (options, callback) {
        var settings = $.extend({
            date: null,
            offset: null
        }, options);

        // Throw error if date is not set
        if (!settings.date) {
            $.error('Date is not defined.');
        }

        // Throw error if date is set incorectly
        if (!Date.parse(settings.date)) {
            $.error('Incorrect date format, it should look like this, 12/24/2012 12:00:00.');
        }

        // Save container
        var container = this;

        /**
         * Change client's local date to match offset timezone
         * @return {Object} Fixed Date object.
         */
        var currentDate = function () {
            // get client's current date
            var date = new Date();

            // turn date to utc
            var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

            // set new Date object
            var new_date = new Date(utc + (3600000 * settings.offset))

            return new_date;
        };

        /**
         * Main downCount function that calculates everything
         */
        function countdown() {
            var target_date = new Date(settings.date), // set target date
                current_date = currentDate(); // get fixed current date

            // difference of dates
            var difference = target_date - current_date;

            // if difference is negative than it's pass the target date
            if (difference < 0) {
                // stop timer
                clearInterval(interval);

                if (callback && typeof callback === 'function') callback();

                return;
            }

            // basic math variables
            var _second = 1000,
                _minute = _second * 60,
                _hour = _minute * 60,
                _day = _hour * 24;

            // calculate dates
            var days = Math.floor(difference / _day),
                hours = Math.floor((difference % _day) / _hour),
                minutes = Math.floor((difference % _hour) / _minute),
                seconds = Math.floor((difference % _minute) / _second);

            // fix dates so that it will show two digets
            days = (String(days).length >= 2) ? days : '0' + days;
            hours = (String(hours).length >= 2) ? hours : '0' + hours;
            minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
            seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

            // based on the date change the refrence wording
            var ref_days = (days === 1) ? 'day' : 'days',
                ref_hours = (hours === 1) ? 'hour' : 'hours',
                ref_minutes = (minutes === 1) ? 'minute' : 'minutes',
                ref_seconds = (seconds === 1) ? 'second' : 'seconds';

            // set to DOM
            container.find('.days').text(days);
            container.find('.hours').text(hours);
            container.find('.minutes').text(minutes);
            container.find('.seconds').text(seconds);

            container.find('.days_ref').text(ref_days);
            container.find('.hours_ref').text(ref_hours);
            container.find('.minutes_ref').text(ref_minutes);
            container.find('.seconds_ref').text(ref_seconds);
        };

        // start
        var interval = setInterval(countdown, 1000);
    };

})(jQuery);

/*
* ===========================================================
* PROGRESS BAR - CIRCLE PROGRESS BAR - COUNTER - COUNTDOWN - FRAMEWORK Y
* ===========================================================
* This script manage the following component: progress bar, circle progress bar, counter and countdown.
* Documentation: www.framework-y.com/components/components.html#counter
* Documentation: www.framework-y.com/components/components.html#countdown
* Documentation: www.framework-y.com/components/components.html#progress-bar
* 
* Schiocco - Copyright (c) - Schiocco - Framework Y
*/

(function ($) {
    $(document).ready(function () {
        $("[data-time].countdown").each(function (index) {
            $(this).downCount({
                date: $(this).attr("data-time"),
                offset: $(this).attr("data-utc-offset")
            });
        });
        $(window).scroll(function () {
            $(".counter").each(function () {
                if (isScrollView(this)) {
                    var tr = $(this).attr("data-trigger");
                    var separator = $(this).attr("data-separator");
                    if (typeof separator == "undefined") separator = ".";
                    if (isEmpty(tr) || tr == "scroll") {
                        $(this).countTo({
                            formatter: function (value, options) {
                                return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
                            }
                        });
                        $(this).attr("data-trigger", "null");
                    }
                }
            });
            $("[data-progress].progress-bar").each(function () {
                if (isScrollView(this)) {
                    var tr = $(this).attr("data-trigger");
                    if (isEmpty(tr) || tr == "scroll") {
                        $(this).css("width", 0);
                        $(this).css("width", $(this).attr("data-progress") + "%");
                        $(this).attr("data-trigger", "null");
                    }
                }
            });
            $("[data-progress].progress-circle").each(function () {
                if (isScrollView(this)) {
                    var tr = $(this).attr("data-trigger");
                    if (isEmpty(tr) || tr == "scroll") {
                        $(this).progressCircle();
                        $(this).attr("data-trigger", "null");
                    }
                }
            });
        })
    });
    $.fn.progressCircle = function () {
        var optionsString = $(this).attr("data-options");
        var optionsArr;
        var _size = $(this).attr("data-size");
        var _color = $(this).attr("data-color");
        var _unit = $(this).attr("data-unit");
        var _thickness = $(this).attr("data-thickness");
        var _thickness = $(this).attr("data-thickness");
        if (isEmpty(_color)) _color = "#565656";
        if (isEmpty(_thickness)) _thickness = 2;
        if (isEmpty(_size) || _size == "auto") _size = $(this).outerWidth();
        if (_unit == null) _unit = "%";
        var options = {
            value: parseInt($(this).attr("data-progress"), 10) / 100,
            size: _size,
            fill: {
                gradient: [_color, _color]
            },
            thickness: _thickness,
            startAngle: -Math.PI / 2
        }
        if (!isEmpty(optionsString)) {
            optionsArr = optionsString.split(",");
            options = getOptionsString(optionsString, options);
        }
        $(this).circleProgress(options);
        var inner = $(this).find(".inner-circle .counter-circle");
        if (inner) {
            $(this).find(".inner-circle").css("display", "table")
            $(this).on('circle-animation-progress', function (event, progress, stepValue) {
                $(inner).html(parseInt(stepValue.toFixed(2) * 100, 10) + " " + _unit);
            });
        }
    }
}(jQuery));


