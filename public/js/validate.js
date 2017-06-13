// Written by Daniel Kovalevich

$(document).ready(function () {
    $('#signup-form').validate({ // initialize the plugin
        // makes sure it validates without submitting
        onsubmit: false,
        rules: {
            first_name: "required",
            last_name: "required",
            major: "required",
            username: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6,

            },
            passwordConfirm: {
                required: true,
                minlength: 6,
                equalTo: "#password"
            },
            rememberMe: {

            }
        },
        messages: {
            first_name: "Please enter you first name",
            last_name: "Please enter you last name",
            major: "Please enter in a Major",
            username: "The username helps us distinguish you",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long"
            },
            passwordConfirm: {
                required: "Please provide a password",
                equalTo: "Please enter the same password as above",
            }
        },
        errorElement: "em",
        errorPlacement: function(error, element) {
            // Add the `help-block` class to the error element
            error.addClass('help-block');
            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function(element, errorClass, validClass) {
            $(element).parents('.col-md-6').addClass('has-error').removeClass('has-success');
            $(element).parents('.col-md-12').addClass('has-error').removeClass('has-success');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).parents('.col-md-6').addClass('has-success').removeClass('has-error');
            $(element).parents('.col-md-12').addClass('has-success').removeClass('has-error');
        }
        /*
        submitHandler: function(form) {
            $('#signup-form').ajaxSubmit();
        }*/
    });

});

