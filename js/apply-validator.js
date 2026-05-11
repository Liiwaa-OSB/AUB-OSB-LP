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

    // Campaign override for country_code (must run after phonescript sets default)
    function getCampaignParam() {
        var url = window.location.href.toLowerCase();
        var match = url.match(/[?&]campaign=([^&#]*)/i);
        return match ? match[1] : null;
    }
    var campaign = getCampaignParam();
    var campaignCountry = null;
    switch (campaign) {
        case "uae": campaignCountry = "AE"; break;
        case "ksa": campaignCountry = "SA"; break;
        case "kwt": campaignCountry = "KW"; break;
        case "qat": campaignCountry = "QA"; break;
        case "jor": campaignCountry = "JO"; break;
        case "nyc": campaignCountry = "US"; break;
        case "fra": campaignCountry = "FR"; break;
        default: campaignCountry = null;
    }
    if (campaignCountry) {
        $('#country_code').val(campaignCountry);
    }
    // If no campaign, country_code already set by phone selection (default = phone's country)

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
            '00N0Y00000QGkuK': { required: true, digits: true, min: 0 },  // years of experience
            '00N0Y00000QGl8W': { required: true, customemail: true },
            '00N0Y00000QGkrV': { required: true },
            '00N0Y00000QGksE': { required: true },
            country_residence: { required: true },
            university: { required: true },
            major: { required: true },
            hear_about: { required: true }
        },
        messages: {
            country_residence: "Please enter your country of residence",
            university: "Please select or enter your university",
            major: "Please enter your major",
            '00N0Y00000QGkuK': { required: "Please enter your years of experience", digits: "Enter a number", min: "Cannot be negative" },
            hear_about: "Please select how you heard about us"
        },
        submitHandler: function (form) {
            var $submitBtn = $('#submitbtn');
            if ($submitBtn.data('submitting')) return false;
            $submitBtn.data('submitting', true);
            $('#loading-overlay').show();
            $submitBtn.prop('disabled', true).text('SUBMITTING...');

            localStorage.setItem("ls_first_name", $('#first_name').val());
            localStorage.setItem("ls_last_name", $('#last_name').val());
            localStorage.setItem("ls_email", $('#email').val());

            // Handle "Other" university
            var $uniSelect = $('#university');
            var universityValue = $uniSelect.val();
            if (universityValue === "Other") {
                var otherUniversity = $('#UniversityOther').val().trim();
                if (otherUniversity === "") {
                    $('#loading-overlay').hide();
                    $submitBtn.prop('disabled', false).text('SUBMIT');
                    $submitBtn.data('submitting', false);
                    alert("Please enter your university name.");
                    return false;
                }
                $('<input>').attr({ type: 'hidden', name: 'university', value: otherUniversity }).appendTo('form');
                $uniSelect.prop('disabled', true);
                universityValue = otherUniversity;
            }

            // Build description – WITHOUT years of experience
            var concatDescription = "Country of Residence: " + $('#country_residence').val().trim() +
                " | University: " + universityValue +
                " | Major: " + $('#major').val().trim() +
                " | How did you hear about us: " + $('#hear_about').val();
            $('#description').val(concatDescription);

            // Mailchimp (fire-and-forget)
            var email = $('#email').val();
            setCookie('useremail', email, 1);
            var fullName = $('#first_name').val() + ' ' + $('#last_name').val();
            var lastName = $('#last_name').val();
            if (typeof mcurl !== 'undefined' && mcurl) {
                mailchimpSubscribe(mcurl, email, fullName, lastName, '', 'b_643f74b5d97f671dfd188d733_2724d63912', function (err) {
                    if (err) console.warn("Mailchimp error:", err);
                });
            }

            // Submit to Salesforce
            form.submit();
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("help-block").insertAfter(element);
        },
        highlight: function (element) {
            $(element).parents(".val").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element) {
            $(element).parents(".val").addClass("has-success").removeClass("has-error");
        }
    });
});