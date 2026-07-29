// apply-validator-v1.js – Configurable validation (generic version)

(function () {
    'use strict';

    // Cookie functions
    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";domain=.aub.edu.lb;path=/;SameSite=Lax;Secure";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var cookiesArray = document.cookie.split(';');
        for (var i = 0; i < cookiesArray.length; i++) {
            var c = cookiesArray[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    $(document).ready(function () {
        // Get page config from form data attribute
        var $form = $('#myform');
        var pageConfigKey = $form.data('page-config');
        
        if (!pageConfigKey) {
            console.error('Page config not specified. Add data-page-config attribute to the form.');
            return;
        }

        if (typeof VALIDATOR_CONFIG === 'undefined') {
            console.error('Validator config not loaded');
            return;
        }

        var pageConfig = VALIDATOR_CONFIG[pageConfigKey];
        
        if (!pageConfig) {
            console.error('Config not found for:', pageConfigKey);
            return;
        }

        var $submitBtn = $('#submitbtn');
        var isBrochure = pageConfig.isBrochure || false;

        // ----- Field map (stores jQuery objects and error spans) -----
        var fields = {};
        var errorSpans = {};

        // ----- Helper: create error span for each field -----
        function createErrorContainer($input) {
            var $formGroup = $input.closest('.form-group');
            $formGroup.find('.custom-error').remove();
            var $target = $input.next('.focus-input100').length ? $input.next('.focus-input100') : $input;
            var $errorSpan = $('<span class="error help-block custom-error"></span>');
            $errorSpan.insertAfter($target);
            return $errorSpan;
        }

        // ----- Initialize all fields from config -----
        pageConfig.fields.forEach(function (fieldConfig) {
            var $field = $('#' + fieldConfig.id);
            if ($field.length) {
                fields[fieldConfig.id] = $field;
                errorSpans[fieldConfig.id] = createErrorContainer($field);
            } else {
                console.warn('Field not found:', fieldConfig.id);
            }
        });

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
            var input = document.querySelector("#phone");
            var iti = window.intlTelInputGlobals ? window.intlTelInputGlobals.getInstance(input) : null;
            if (iti && typeof iti.isValidNumber === 'function') {
                return iti.isValidNumber();
            }
            return $.trim($('#phone').val()) !== '';
        }

        function validateField(fieldId) {
            var $field = fields[fieldId];
            var $errorSpan = errorSpans[fieldId];
            var config = pageConfig.fields.find(function (f) { return f.id === fieldId; });
            if (!$field || !$errorSpan || !config) return true;

            var val = $.trim($field.val());
            var isValid = true;
            var errorMsg = '';

            switch (config.type) {
                case 'firstName':
                case 'lastName':
                case 'company':
                case 'countryResidence':
                case 'major':
                case 'position':
                    if (val === '') { isValid = false; errorMsg = config.label + ' is required'; }
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
                        isValid = false; errorMsg = 'Please enter a valid phone number';
                    }
                    break;
                case 'university':
                    if (val === '' || val === null) { isValid = false; errorMsg = 'Please select or enter your university'; }
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

        // ----- Attach live validation for each field -----
        pageConfig.fields.forEach(function (fieldConfig) {
            var $field = fields[fieldConfig.id];
            if (!$field) return;

            var event = fieldConfig.type === 'university' || fieldConfig.type === 'hearAbout' ? 'change' : 'input';
            $field.on(event, function () { validateField(fieldConfig.id); });

            // Phone special events
            if (fieldConfig.type === 'phone') {
                $field.on('countrychange', function () { validateField(fieldConfig.id); });
            }
        });

        // ----- Restore localStorage for configured fields -----
        if (pageConfig.localStorageFields) {
            pageConfig.localStorageFields.forEach(function (fieldId) {
                var $field = fields[fieldId];
                if ($field && localStorage.getItem('ls_' + fieldId) != null) {
                    $field.val(localStorage.getItem('ls_' + fieldId));
                }
            });
        }

        // ----- Global form validation -----
        function validateForm() {
            var isValid = true;
            pageConfig.fields.forEach(function (fieldConfig) {
                if (!validateField(fieldConfig.id)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        // ----- Form submission -----
        $form.on('submit', function (e) {
            e.preventDefault();

            if (!validateForm()) {
                var $firstError = $('.has-error').first();
                if ($firstError.length) {
                    $('html, body').animate({ scrollTop: $firstError.offset().top - 100 }, 200);
                }
                return false;
            }

            if ($submitBtn.data('submitting')) return false;
            $submitBtn.data('submitting', true);
            $('#loading-overlay').show();
            $submitBtn.prop('disabled', true).text(isBrochure ? 'DOWNLOADING...' : 'SUBMITTING...');

            // Save to localStorage
            if (pageConfig.localStorageFields) {
                pageConfig.localStorageFields.forEach(function (fieldId) {
                    var $field = fields[fieldId];
                    if ($field) {
                        localStorage.setItem('ls_' + fieldId, $field.val());
                    }
                });
            }

            // ---- Handle "Other" university (only if university field exists) ----
            var $uniSelect = fields.university;
            if ($uniSelect && $uniSelect.length) {
                var universityValue = $uniSelect.val();
                if (universityValue === "Other") {
                    var otherUniversity = $('#UniversityOther').val().trim();
                    if (otherUniversity === "") {
                        $('#loading-overlay').hide();
                        $submitBtn.prop('disabled', false).text(isBrochure ? 'DOWNLOAD BROCHURE' : 'SUBMIT');
                        $submitBtn.data('submitting', false);
                        alert("Please enter your university name.");
                        return false;
                    }
                    $('<input>').attr({ type: 'hidden', name: 'university', value: otherUniversity }).appendTo('form');
                    $uniSelect.prop('disabled', true);
                    universityValue = otherUniversity;
                }
            }

            // ---- Build description from configured fields ----
            var descriptionParts = [];
            if (pageConfig.descriptionFields && pageConfig.descriptionFields.length > 0) {
                pageConfig.descriptionFields.forEach(function (fieldId) {
                    var $field = fields[fieldId];
                    if ($field && $field.val()) {
                        var label = pageConfig.fields.find(function (f) { return f.id === fieldId; });
                        var fieldName = label ? label.label : fieldId;
                        descriptionParts.push(fieldName + ': ' + $field.val().trim());
                    }
                });
            }
            
            // If descriptionParts is empty, set a default value for brochures
            if (descriptionParts.length === 0) {
                $('#description').val(isBrochure ? 'Brochure Download Request' : 'No additional info');
            } else {
                $('#description').val(descriptionParts.join(' | '));
            }

            // ---- Mailchimp ----
            var email = $('#email').val();
            setCookie('useremail', email, 1);
            var fullName = $('#first_name').val() + ' ' + $('#last_name').val();
            var lastName = $('#last_name').val();
            if (typeof mcurl !== 'undefined' && mcurl) {
                mailchimpSubscribe(mcurl, email, fullName, lastName, '', 'b_643f74b5d97f671dfd188d733_2724d63912', function (err) {
                    if (err) console.warn("Mailchimp error:", err);
                });
            }

            // ---- Submit to Salesforce ----
            // The form will submit to Salesforce and redirect to retURL
            $form.get(0).submit();
        });
    });
})();