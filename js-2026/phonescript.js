$(document).ready(function(){
    var input = document.querySelector("#phone");
    var iti = window.intlTelInput(input, {
        excludeCountries: ["il"],
        hiddenInput: "00N0Y00000RODqu",
        preferredCountries: ['lb'],
        separateDialCode: true,
        utilsScript: "build-2026/js/utils.js",
    });

    input.addEventListener("countrychange", function() {
        $('#country_code').val(iti.getSelectedCountryData().iso2.toUpperCase());
        var nb = $("#phone").val().trim();
        if (nb != '') { $("#phone").blur(); }
    });

    var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
    $.validator.addMethod('Validphonenumber', function (value, element, param) {
        var errorCode = iti.getValidationError();
        var phonenb = iti.getNumber();
        errorCode = errorCode == -99 ? 0 : errorCode;
        var err = errorMap[errorCode];
        $.validator.messages.Validphonenumber = err;
        return iti.isValidNumber();
    }, "Invalid Phone Number");

    $("#phone").rules("add", {
        Validphonenumber: true
    });

    // Remove the old conflicting rule (if present)
    $("#phone").rules("remove", "validPhoneNumber");
});