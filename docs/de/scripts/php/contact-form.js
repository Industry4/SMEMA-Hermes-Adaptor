/*
--------------------------------
Ajax Contact Form
--------------------------------
+ https://github.com/pinceladasdaweb/Ajax-Contact-Form
+ A Simple Ajax Contact Form developed in PHP with HTML5 Form validation.
+ Has a fallback in jQuery for browsers that do not support HTML5 form validation.
+ version 1.0.1
+ Copyright 2014 Pedro Rogerio
+ Licensed under the MIT license
+ https://github.com/pinceladasdaweb/Ajax-Contact-Form
*/

(function ($, window, document, undefined) {
    'use strict';
    $('.form-ajax').each(function (index) {
        var form = this;
        var sendToEmail = $(this).attr("data-email");
        var engine = $(this).attr("data-engine");
        if (isEmpty(engine)) engine = "php";
        if (isEmpty(sendToEmail)) sendToEmail = '';
        var subject = $(this).attr("data-subject");
        if (isEmpty(subject)) subject = '';

        $(form).submit(function (e) {
            // remove the error class
            $('.form-group').removeClass('has-error');
            $('.help-block').remove();

            // Google reCaptcha
            if ((typeof grecaptcha !== 'undefined') && $(this).find(".g-recaptcha").length) {
                if (grecaptcha.getResponse().length === 0) {
                    e.preventDefault;
                    return false;
                }
            }

            $(form).find(".cf-loader").show();

            // get the form data
            var formData = {
                'values': {},
                'domain': window.location.hostname.replace("www.", ""),
                'email': sendToEmail,
                'subject_email': subject,
                'engine': engine
            };

            $(form).find(".form-value").each(function () {
                var val = $(this).val();
                if (!isEmpty(val)) {
                    var name = $(this).attr("data-name");
                    if (isEmpty(name)) name = $(this).attr("name");
                    if (isEmpty(name)) name = $(this).attr("id");
                    var error_msg = $(this).attr("data-error");
                    if (isEmpty(error_msg)) error_msg = "";
                    formData['values'][name] = [val, error_msg];
                }
            });

            // process the form
            $.ajax({
                type: 'POST',
                url: $(form).attr("action"),
                data: formData,
                dataType: 'json',
                encode: true
            }).done(function (data) {
                if (!data.success) {
                    // Error
                    console.log(data);
                    $(form).find(".error-box").show();
                } else {
                    // Success
                    $(form).html($(form).find(".success-box").html());
                }
                $(form).find(".cf-loader").hide();
            }).fail(function (data) {
                // Error
                console.log(data);
                $(form).find(".error-box").show();
                $(form).find(".cf-loader").hide();
            });

            e.preventDefault();
        });
    });
}(jQuery, window, document));
