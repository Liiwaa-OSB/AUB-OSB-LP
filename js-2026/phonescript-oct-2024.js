$(document).ready(function(){
    var input = document.querySelector("#phone");
   var iti =  window.intlTelInput(input, {
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
       excludeCountries: ["il"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
       hiddenInput: "00N0Y00000RODqu",
      // initialCountry: "auto",
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
      // placeholderNumberType: "MOBILE",
       preferredCountries: ['lb'],
        separateDialCode: true,
      utilsScript: "build-2026/js-2026/utils.js",
    });


input.addEventListener("countrychange",function() {
//change country code hidden field on country change using iti functions
$('#country_code').val(iti.getSelectedCountryData().iso2.toUpperCase());
var nb=$("#phone").val().trim();
if(nb!='')
{$("#phone").blur();}
//getSelectedCountryData
//getNumber
//getNumberType
//getExtension

});


var err='Invalid Phone Number';
var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
$.validator.addMethod('Validphonenumber', function (value, element, param) {

 var errorCode = iti.getValidationError();
  var phonenb=iti.getNumber()
   errorCode=errorCode==-99?0:errorCode;
   err=errorMap[errorCode];
    //console.log(err);

$('input[name=00N0Y00000RODqu]').val(phonenb);
$.validator.messages.Validphonenumber = err;
    return iti.isValidNumber();

}, err);

$("#phone").rules( "add", {
 Validphonenumber: true
});

})
 
 
 