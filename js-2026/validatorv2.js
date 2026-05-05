// validatorv2.js - Clean, optimised version

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";domain=.aub.edu.lb;path=/;SameSite=Lax;Secure";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let c = cookiesArray[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function selectprogram() {
    var id = $('.program').val();
    if (id != '') $('#Campaign_ID').val(id);
}

function selectcountry() {
    var id = $('.country').val();
    if (id != '') $('#country_code').val(id);
}

$(document).ready(function () {
    // Restore from localStorage
    if (localStorage.getItem("ls_first_name") != null) $('#first_name').val(localStorage.getItem("ls_first_name"));
    if (localStorage.getItem("ls_last_name") != null) $('#last_name').val(localStorage.getItem("ls_last_name"));
    if (localStorage.getItem("ls_email") != null) $('#email').val(localStorage.getItem("ls_email"));

    // Custom email validation
    $.validator.addMethod("customemail", function (value, element) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    }, "Incorrect email address");

    jQuery.validator.setDefaults({ success: "valid" });

    $("form").validate({
        rules: {
            recordType: { required: true },
            first_name: { required: true },
            last_name: { required: true },
            '00N0Y00000QGklm': { required: true },
            title: { required: true },
            '00N0Y00000QGku0': { required: true },
            country_code: { required: true },
            'program': { required: true },
            '00N0Y00000QGkuK': { required: true, digits: true },
            '00N0Y00000QGl8W': { required: true, customemail: true },
            '00N0Y00000RODqu': { required: true },
            '00N0Y00000QGkrV': { required: true },
            '00N0Y00000QGksE': { required: true },
            // Additional fields
            country_residence: { required: true },
            university: { required: true },
            major: { required: true },
            years_experience: { required: true, number: true, min: 0 },
            hear_about: { required: true }
        },
        messages: {
            country_residence: { required: "Please enter your country of residence" },
            university: { required: "Please select or enter your university" },
            major: { required: "Please enter your major" },
            years_experience: { required: "Please enter your years of experience", number: "Please enter a valid number", min: "Years cannot be negative" },
            hear_about: { required: "Please select how you heard about us" }
        },
        submitHandler: function (form) {
            var $submitBtn = $('#submitbtn');
            if ($submitBtn.data('submitting')) return false;
            $submitBtn.data('submitting', true);

            // Show loading overlay and disable form elements
            $('#loading-overlay').show();
            $submitBtn.prop('disabled', true).text('SUBMITTING...');

            // Save to localStorage
            localStorage.setItem("ls_first_name", $('#first_name').val());
            localStorage.setItem("ls_last_name", $('#last_name').val());
            localStorage.setItem("ls_email", $('#email').val());

            // --- Handle University "Other" ---
            var $uniSelect = $('#university');
            var universityValue = $uniSelect.val();
            if (universityValue === "Other") {
                var otherUniversity = $('#UniversityOther').val().trim();
                if (otherUniversity === "") {
                    // Validation failed – re-enable and show error
                    $('#loading-overlay').hide();
                    $submitBtn.prop('disabled', false).text('SUBMIT');
                    $submitBtn.data('submitting', false);
                    alert("Please enter your university name.");
                    return false;
                }
                // Create a hidden input with the correct name and value, disable the select
                $('<input>').attr({
                    type: 'hidden',
                    name: 'university',
                    value: otherUniversity
                }).appendTo('form');
                $uniSelect.prop('disabled', true); // so its value is not sent
                universityValue = otherUniversity;
            }

            // Build description (concatenate extra fields)
            var concatDescription = "Country of Residence: " + $('#country_residence').val().trim() +
                " | University: " + universityValue +
                " | Major: " + $('#major').val().trim() +
                " | Years of Experience: " + $('#years_experience').val().trim() +
                " | How did you hear about us: " + $('#hear_about').val();
            $('#description').val(concatDescription);

            // Mailchimp (non-blocking)
            var email = $('#email').val();
            setCookie('useremail', email, 1);
            var fullName = $('#first_name').val() + ' ' + $('#last_name').val();
            var lastName = $('#last_name').val();
            var prefix = '';
            var honeyPot = 'b_643f74b5d97f671dfd188d733_2724d63912';
            var url = mcurl;

            if (url && url !== '') {
                // Fire-and-forget Mailchimp subscription
                mailchimpSubscribe(url, email, fullName, lastName, prefix, honeyPot, function (err) {
                    if (err) console.warn("Mailchimp subscription failed:", err);
                });
            }

            // Submit to Salesforce – use native DOM submit to bypass any jQuery handlers
            form.submit();
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("help-block");
            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parents(".val").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents(".val").addClass("has-success").removeClass("has-error");
        }
    });
});