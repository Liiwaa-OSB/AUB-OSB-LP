// E&I-apply-validator-v1.js
// Validates the new E&I form.
// Uses the visible field IDs/groups.
// Submits fields through their actual Salesforce names.
// Does NOT dump form values into description.

function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie =
        name + "=" + encodeURIComponent(value || "") +
        ";expires=" + date.toUTCString() +
        ";domain=.aub.edu.lb;path=/;SameSite=Lax;Secure";
}

$(document).ready(function () {
    var $form = $("#myform");
    var $submitBtn = $("#submitbtn");

    // ----------------------------------
    // Salesforce field-name correction
    // ----------------------------------
    function prepareSalesforceNames() {
        // Hidden / campaign fields
        $('input[name="00NP500000D37Bx"]').not("#Campaign_Name").remove();
        $('input[name="00NP500000D37IP"]').not("#AD_Name").remove();

        $('[name="00N0Y00000QGkma"]').attr("id", "00N0Y00000QGkma");

        // Main visible fields
        $("#dob").attr("name", "00N0Y00000QGklS");
        $("#nationality").attr("name", "Nationality");
        $("#second_nationality").attr("name", "SecondNationality");
        $("#university").attr("name", "UniversityName");
        $("#major").attr("name", "UniversityMajor");
        $("#grad_year").attr("name", "GraduationYear");
        $("#motivation").attr("name", "00N1n00000SzELk");
        $("#outcome").attr("name", "00N1n00000SzELj");

        // Radio groups
        $("#gender-group input[type='radio']").attr("name", "00N0Y00000QGklm");
        $("#aub-grad-group input[type='radio']").attr("name", "00N0Y00000QGkrV");
        $("#first-gen-group input[type='radio']").attr("name", "AUBfirstgeration");
        $("#degree-group input[type='radio']").attr("name", "DegreeType");
        $("#hear-group input[type='radio']").attr("name", "howprogramheared");

        // Employment field expects Salesforce values
        $("#employed-group input[type='radio']").attr("name", "00N1n00000SzELh");
        $("#employed-group input[value='Yes']").val("Employed");
        $("#employed-group input[value='No']").val("Unemployed");
    }

    prepareSalesforceNames();

    // ----------------------------------
    // Helpers
    // ----------------------------------
    function trimVal(selector) {
        return $.trim($(selector).val() || "");
    }

    function getGroup(selector) {
        return $(selector).closest(".form-group");
    }

    function setError($group, message) {
        var $error = $group.find(".error-message").first();

        if (!$error.length) {
            $error = $('<span class="error-message"></span>');
            $group.append($error);
        }

        $error.text(message).show();
        $group.addClass("has-error").removeClass("has-success");
    }

    function clearError($group) {
        var $error = $group.find(".error-message").first();
        $error.text("").hide();
        $group.removeClass("has-error").addClass("has-success");
    }

    function checkedValue(groupSelector) {
        return $(groupSelector).find("input[type='radio']:checked").val() || "";
    }

    function isValidEmail(email) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    }

    function getIntlTelInstance() {
        var input = document.querySelector("#phone");

        if (!input || !window.intlTelInputGlobals) {
            return null;
        }

        return window.intlTelInputGlobals.getInstance(input);
    }

    function isValidPhone() {
        var iti = getIntlTelInstance();

        if (iti && typeof iti.isValidNumber === "function") {
            return iti.isValidNumber();
        }

        return trimVal("#phone") !== "";
    }

    function isFutureDate(value) {
        if (!value) return false;

        var selectedDate = new Date(value + "T00:00:00");
        var today = new Date();

        today.setHours(0, 0, 0, 0);

        return selectedDate > today;
    }

    function isValidGraduationYear(value) {
        if (!/^\d{4}$/.test(value)) return false;

        var year = parseInt(value, 10);

        return year >= 1960 && year <= 2030;
    }

    function validateText(selector, message) {
        var $group = getGroup(selector);

        if (trimVal(selector) === "") {
            setError($group, message);
            return false;
        }

        clearError($group);
        return true;
    }

    function validateRadio(groupSelector, message) {
        var $group = $(groupSelector);

        if (!checkedValue(groupSelector)) {
            setError($group, message);
            return false;
        }

        clearError($group);
        return true;
    }

    function validateSelect(selector, message) {
        var $group = getGroup(selector);

        if (trimVal(selector) === "") {
            setError($group, message);
            return false;
        }

        clearError($group);
        return true;
    }

    // ----------------------------------
    // Validation
    // ----------------------------------
    function validateForm() {
        var isValid = true;

        isValid = validateText("#first_name", "First Name is required") && isValid;
        isValid = validateText("#last_name", "Last Name is required") && isValid;

        var email = trimVal("#email");
        if (email === "") {
            setError($("#email-group"), "Email is required");
            isValid = false;
        } else if (!isValidEmail(email)) {
            setError($("#email-group"), "Please enter a valid email address");
            isValid = false;
        } else {
            clearError($("#email-group"));
        }

        if (trimVal("#phone") === "") {
            setError($("#phone-group"), "Phone number is required");
            isValid = false;
        } else if (!isValidPhone()) {
            setError($("#phone-group"), "Please enter a valid phone number");
            isValid = false;
        } else {
            clearError($("#phone-group"));
        }

        isValid = validateText("#country_residence", "Current Country of Residence is required") && isValid;
        isValid = validateRadio("#gender-group", "Please select your gender") && isValid;

        var dob = trimVal("#dob");
        if (dob === "") {
            setError($("#dob-group"), "Date of Birth is required");
            isValid = false;
        } else if (isFutureDate(dob)) {
            setError($("#dob-group"), "Date of Birth cannot be in the future");
            isValid = false;
        } else {
            clearError($("#dob-group"));
        }

        isValid = validateText("#nationality", "Nationality is required") && isValid;
        isValid = validateRadio("#aub-grad-group", "Please select whether you are an AUB graduate") && isValid;
        isValid = validateRadio("#first-gen-group", "Please select whether you are a first generation college student") && isValid;
        isValid = validateText("#university", "University name is required") && isValid;
        isValid = validateRadio("#degree-group", "Please select your degree type") && isValid;
        isValid = validateText("#major", "University Major is required") && isValid;

        var gradYear = trimVal("#grad_year");
        if (gradYear === "") {
            setError($("#grad-year-group"), "Year of Graduation is required");
            isValid = false;
        } else if (!isValidGraduationYear(gradYear)) {
            setError($("#grad-year-group"), "Please enter a valid graduation year");
            isValid = false;
        } else {
            clearError($("#grad-year-group"));
        }

        isValid = validateRadio("#employed-group", "Please select whether you are currently employed") && isValid;
        isValid = validateSelect("#motivation", "Please select your motivation") && isValid;
        isValid = validateText("#outcome", "Please enter the expected outcome") && isValid;
        isValid = validateRadio("#hear-group", "Please select how you heard about this program") && isValid;

        return isValid;
    }

    // ----------------------------------
    // Live validation
    // ----------------------------------
    $("#first_name").on("input", function () {
        validateText("#first_name", "First Name is required");
    });

    $("#last_name").on("input", function () {
        validateText("#last_name", "Last Name is required");
    });

    $("#email").on("input", function () {
        var email = trimVal("#email");

        if (email === "") {
            setError($("#email-group"), "Email is required");
        } else if (!isValidEmail(email)) {
            setError($("#email-group"), "Please enter a valid email address");
        } else {
            clearError($("#email-group"));
        }
    });

    $("#phone").on("input countrychange", function () {
        if (trimVal("#phone") === "") {
            setError($("#phone-group"), "Phone number is required");
        } else if (!isValidPhone()) {
            setError($("#phone-group"), "Please enter a valid phone number");
        } else {
            clearError($("#phone-group"));
        }
    });

    $("#country_residence").on("input", function () {
        validateText("#country_residence", "Current Country of Residence is required");
    });

    $("#gender-group input[type='radio']").on("change", function () {
        validateRadio("#gender-group", "Please select your gender");
    });

    $("#dob").on("input change", function () {
        var dob = trimVal("#dob");

        if (dob === "") {
            setError($("#dob-group"), "Date of Birth is required");
        } else if (isFutureDate(dob)) {
            setError($("#dob-group"), "Date of Birth cannot be in the future");
        } else {
            clearError($("#dob-group"));
        }
    });

    $("#nationality").on("input", function () {
        validateText("#nationality", "Nationality is required");
    });

    $("#aub-grad-group input[type='radio']").on("change", function () {
        validateRadio("#aub-grad-group", "Please select whether you are an AUB graduate");
    });

    $("#first-gen-group input[type='radio']").on("change", function () {
        validateRadio("#first-gen-group", "Please select whether you are a first generation college student");
    });

    $("#university").on("input", function () {
        validateText("#university", "University name is required");
    });

    $("#degree-group input[type='radio']").on("change", function () {
        validateRadio("#degree-group", "Please select your degree type");
    });

    $("#major").on("input", function () {
        validateText("#major", "University Major is required");
    });

    $("#grad_year").on("input", function () {
        var gradYear = trimVal("#grad_year");

        if (gradYear === "") {
            setError($("#grad-year-group"), "Year of Graduation is required");
        } else if (!isValidGraduationYear(gradYear)) {
            setError($("#grad-year-group"), "Please enter a valid graduation year");
        } else {
            clearError($("#grad-year-group"));
        }
    });

    $("#employed-group input[type='radio']").on("change", function () {
        validateRadio("#employed-group", "Please select whether you are currently employed");
    });

    $("#motivation").on("change", function () {
        validateSelect("#motivation", "Please select your motivation");
    });

    $("#outcome").on("input", function () {
        validateText("#outcome", "Please enter the expected outcome");
    });

    $("#hear-group input[type='radio']").on("change", function () {
        validateRadio("#hear-group", "Please select how you heard about this program");
    });

    // ----------------------------------
    // Restore saved user basics
    // ----------------------------------
    if (localStorage.getItem("ls_first_name") !== null) {
        $("#first_name").val(localStorage.getItem("ls_first_name"));
    }

    if (localStorage.getItem("ls_last_name") !== null) {
        $("#last_name").val(localStorage.getItem("ls_last_name"));
    }

    if (localStorage.getItem("ls_email") !== null) {
        $("#email").val(localStorage.getItem("ls_email"));
    }

    // ----------------------------------
    // Submit
    // ----------------------------------
    $form.on("submit", function (e) {
        e.preventDefault();

        prepareSalesforceNames();

        if (!validateForm()) {
            var $firstError = $(".has-error").first();

            if ($firstError.length) {
                $("html, body").animate({
                    scrollTop: $firstError.offset().top - 100
                }, 200);
            }

            return false;
        }

        if ($submitBtn.data("submitting")) {
            return false;
        }

        $submitBtn.data("submitting", true);
        $("#loading-overlay").show();
        $submitBtn.prop("disabled", true).text("SUBMITTING...");

        localStorage.setItem("ls_first_name", $("#first_name").val());
        localStorage.setItem("ls_last_name", $("#last_name").val());
        localStorage.setItem("ls_email", $("#email").val());

        // Do NOT populate description with all fields.
        // These fields already submit directly to Salesforce.
        $("#description").val("");

        if (typeof GoogleConversion === "function") {
            GoogleConversion();
        }

        var email = $("#email").val();
        var fullName = $("#first_name").val() + " " + $("#last_name").val();
        var lastName = $("#last_name").val();

        setCookie("useremail", email, 1);

        if (typeof mailchimpSubscribe === "function" && typeof mcurl !== "undefined" && mcurl) {
            mailchimpSubscribe(
                mcurl,
                email,
                fullName,
                lastName,
                "",
                "b_643f74b5d97f671dfd188d733_2724d63912",
                function (err) {
                    if (err) {
                        console.warn("Mailchimp error:", err);
                    }
                }
            );
        }

        $form.get(0).submit();
        return true;
    });
});