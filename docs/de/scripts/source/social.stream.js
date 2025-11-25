
/*
 * Name : TweeCool
 * version: 1.9 
 * Description: Get the latest tweets from twitter.
 * Website: www.tweecool.com
 * Licence: No licence, feel free to do whatever you want.
 * Author: TweeCool
 */

"use strict";
(function ($) {
    $.fn.extend({

        tweecool: function (options) {

            var defaults = {
                username: 'tweecool',
                limit: 5,
                profile_image: true,
                show_time: true,
                show_media: false,
                show_media_size: 'thumb',  //values: small, large, thumb, medium 
                show_actions: false,
                action_reply_icon: '&crarr;',
                action_retweet_icon: '&prop;',
                action_favorite_icon: '&#10084',
                profile_img_url: 'profile', //Values: profile, tweet 
                show_retweeted_text: false //This will show the original tweet in order to avoid any truncated text, and also the "RT @tweecool:" is removed which helps with 140 character limit

            }

            var options = $.extend(defaults, options);

            function xTimeAgo(time) {
                var nd = new Date();
                //var gmtDate = Date.UTC(nd.getFullYear(), nd.getMonth(), nd.getDate(), nd.getHours(), nd.getMinutes(), nd.getMilliseconds());
                var gmtDate = Date.parse(nd);
                var tweetedTime = time * 1000; //convert seconds to milliseconds
                var timeDiff = (gmtDate - tweetedTime) / 1000; //convert milliseconds to seconds

                var second = 1, minute = 60, hour = 60 * 60, day = 60 * 60 * 24, week = 60 * 60 * 24 * 7, month = 60 * 60 * 24 * 30, year = 60 * 60 * 24 * 365;

                if (timeDiff > second && timeDiff < minute) {
                    return Math.round(timeDiff / second) + " second" + (Math.round(timeDiff / second) > 1 ? 's' : '') + " ago";
                } else if (timeDiff >= minute && timeDiff < hour) {
                    return Math.round(timeDiff / minute) + " minute" + (Math.round(timeDiff / minute) > 1 ? 's' : '') + " ago";
                } else if (timeDiff >= hour && timeDiff < day) {
                    return Math.round(timeDiff / hour) + " hour" + (Math.round(timeDiff / hour) > 1 ? 's' : '') + " ago";
                } else if (timeDiff >= day && timeDiff < week) {
                    return Math.round(timeDiff / day) + " day" + (Math.round(timeDiff / day) > 1 ? 's' : '') + " ago";
                } else if (timeDiff >= week && timeDiff < month) {
                    return Math.round(timeDiff / week) + " week" + (Math.round(timeDiff / week) > 1 ? 's' : '') + " ago";
                } else if (timeDiff >= month && timeDiff < year) {
                    return Math.round(timeDiff / month) + " month" + (Math.round(timeDiff / month) > 1 ? 's' : '') + " ago";
                } else {
                    return 'over a year ago';
                }
            }

            return this.each(function () {
                var o = options;
                var wrapper = $(this);
                var wInner = $('<ul>').appendTo(wrapper);
                var urlpattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                var usernamepattern = /@+(\w+)/ig;
                var hashpattern = /#+(\w+)/ig;
                var pIMG, media, timestamp, abox, mtext;

                $.getJSON("http://tweecool.com/api/?screenname=" + o.username + "&count=" + o.limit, function (data) {

                    if (data.errors || data == null) {
                        wrapper.html('No tweets available.');
                        return false;
                    }

                    $.each(data.tweets, function (i, field) {

                        if (o.profile_image) {
                            if (o.profile_img_url == 'tweet') {
                                pIMG = '<a href="https://twitter.com/' + o.username + '/status/' + field.id_str + '" target="_blank"><img src="' + data.user.profile_image_url + '" alt="' + o.username + '" /></a>';
                            } else {
                                pIMG = '<a href="https://twitter.com/' + o.username + '" target="_blank"><img src="' + data.user.profile_image_url + '" alt="' + o.username + '" /></a>';
                            }
                        } else {
                            pIMG = '';
                        }

                        if (o.show_time) {
                            timestamp = xTimeAgo(field.timestamp);
                        } else {
                            timestamp = '';
                        }

                        if (o.show_media && field.media_url) {
                            media = '<a href="https://twitter.com/' + o.username + '/status/' + field.id_str + '" target="_blank"><img src="' + field.media_url + ':' + o.show_media_size + '" alt="' + o.username + '" class="media" /></a>';
                        } else {
                            media = '';
                        }

                        if (o.show_actions) {
                            abox = '<div class="action-box"><ul>';
                            abox += '<li class="ab_reply"><a title="Reply" href="https://twitter.com/intent/tweet?in_reply_to=' + field.id_str + '">' + o.action_reply_icon + '</a></li>';
                            abox += '<li class="ab_retweet"><a title="Retweet" href="https://twitter.com/intent/retweet?tweet_id=' + field.id_str + '">' + o.action_retweet_icon + '</a>' + (field.retweet_count_f != '' ? '<span>' + field.retweet_count_f + '</span>' : '') + '</li>';
                            abox += '<li class="ab_favorite"><a title="Favorite" href="https://twitter.com/intent/favorite?tweet_id=' + field.id_str + '">' + o.action_favorite_icon + '</a>' + (field.favorite_count_f != '' ? '<span>' + field.favorite_count_f + '</span>' : '') + '</li>';
                            abox += '</ul></div>';
                        } else {
                            abox = '';
                        }

                        if (o.show_retweeted_text && field.retweeted_text) {
                            mtext = field.retweeted_text;
                        } else {
                            mtext = field.text;
                        }

                        wInner.append('<li>' + pIMG + '<div class="tweets_txt">' + mtext.replace(urlpattern, '<a href="$1" target="_blank">$1</a>').replace(usernamepattern, '<a href="https://twitter.com/$1" target="_blank">@$1</a>').replace(hashpattern, '<a href="https://twitter.com/search?q=%23$1" target="_blank">#$1</a>') + media + ' <span>' + timestamp + '</span>' + abox + '</div></li>');
                    });

                }).fail(function (jqxhr, textStatus, error) {
                    //var err = textStatus + ', ' + error;
                    wrapper.html('No tweets available');
                });

            });

        }
    });

})(jQuery);

/*
 * Facebook Wall
 * https://github.com/thomasclausen/jquery-facebook-wall
 * Under MIT License
 */
(function ($) {
    $.fn.facebook_wall = function (options) {
        if (options.id === undefined || options.access_token === undefined) {
            return;
        }

        options = $.extend({
            id: '',
            access_token: '',
            limit: 15, // You can also pass a custom limit as a parameter.
            timeout: 400,
            speed: 400,
            effect: 'slide', // slide | fade | none
            locale: 'da_DK', // your contry code
            avatar_size: 'square', // square | small | normal | large
            message_length: 200, // Any amount you like. Above 0 shortens the message length
            show_guest_entries: true, // true | false
            text_labels: {
                shares: {
                    singular: 'Delt % gang',
                    plural: 'Delt % gange'
                },
                likes: {
                    singular: '% synes godt om',
                    plural: '% synes godt om'
                },
                comments: {
                    singular: '% kommentar',
                    plural: '% kommentarer'
                },
                like: 'Synes godt om',
                comment: 'Skriv kommentar',
                share: 'Del',
                weekdays: ['S&oslash;ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'L&oslash;rdag'],
                months: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
                seconds: {
                    few: 'F&aring; sekunder siden',
                    plural: ' sekunder siden'
                },
                minutes: {
                    singular: ' minut siden',
                    plural: ' minutter siden'
                },
                hours: {
                    singular: ' time siden',
                    plural: ' timer siden'
                },
                days: {
                    singular: ' dag siden',
                    plural: ' dage siden'
                }
            },
            on_complete: null
        }, options);

        var graphURL = 'https://graph.facebook.com/',
			graphTYPE = (options.show_guest_entries === false) ? 'posts' : 'feed',
			graphPOSTS = graphURL + options.id + '/' + graphTYPE + '/?access_token=' + options.access_token + '&limit=' + options.limit + '&locale=' + options.locale + '&date_format=U&callback=?',
			e = $(this);

        e.append('<div class="facebook-loading"></div>');

        $.getJSON(graphPOSTS, function (posts) {
            $.each(posts.data, function () {
                var output = '',
					post_class = '',
					media_class = '',
					split_id = '';

                if (this.is_hidden === false) {
                    if (this.type === 'link') {
                        post_class = 'type-link ';
                    } else if (this.type === 'photo') {
                        post_class = 'type-photo ';
                    } else if (this.type === 'status') {
                        post_class = 'type-status ';
                    } else if (this.type === 'video') {
                        post_class = 'type-video ';
                    }
                    output += '<li class="post ' + post_class + 'avatar-size-' + options.avatar_size + '">';
                    output += '<div class="meta-header">';
                    output += '<div class="avatar"><a href="http://www.facebook.com/profile.php?id=' + this.from.id + '" target="_blank" title="' + this.from.name + '"><img src="' + (graphURL + this.from.id + '/picture?type=' + options.avatar_size) + '" alt="' + this.from.name + '" /></a></div>';
                    output += '<div class="author"><a href="http://www.facebook.com/profile.php?id=' + this.from.id + '" target="_blank" title="' + this.from.name + '">' + this.from.name + '</a></div>';
                    output += '<div class="date">' + timeToHuman(this.created_time) + '</div>';
                    output += '</div>';

                    if (this.message !== undefined) {
                        if (options.message_length > 0 && this.message.length > options.message_length) {
                            output += '<div class="message">' + modText(this.message.substring(0, options.message_length)) + '...</div>';
                        } else {
                            output += '<div class="message">' + modText(this.message) + '</div>';
                        }
                    } else if (this.story !== undefined) {
                        if (options.message_length > 0 && this.story.length > options.message_length) {
                            output += '<div class="story">' + modText(this.story.substring(0, options.message_length)) + '...</div>';
                        } else {
                            output += '<div class="story">' + modText(this.story) + '</div>';
                        }
                    }

                    if (this.type === 'link' || this.type === 'photo' || this.type === 'video') {
                        if (this.picture !== undefined || this.object_id !== undefined) {
                            media_class = ' border-left';
                        } else {
                            media_class = '';
                        }
                        output += '<div class="media' + media_class + ' clearfix">';
                        if (this.picture !== undefined) {
                            output += '<div class="image"><a href="' + this.link + '" target="_blank"><img src="' + this.picture + '" /></a></div>';
                        } else if (this.object_id !== undefined) {
                            output += '<div class="image"><a href="' + this.link + '" target="_blank"><img src="' + (graphURL + this.object_id + '/picture?type=album') + '" /></a></div>';
                        }
                        output += '<div class="media-meta">';
                        if (this.name !== undefined) {
                            output += '<div class="name"><a href="' + this.link + '" target="_blank">' + this.name + '</a></div>';
                        }
                        if (this.caption !== undefined) {
                            output += '<div class="caption">' + modText(this.caption) + '</div>';
                        }
                        if (this.description !== undefined) {
                            output += '<div class="description">' + modText(this.description) + '</div>';
                        }
                        output += '</div>';
                        output += '</div>';
                    }

                    output += '<div class="meta-footer">';
                    output += '<time class="date" datetime="' + this.created_time + '" pubdate>' + timeToHuman(this.created_time) + '</time>';
                    if (this.likes !== undefined && this.likes.data !== undefined) {
                        if (this.likes.count !== undefined) {
                            if (this.likes.count === 1) {
                                output += '<span class="seperator">&middot;</span><span class="likes">' + options.text_labels.likes.singular.replace('%', this.likes.count) + '</span>';
                            } else {
                                output += '<span class="seperator">&middot;</span><span class="likes">' + options.text_labels.likes.plural.replace('%', this.likes.count) + '</span>';
                            }
                        } else {
                            if (this.likes.data.length === 1) {
                                output += '<span class="seperator">&middot;</span><span class="likes">' + options.text_labels.likes.singular.replace('%', this.likes.data.length) + '</span>';
                            } else {
                                output += '<span class="seperator">&middot;</span><span class="likes">' + options.text_labels.likes.plural.replace('%', this.likes.data.length) + '</span>';
                            }
                        }
                    }
                    if (this.comments !== undefined && this.comments.data !== undefined) {
                        if (this.comments.data.length === 1) {
                            output += '<span class="seperator">&middot;</span><span class="comments">' + options.text_labels.comments.singular.replace('%', this.comments.data.length) + '</span>';
                        } else {
                            output += '<span class="seperator">&middot;</span><span class="comments">' + options.text_labels.comments.plural.replace('%', this.comments.data.length) + '</span>';
                        }
                    }
                    if (this.shares !== undefined) {
                        if (this.shares.count === 1) {
                            output += '<span class="seperator">&middot;</span><span class="shares">' + options.text_labels.shares.singular.replace('%', this.shares.count) + '</span>';
                        } else {
                            output += '<span class="seperator">&middot;</span><span class="shares">' + options.text_labels.shares.plural.replace('%', this.shares.count) + '</span>';
                        }
                    } else {
                        output += '<span class="seperator">&middot;</span><span class="shares">' + options.text_labels.shares.plural.replace('%', '0') + '</span>';
                    }
                    split_id = this.id.split('_');
                    output += '<div class="actionlinks"><span class="like"><a href="http://www.facebook.com/permalink.php?story_fbid=' + split_id[1] + '&id=' + split_id[0] + '" target="_blank">' + options.text_labels.like + '</a></span><span class="seperator">&middot;</span><span class="comment"><a href="http://www.facebook.com/permalink.php?story_fbid=' + split_id[1] + '&id=' + split_id[0] + '" target="_blank">' + options.text_labels.comment + '</a></span><span class="seperator">&middot;</span><span class="share"><a href="http://www.facebook.com/permalink.php?story_fbid=' + split_id[1] + '&id=' + split_id[0] + '" target="_blank">' + options.text_labels.share + '</a></span></div>';
                    output += '</div>';

                    if (this.likes !== undefined && this.likes.data !== undefined) {
                        output += '<ul class="like-list">';
                        for (var l = 0; l < this.likes.data.length; l++) {
                            output += '<li class="like">';
                            output += '<div class="meta-header">';
                            output += '<div class="avatar"><a href="http://www.facebook.com/profile.php?id=' + this.likes.data[l].id + '" target="_blank" title="' + this.likes.data[l].name + '"><img src="' + (graphURL + this.likes.data[l].id + '/picture?type=' + options.avatar_size) + '" alt="' + this.likes.data[l].name + '" /></a></div>';
                            output += '<div class="author"><a href="http://www.facebook.com/profile.php?id=' + this.likes.data[l].id + '" target="_blank" title="' + this.likes.data[l].name + '">' + this.likes.data[l].name + '</a>' + options.text_labels.likes.singular.replace('%', '') + '</div>';
                            output += '</div>';
                            output += '</li>';
                        }
                        output += '</ul>';
                    }
                    if (this.comments !== undefined && this.comments.data !== undefined) {
                        output += '<ul class="comment-list">';
                        for (var c = 0; c < this.comments.data.length; c++) {
                            output += '<li class="comment">';
                            output += '<div class="meta-header">';
                            output += '<div class="avatar"><a href="http://www.facebook.com/profile.php?id=' + this.comments.data[c].from.id + '" target="_blank" title="' + this.comments.data[c].from.name + '"><img src="' + (graphURL + this.comments.data[c].from.id + '/picture?type=' + options.avatar_size) + '" alt="' + this.comments.data[c].from.name + '" /></a></div>';
                            output += '<div class="author"><a href="http://www.facebook.com/profile.php?id=' + this.comments.data[c].from.id + '" target="_blank" title="' + this.comments.data[c].from.name + '">' + this.comments.data[c].from.name + '</a></div>';
                            output += '<time class="date" datetime="' + this.comments.data[c].created_time + '" pubdate>' + timeToHuman(this.comments.data[c].created_time) + '</time>';
                            output += '</div>';
                            output += '<div class="message">' + modText(this.comments.data[c].message) + '</div>';
                            output += '<time class="date" datetime="' + this.comments.data[c].created_time + '" pubdate>' + timeToHuman(this.comments.data[c].created_time) + '</time>';
                            output += '</li>';
                        }
                        output += '</ul>';
                    }
                    output += '</li>';

                    e.append(output);
                }
            });
        }).complete(function () {
            $('.facebook-loading', e).fadeOut(800, function () {
                $(this).remove();
                for (var p = 0; p < e.children('li').length; p++) {
                    if (options.effect === 'none') {
                        e.children('li').eq(p).show();
                    } else if (options.effect === 'fade') {
                        e.children('li').eq(p).delay(p * options.timeout).fadeIn(options.speed);
                    } else {
                        e.children('li').eq(p).delay(p * options.timeout).slideDown(options.speed, function () {
                            $(this).css('overflow', 'visible');
                        });
                    }
                }
            });
            if ($.isFunction(options.on_complete)) {
                options.on_complete.call();
            }
        });

        function modText(text) {
            return nl2br(autoLink(escapeTags(text)));
        }
        function nl2br(str) {
            return str.replace(/(\r\n)|(\n\r)|\r|\n/g, '<br />');
        }
        function autoLink(str) {
            return str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>');
        }
        function escapeTags(str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        function timeToHuman(time) {
            var timestamp = new Date(time * 1000),
                dateString = timestamp.toGMTString(),
                time_difference = Math.round(new Date().getTime() / 1000) - time;

            if (time_difference < 10) {
                return options.text_labels.seconds.few;
            } else if (time_difference < 60) {
                return Math.round(time_difference) + options.text_labels.seconds.plural;
            } else if (Math.round(time_difference / 60) === 1) {
                return Math.round(time_difference / 60) + options.text_labels.minutes.singular;
            } else if (Math.round(time_difference / 60) < 60) {
                return Math.round(time_difference / 60) + options.text_labels.minutes.plural;
            } else if (Math.round(time_difference / (60 * 60)) === 1) {
                return Math.round(time_difference / (60 * 60)) + options.text_labels.hours.singular;
            } else if (Math.round(time_difference / (60 * 60)) < 24) {
                return Math.round(time_difference / (60 * 60)) + options.text_labels.hours.plural;
            } else if (Math.round(time_difference / (60 * 60 * 24)) === 1) {
                return Math.round(time_difference / (60 * 60 * 24)) + options.text_labels.days.singular;
            } else if (Math.round(time_difference / (60 * 60 * 24)) <= 10) {
                return Math.round(time_difference / (60 * 60 * 24)) + options.text_labels.days.plural;
            } else {
                return options.text_labels.weekdays[timestamp.getDay()] + ' d. ' + timestamp.getDate() + '. ' + options.text_labels.months[timestamp.getMonth()] + ' ' + timestamp.getFullYear();
            }
        }
    };
})(jQuery);

/*
* ===========================================================
* SOCIAL STREAM - FRAMEWORK Y
* ===========================================================
* Social stream of Facebook and Twitter, this script have 4 display types: simple list, scroll box container, slider and carousel
* The script require Flexslider for slider and carousel display type and Scroll box for scroll box display type
* Documentation: www.framework-y.com/components/social.html
* 
* Schiocco - Copyright (c) Federico Schiocchet - Schiocco - Framework Y
*/

var facebook_token = "468579063493515|vbOM4x_ROvDmC_03g3iI-KXqYA0";
(function ($) {
    $(document).ready(function () {
        $("*[data-social-id].social-feed-fb").each(function () {
            var t = this;
            var count = 4;
            var optionsString = $(t).attr("data-options");
            var id = $(t).attr("data-social-id");
            var token = $(t).attr("data-token");
            if (isEmpty(token)) token = facebook_token;
            var optionsArr;
            var options = {
                access_token: token,
                limit: count,
                locale: "en_US",
                show_guest_entries: false
            }

            if (!isEmpty(optionsString)) {
                optionsArr = optionsString.split(",");
                options = getOptionsString(optionsString, options);
            }

            if (!isEmpty(id)) options["id"] = id;
            $(t).facebook_wall(options);

            if ($(t).hasClass("flexslider")) {
                var timerVar;
                timerVar = self.setInterval(function () {
                    if ($(t).find('li.post').length == options["limit"] && $(t).find('.facebook-loading').length == 0) {
                        $(t).html("<ul class='slides'>" + $(t).html() + "</ul>");


                        $(t).find("li").each(function (index) {
                            $(this).html("<div class='fb-container'>" + $(this).html() + '</div>');

                        });

                        if (isEmpty($(t).attr("data-trigger"))) $(t).initFlexSlider();
                        $(t).css("opacity", 1);
                        clearInterval(timerVar);
                    }
                }, 1000);
            }
        });

        $("*[data-social-id].social-feed-tw").each(function () {
            var t = this;
            var optionsString = $(t).attr("data-options");
            var id = $(t).attr("data-social-id");
            var optionsArr;
            var options = {
                limit: 4,
                show_media: true
            }

            if (!isEmpty(optionsString)) {
                optionsArr = optionsString.split(",");
                options = getOptionsString(optionsString, options);
            }

            if (!isEmpty(id)) options["username"] = id;
            $(t).tweecool(options);

            if ($(t).hasClass("flexslider")) {
                var timerVar;
                timerVar = self.setInterval(function () {
                    if ($(t).find('ul li').length) {
                        if (isEmpty($(t).attr("data-trigger"))) $(t).initFlexSlider();
                        clearInterval(timerVar);
                    }
                }, 1300);
            }
        });
    });
}(jQuery));


