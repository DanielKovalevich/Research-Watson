// Written by Daniel Kovalevich

$(document).ready(function () {
    $('#signup-form').validate({ // initialize the plugin
        // makes sure it validates without submitting
        onsubmit: false,
        rules: {
            first_name: {
                required: true,
                lettersonly: true
            },
            last_name: {
                required: true,
                lettersonly: true
            },
            major: {
                required: true
            },
            username: {
                required: true,
                alphanumeric: true,
                minlength: 3,
                remote: {
                    url:'validateUsername',
                    type: 'post'
                }
            },
            password: {
                required: true,
                minlength: 6,

            },
            passwordConfirm: {
                required: true,
                equalTo: '#password'
            },
            rememberMe: {
                required: false
            }
        },
        // displays these messages when error come up
        messages: {
            first_name: {
                required: 'Please enter you first name',
                lettersonly: 'I don\'t believe your name contains letters'
            },
            last_name: {
                required: 'Please enter you last name',
                lettersonly: 'I don\'t believe your name contains letters'
            },
            major: {
                required: 'Please enter in a major',
            },
            username: {
                required: 'The username helps us distinguish you',
                alphanumeric: 'No special characters allowed',
                remote: 'Sorry that username is already taken',
                minlength: 'Your username needs to be at least three characters',
            },
            password: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 6 characters long'
            },
            passwordConfirm: {
                required: 'Please provide a password',
                equalTo: 'Please enter the same password as above',
            }
        },
        errorElement:'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

});

