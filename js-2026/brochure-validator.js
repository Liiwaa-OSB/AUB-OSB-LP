// brochure-validator.js - Simple, dedicated validator for brochure pages
(function ($) {
    "use strict";

    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";domain=.aub.edu.lb;path=/;SameSite=Lax;Secure";
    }

    $(document).ready(function () {
        // Restore from localStorage
        if (localStorage.getItem("ls_first_name")) $('#first_name').val(localStorage.getItem("ls_first_name"));
        if (localStorage.getItem("ls_last_name")) $('#last_name').val(localStorage.getItem("ls_last_name"));
        if (localStorage.getItem("ls_email")) $('#email').val(localStorage.getItem("ls_email"));

        // Custom email validation
        $.validator.addMethod("customemail", function (value) {
            return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        }, "Incorrect email address");

        // Validate only the fields present on brochure page
         $("#myform").validate({
            rules: {
                first_name: { required: true },
                last_name: { required: true },
                "00N0Y00000QGl8W": { required: true, customemail: true }, //email
                "00N0Y00000RODqu": { required: true } //phone
            },
            messages: {
                first_name: "First Name is required",
                last_name: "Last Name is required",
                "00N0Y00000QGl8W": "Valid email is required",
                "00N0Y00000RODqu": "Phone number is required"
            },
            submitHandler: function (form) {
                var $btn = $('#submitbtn');
                if ($btn.data('submitting')) return false;
                $btn.data('submitting', true);
                $('#loading-overlay').show();
                $btn.prop('disabled', true).text('SUBMITTING...');

                // Save to localStorage
                localStorage.setItem("ls_first_name", $('#first_name').val());
                localStorage.setItem("ls_last_name", $('#last_name').val());
                localStorage.setItem("ls_email", $('#email').val());

                // Mailchimp (non-blocking)
                var email = $('#email').val();
                setCookie('useremail', email, 1);
                if (typeof mcurl !== 'undefined' && mcurl) {
                    var fullName = $('#first_name').val() + ' ' + $('#last_name').val();
                    mailchimpSubscribe(mcurl, email, fullName, $('#last_name').val(), '', 'b_643f74b5d97f671dfd188d733_2724d63912', function (err) {
                        if (err) console.warn("Mailchimp error:", err);
                    });
                }

                // Submit to Salesforce
                form.submit();
            },
            errorPlacement: function (error, element) {
                error.addClass("help-block");
                error.insertAfter(element);
            }
        });
    });
})(jQuery);