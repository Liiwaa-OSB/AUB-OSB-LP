// brochure-validator.js

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";domain=.aub.edu.lb;path=/;SameSite=Lax;Secure";
}

$(document).ready(function () {
    var $form = $('#myform');
    var $firstName = $('#first_name');
    var $lastName = $('#last_name');
    var $email = $('#email');
    var $phone = $('#phone');
    var $submitBtn = $('#submitbtn');

    // Create a unique error span for each field (avoid duplication)
    function createErrorContainer($input) {
        var $formGroup = $input.closest('.form-group');
        // Remove any existing custom error
        $formGroup.find('.custom-error').remove();
        var $target = $input.next('.focus-input100').length ? $input.next('.focus-input100') : $input;
        var $errorSpan = $('<span class="error help-block"></span>');
        $errorSpan.insertAfter($target);
        return $errorSpan;
    }

    var $firstNameError = createErrorContainer($firstName);
    var $lastNameError = createErrorContainer($lastName);
    var $emailError = createErrorContainer($email);
    var $phoneError = createErrorContainer($phone);

    function setError($errorSpan, message) {
        $errorSpan.text(message).show();
        $errorSpan.closest('.form-group').addClass('has-error');
    }

    function clearError($errorSpan) {
        $errorSpan.text('').hide();
        $errorSpan.closest('.form-group').removeClass('has-error');
    }

    // Restore from localStorage
    if (localStorage.getItem("ls_first_name")) $firstName.val(localStorage.getItem("ls_first_name"));
    if (localStorage.getItem("ls_last_name")) $lastName.val(localStorage.getItem("ls_last_name"));
    if (localStorage.getItem("ls_email")) $email.val(localStorage.getItem("ls_email"));

    function isValidEmail(email) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    }

    function isValidPhone() {
        var input = document.querySelector("#phone");
        var iti = window.intlTelInputGlobals ? window.intlTelInputGlobals.getInstance(input) : null;
        if (iti && typeof iti.isValidNumber === 'function') {
            return iti.isValidNumber();
        }
        return $.trim($phone.val()) !== '';
    }

    function validateField(field, errorSpan) {
        var val = $.trim(field.val());
        var isValid = true;
        var errorMsg = '';

        if (field.is($firstName)) {
            if (val === '') {
                isValid = false;
                errorMsg = 'First Name is required';
            }
        } 
        else if (field.is($lastName)) {
            if (val === '') {
                isValid = false;
                errorMsg = 'Last Name is required';
            }
        }
        else if (field.is($email)) {
            if (val === '') {
                isValid = false;
                errorMsg = 'Email is required';
            } else if (!isValidEmail(val)) {
                isValid = false;
                errorMsg = 'Please enter a valid email address (e.g., name@example.com)';
            }
        }
        else if (field.is($phone)) {
            if (val === '') {
                isValid = false;
                errorMsg = 'Phone number is required';
            } else if (!isValidPhone()) {
                isValid = false;
                errorMsg = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            setError(errorSpan, errorMsg);
        } else {
            clearError(errorSpan);
        }
        return isValid;
    }

    function validateForm() {
        var isValid = true;
        isValid = validateField($firstName, $firstNameError) && isValid;
        isValid = validateField($lastName, $lastNameError) && isValid;
        isValid = validateField($email, $emailError) && isValid;
        isValid = validateField($phone, $phoneError) && isValid;
        return isValid;
    }

    // Live validation on input/change
    $firstName.on('input', function() { validateField($firstName, $firstNameError); });
    $lastName.on('input', function() { validateField($lastName, $lastNameError); });
    $email.on('input', function() { validateField($email, $emailError); });
    $phone.on('input', function() { validateField($phone, $phoneError); });
    $phone.on('countrychange', function() { validateField($phone, $phoneError); });

    $form.on('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            var firstError = $('.has-error').first();
            if (firstError.length) {
                $('html, body').animate({ scrollTop: firstError.offset().top - 100 }, 200);
            }
            return false;
        }

        if ($submitBtn.data('submitting')) return false;
        $submitBtn.data('submitting', true);
        $('#loading-overlay').show();
        $submitBtn.prop('disabled', true).text('DOWNLOADING...');

        localStorage.setItem("ls_first_name", $firstName.val());
        localStorage.setItem("ls_last_name", $lastName.val());
        localStorage.setItem("ls_email", $email.val());

        var email = $email.val();
        setCookie('useremail', email, 1);
        var fullName = $firstName.val() + ' ' + $lastName.val();
        var lastName = $lastName.val();
        if (typeof mcurl !== 'undefined' && mcurl) {
            mailchimpSubscribe(mcurl, email, fullName, lastName, '', 'b_643f74b5d97f671dfd188d733_2724d63912', function (err) {
                if (err) console.warn("Mailchimp error:", err);
            });
        }

        $form.get(0).submit();
    });
});