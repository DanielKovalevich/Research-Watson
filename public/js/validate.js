// Written by Daniel Kovalevich

$(document).ready(function () {

    $('#signup-form').validate({ // initialize the plugin
        rules: {
            first_name: {
                required: true,

            },
            last_name: {
                required: true,
            },
            major: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
            field2: {
                required: true,
                minlength: 5
            }
        },
        submitHandler: function(form) {
            $('#signup-form').ajaxSubmit();
        }
    });

});

