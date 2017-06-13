// Written by Daniel Kovalevich
// Purpose: Learn more about Watson
// Last Edit: 06/06/17

var express = require('express');
var fileRender = require('ejs').renderFile;
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
// Mongoose helps organize the data for mongodb
var mongoose = require('mongoose');
// Used to encrypt passwords
// -- able to withstand bruteforce and rainbow table
var bcrypt = require('bcrypt');

// salt needed for encryption
var SALT_WORK_FACTOR = 10;
var question;
var path = __dirname + '/public/';
var app = express();

app.engine('html', fileRender);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));

// Checks if user is logged in (Not yet implemented)
app.use(function (req,res,next) {
    next();
});

// Loads up all the pages and such
app.use(express.static(path));
// application/json parser
var jsonParser = bodyParser.json();


app.listen(8080, () => console.log('Listening on http://localhost:8080/'));
//-----------------------------------Methods-----------------------------------//
// Used to receive data from client
app.post('/', jsonParser, function(req, res) {
    console.log(req.body.title);
    question = req.body.title;
    res.send('Server received question');
});

// Used to send data to client
app.get('/data1', function(req, res) {
    Watson(res, question);
});
//--------------------------------End of Methods-----------------------------//
//-----------------------Database Manipulation-----------------------------//
// note to self: use net start MongoDB to start database server

mongoose.connect("mongodb://localhost:27017/data");
var db = mongoose.connection;
db.once('open', () => console.log("Connected to Database"));
db.on('error', (err) => console.log("Database Error: " + err));

var Schema = mongoose.Schema;
var user = new Schema({
    username:String,
    password:String,
    email:String,
    first_name:String,
    last_name:String,
    major: {
        type:String,
        lowercase: true
    }
});
var User = mongoose.model('user', user);

// hashes the password asynchronously before saving
user.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});
//--------------------------End of Database Manipulation-------------------//
//-------------------------------- Handling Errors --------------------------------------------//
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
//----------------------------------- End of Handling Errors -----------------------------------//
//--------------------------------------- Watson Services --------------------------------------//
// Kick off function
function Watson(res, question) {
    // Separated functions because they contain keys
    var watson = require('./watson');
    /*
    // Natural language breaks up the question into keywords to puts into retrieve and rank
    watson.naturalLanguageProcessing(question, (keyword) => {
        watson.retrieveRank(keyword, (response) => res.send(response),
        () => res.send('Hmmmm. I don\'t see to have the documents to answer that.'));
    }, () => res.send('I\'m sorry. Can you please rephrase the question? I\'m still learning.'));
    */

    watson.retrieveRank(question, (response) => res.send(response),
    () => res.send('Hmmmm. I don\'t see to have the documents to answer that.<br>'));

};
//-----------------------------------End of Watson Services --------------------------------------//