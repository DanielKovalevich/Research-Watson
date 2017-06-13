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

    if (minutes < 10)
        minutes = '0' + minutes;

    if (hour > 12)
        time = hour - 12 + ':' + minutes + 'pm';
    else
        time = hour + ':' + minutes + 'am';
    
    month = months[month];

    // Formatting the date
    if (day == 1 || day == 21)
        day = day + 'st';
    else if (day == 2 || day == 22)
        day = day + 'nd';
    else if (day == 3 || day == 23)
        day = day + 'rd';
    else
        day = day + 'th';

    return day + ' of ' + month + ' at ' + time;
}

//Just to condense the append functions
var htmlBefore = '<li class="media"><div class="media-body"><div class="media"><div class="pull-left"><img class="media-object img-circle " src="icons/user.svg" width="50" height="50"></div><div class="media-body">';
var htmlWBefore = '<li class="media"><div class="media-body"><div class="media"><div class="pull-left"><img class="media-object img-circle " src="icons/watson.png" width="50" height="50"></div><div class="media-body">'
var htmlAfter = '</small></div></div></div></li><hr>';

// This adds the user input to the chat and sends it to server for response
function addUserChat() {
    var question = {};
    question.title = $('#question').val();
    var date = getDateAndTime();

    // Regex checks if the string sent isn't only spaces
    if (/\S/.test(question.title)) {
        $('#chat').append(htmlBefore + question.title + '<br><small class="text-muted">You | ' + getDateAndTime() + htmlAfter);

        sendServerQuestion(question);
        getDataFromServer();
    }
    // Clears value in input field
    $('#question').val('');
}

//--------------------------------------------------- Sending / Receiving Data --------------------------------------------------------------------//

function sendServerQuestion(question) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/',
        data: question,
        success: function (data) {
            console.log(data);
            // scrolls to the bottom of the chat
            $('.current-chat-area').animate({scrollTop: $(".scroll-chat").height()});
        },  
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}

function getDataFromServer() {
    $.ajax({
        url: "data1",
        type: "get",
        // Manipulate data here.
        success: function(data) {
            console.log(data);
            $('#chat').append(htmlWBefore + data + '<small class="text-muted">Watson | ' + getDateAndTime() + htmlAfter);
            // scrolls to the bottom of the chat
            $('.current-chat-area').animate({scrollTop: $(".scroll-chat").height()});
        },
        error: function (req, text_status, error) {
            console.log('Error: ' + error.message);
        }
    });
}