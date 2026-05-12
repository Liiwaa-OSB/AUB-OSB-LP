// apply-validator.js – manual validation (email strictly enforced)

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

$(document).ready(function() {
    var $form = $('#myform');
    
    // ----- Fields -----
    var $firstName = $('#first_name');
    var $lastName = $('#last_name');
    var $email = $('#email');                    // name="00N0Y00000QGklI"
    var $phone = $('#phone');                    // visible phone input
    var $company = $('#employer');               // name="00N0Y00000QGku0"
    var $countryResidence = $('#country_residence');
    var $university = $('#university');
    var $major = $('#major');
    var $yearsExp = $('#years_experience');      // name="00N0Y00000QGkuK"
    var $hearAbout = $('#hear_about');
    
    var $submitBtn = $('#submitbtn');
    
    // ----- Helper: create error span for each field -----
    function createErrorContainer($input) {
        var $formGroup = $input.closest('.form-group');
        $formGroup.find('.custom-error').remove();
        var $target = $input.next('.focus-input100').length ? $input.next('.focus-input100') : $input;
        var $errorSpan = $('<span class="error help-block custom-error"></span>');
        $errorSpan.insertAfter($target);
        return $errorSpan;
    }
    
    var $firstNameError = createErrorContainer($firstName);
    var $lastNameError = createErrorContainer($lastName);
    var $emailError = createErrorContainer($email);
    var $phoneError = createErrorContainer($phone);
    var $companyError = createErrorContainer($company);
    var $countryResError = createErrorContainer($countryResidence);
    var $universityError = createErrorContainer($university);
    var $majorError = createErrorContainer($major);
    var $yearsExpError = createErrorContainer($yearsExp);
    var $hearAboutError = createErrorContainer($hearAbout);
    
    function setError($errorSpan, message) {
        $errorSpan.text(message).show();
        $errorSpan.closest('.form-group').addClass('has-error');
    }
    
    function clearError($errorSpan) {
        $errorSpan.text('').hide();
        $errorSpan.closest('.form-group').removeClass('has-error');
    }
    
    // ----- Validation functions -----
    function isValidEmail(email) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    }
    
    function isValidPhone() {
        // intlTelInput instance is attached to #phone by phonescript.js
        var input = document.querySelector("#phone");
        var iti = window.intlTelInputGlobals ? window.intlTelInputGlobals.getInstance(input) : null;
        if (iti && typeof iti.isValidNumber === 'function') {
            return iti.isValidNumber();
        }
        // fallback: just not empty
        return $.trim($phone.val()) !== '';
    }
    
    function validateField($field, $errorSpan, fieldType) {
        var val = $.trim($field.val());
        var isValid = true;
        var errorMsg = '';
        
        switch(fieldType) {
            case 'firstName':
                if (val === '') { isValid = false; errorMsg = 'First Name is required'; }
                break;
            case 'lastName':
                if (val === '') { isValid = false; errorMsg = 'Last Name is required'; }
                break;
            case 'email':
                if (val === '') {
                    isValid = false; errorMsg = 'Email is required';
                } else if (!isValidEmail(val)) {
                    isValid = false; errorMsg = 'Please enter a valid email address (e.g., name@example.com)';
                }
                break;
            case 'phone':
                if (val === '') {
                    isValid = false; errorMsg = 'Phone number is required';
                } else if (!isValidPhone()) {
                    isValid = false; errorMsg = 'Please enter a valid phone number (including country code)';
                }
                break;
            case 'company':
                if (val === '') { isValid = false; errorMsg = 'Company is required'; }
                break;
            case 'countryResidence':
                if (val === '') { isValid = false; errorMsg = 'Country of Residence is required'; }
                break;
            case 'university':
                if (val === '' || val === null) { isValid = false; errorMsg = 'Please select or enter your university'; }
                break;
            case 'major':
                if (val === '') { isValid = false; errorMsg = 'University Major is required'; }
                break;
            case 'yearsExp':
                var num = parseInt(val, 10);
                if (val === '') {
                    isValid = false; errorMsg = 'Years of experience is required';
                } else if (isNaN(num) || num < 0) {
                    isValid = false; errorMsg = 'Please enter a valid number (0 or greater)';
                }
                break;
            case 'hearAbout':
                if (val === '' || val === null) { isValid = false; errorMsg = 'Please select how you heard about us'; }
                break;
            default: break;
        }
        
        if (!isValid) {
            setError($errorSpan, errorMsg);
        } else {
            clearError($errorSpan);
        }
        return isValid;
    }
    
    // ----- Attach live validation -----
    $firstName.on('input', function() { validateField($firstName, $firstNameError, 'firstName'); });
    $lastName.on('input', function() { validateField($lastName, $lastNameError, 'lastName'); });
    $email.on('input', function() { validateField($email, $emailError, 'email'); });
    $phone.on('input', function() { validateField($phone, $phoneError, 'phone'); });
    $phone.on('countrychange', function() { validateField($phone, $phoneError, 'phone'); });
    $company.on('input', function() { validateField($company, $companyError, 'company'); });
    $countryResidence.on('input', function() { validateField($countryResidence, $countryResError, 'countryResidence'); });
    $university.on('change', function() { validateField($university, $universityError, 'university'); });
    $major.on('input', function() { validateField($major, $majorError, 'major'); });
    $yearsExp.on('input', function() { validateField($yearsExp, $yearsExpError, 'yearsExp'); });
    $hearAbout.on('change', function() { validateField($hearAbout, $hearAboutError, 'hearAbout'); });
    
    // ----- Restore localStorage -----
    if (localStorage.getItem("ls_first_name") != null) $firstName.val(localStorage.getItem("ls_first_name"));
    if (localStorage.getItem("ls_last_name") != null) $lastName.val(localStorage.getItem("ls_last_name"));
    if (localStorage.getItem("ls_email") != null) $email.val(localStorage.getItem("ls_email"));
    
    // ----- Global form validation -----
    function validateForm() {
        var isValid = true;
        isValid = validateField($firstName, $firstNameError, 'firstName') && isValid;
        isValid = validateField($lastName, $lastNameError, 'lastName') && isValid;
        isValid = validateField($email, $emailError, 'email') && isValid;
        isValid = validateField($phone, $phoneError, 'phone') && isValid;
        isValid = validateField($company, $companyError, 'company') && isValid;
        isValid = validateField($countryResidence, $countryResError, 'countryResidence') && isValid;
        isValid = validateField($university, $universityError, 'university') && isValid;
        isValid = validateField($major, $majorError, 'major') && isValid;
        isValid = validateField($yearsExp, $yearsExpError, 'yearsExp') && isValid;
        isValid = validateField($hearAbout, $hearAboutError, 'hearAbout') && isValid;
        return isValid;
    }
    
    // ----- Form submission -----
    $form.on('submit', function(e) {
        e.preventDefault();   // prevent default POST until valid
        
        if (!validateForm()) {
            // Scroll to first error
            var $firstError = $('.has-error').first();
            if ($firstError.length) {
                $('html, body').animate({ scrollTop: $firstError.offset().top - 100 }, 200);
            }
            return false;
        }
        
        // Prevent double submission
        if ($submitBtn.data('submitting')) return false;
        $submitBtn.data('submitting', true);
        $('#loading-overlay').show();
        $submitBtn.prop('disabled', true).text('SUBMITTING...');
        
        // Save to localStorage
        localStorage.setItem("ls_first_name", $firstName.val());
        localStorage.setItem("ls_last_name", $lastName.val());
        localStorage.setItem("ls_email", $email.val());
        
        // ---- Handle "Other" university (if select allows it) ----
        var $uniSelect = $university;
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
        
        // ---- Build description (Salesforce description field) ----
        var concatDescription = "Country of Residence: " + $countryResidence.val().trim() +
            " | University: " + universityValue +
            " | Major: " + $major.val().trim() +
            " | How did you hear about us: " + $hearAbout.val();
        $('#description').val(concatDescription);
        
        // ---- Mailchimp (fire-and-forget) ----
        var email = $email.val();
        setCookie('useremail', email, 1);
        var fullName = $firstName.val() + ' ' + $lastName.val();
        var lastName = $lastName.val();
        if (typeof mcurl !== 'undefined' && mcurl) {
            mailchimpSubscribe(mcurl, email, fullName, lastName, '', 'b_643f74b5d97f671dfd188d733_2724d63912', function (err) {
                if (err) console.warn("Mailchimp error:", err);
            });
        }
        
        // ---- Finally submit to Salesforce ----
        $form.get(0).submit();
    });
});