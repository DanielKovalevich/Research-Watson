// Written by Daniel Kovalevich
// Purpose: Learn more about Watson
// Last Edit: 06/06/17

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var question;
var path = __dirname + '/public/';

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));

// Logs the request methods to the site
app.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

// Loads up all the pages and such
app.use(express.static(path));
// application/json parser
var jsonParser = bodyParser.json();

app.listen(8080, () => console.log('Listening on http://localhost:8080/'));

//-------------------------------Methods---------------------------------//
// Used to receive data from client
app.post('/', jsonParser, function(req, res) {
    console.log(req.body.title);
    question = req.body.title;
    res.send('Server received question');
});

// Used to send data to client
app.get('/data1', async(req, res) => {
    Watson(res, question);
});
//----------------------------------------------------------------------//

//------------------------------ Handling Errors --------------------------------------------//

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/*
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/

//----------------------------------------------------------------------------------------------//

//--------------------------------------- Watson Services --------------------------------------//
// Kick off function
function Watson(res, question) {
    // Separated functions because they contain keys
    var watson = require('./watson');
    // Natural language breaks up the question into keywords to puts into retrieve and rank
    watson.naturalLanguageProcessing(question, (keyword) => {
        watson.retrieveRank(keyword, (response) => res.send(response),
        () => res.send('Hmmmm. I don\'t see to have the documents to answer that.'));
    }, () => res.send('I\'m sorry. Can you please rephrase the question? I\'m still learning.'));

};