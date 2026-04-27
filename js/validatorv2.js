function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration time in days
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";domain=.aub.edu.lb;path=/;SameSite=Lax;Secure";
}


function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for(let i = 0; i < cookiesArray.length; i++) {
        let c = cookiesArray[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function selectprogram()
{
	var id=$('.program').val();
	if(id!='')
	{
		$('#Campaign_ID').val(id);
	}
}

function selectcountry()
{
	var id=$('.country').val();
	if(id!='')
	{
		$('#country_code').val(id);
	}
	
}

$(document).ready(function () {


if (localStorage.getItem("ls_first_name") != null)
	 {$('#first_name').val(localStorage.getItem("ls_first_name"));}

	 if (localStorage.getItem("ls_last_name") != null)
	 {$('#last_name').val(localStorage.getItem("ls_last_name"));}

	 if (localStorage.getItem("ls_email") != null)
	 {$('#email').val(localStorage.getItem("ls_email"));}
 
 
    $("form").on('submit', function (event) {
		
        event.preventDefault();
        return false;
    });
    


    jQuery.validator.addMethod("validPhoneNumber", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 && phone_number.match(/^\+(?:[\d\s]*)$/);
    }, "Phone format should include +, Country Code, Area Code, Phone Number as +961 1 350000");
	
	$.validator.addMethod("customemail", 
    function(value, element) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    }, 
    "Incorrect email address"
);


    jQuery.validator.setDefaults({
        success: "valid"
    });

    $("form").validate({
        rules: {
            recordType:
            {
                required: true
            },
            first_name:
            {
                required: true
            },
            last_name:
            {
                required: true
            },
            '00N0Y00000QGklm':
            {
                required: true
            },
            title:
            {
                required: true
            },
            '00N0Y00000QGku0':
            {
                required: true
            },
            country_code:
            {
                required: true
            },
			'program':
            {
                required: true
            },
            '00N0Y00000QGkuK':
            {
                required: true,
                digits: true
            },
            '00N0Y00000QGl8W':
            {
                required: true,
                customemail: true
            },
            '00N0Y00000RODqu':
            {
                required: true,
                validPhoneNumber: true
            },
            '00N0Y00000QGkrV':
            {
                required: true,
            },
            '00N0Y00000QGksE':
            {
                required: true,
            }

        },

        success: function (label) {
           // $('form').attr("action", "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8");
			
        },

        submitHandler: function (form) {

         
			/*var url = 'https://aub.us19.list-manage.com/subscribe/post?u=643f74b5d97f671dfd188d733&amp;id=2724d63912';
			
			*/
			
           // var formData = new FormData('myform');
            var email =  $('#email').val(); //formData.get('00N0Y00000QGl8W');
            //NZ added here
            setCookie('useremail', email, 1);
            var fullName = $('#first_name').val() + ' ' + $('#last_name').val();
            var lastName = $('#last_name').val();
            var prefix = '';
            var honeyPot = 'b_643f74b5d97f671dfd188d733_2724d63912';
            var url= mcurl;
			
			
			
			  localStorage.setItem("ls_first_name", $('#first_name').val());
			  localStorage.setItem("ls_last_name", $('#last_name').val());
			  localStorage.setItem("ls_email", $('#email').val());

	 
	 
			
			if(url=='')
			{
				
				form.submit();
				//GoogleConversion(); 
			}
			else{
            mailchimpSubscribe(url, email, fullName, lastName, prefix, honeyPot, function (err) {
                if (err) {
                    var errorEl = document.createElement('em');
                    errorEl.className = 'error error-block';
                    errorEl.innerText = 'Failed to submit form to MailChimp, kindly contact us for support. (' + error.message + ')';
                    form.insertAdjacentElement('beforeend', errorEl);
                    return;
                }
				
                
                else{

                    setTimeout(function(){ form.submit();}, 600);

                }
                
            });
			
            }
           
           
         
         
			
        },
        
        errorElement: "em",
        errorPlacement: function (error, element) {

            // Add the `help-block` class to the error element
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