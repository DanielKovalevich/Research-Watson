// Written by Daniel Kovalevich

// THis is for the collapsible nav bars
$(document).ready(function(){
    $('.collapsible').collapsible();

    $('#send').click(function(){
        addUserChat();
    });
    
    // allows user to just press enter
    $('#question').keypress(function (e) {
        if (e.which == 13) {
            addUserChat();
            return false; //So that page doesn't refresh
        }
    });

    // Update the first Watson message
    $("#Watson-Time").html('Watson | ' + getDateAndTime());
});

//--------------------------------------------- Helper Functions ---------------------------------------------------------------------------
function getDateAndTime() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var time;

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (hour > 12) {
        time = hour - 12 + ':' + minutes + 'pm';
    } 
    else {
        time = hour + ':' + minutes + 'am';
    }
    
    month = months[month];

    // Formatting the date
    if (day == 1 || day == 21) {
        day = day + 'st';
    }
    else if (day == 2 || day == 22) {
        day = day + 'nd';
    }
    else if (day == 3 || day == 23) {
        day = day + 'rd';
    }
    else {
        day = day + 'th';
    }

    return day + ' of ' + month + ' at ' + time;
}

// This adds the user input to the chat
function addUserChat() {
    var question = $('#question').val();
    var date = getDateAndTime();

    // Regex checks if the string sent isn't only spaces
    if (/\S/.test(question)) {
        $('#chat').append('<li class="media"><div class="media-body"><div class="media"><div class="pull-left"><img class="media-object img-circle " src="icons/user.svg" width="50" height="50"></div><div class="media-body">'
            + question + '<br><small class="text-muted">You | ' + getDateAndTime() + '</small></div></div></div></li><hr>'
        );

    $.ajax({
        url: 'http://localhost:8080',
        type: 'POST',
        data: {
            "ques" : question
        },
    });

    // scrolls to the bottom of the chat
    $('.current-chat-area').animate({
        scrollTop: $("#bottom-chat").offset().top});
    
    }

    // Clears value in input field
    $('#question').val('');
}