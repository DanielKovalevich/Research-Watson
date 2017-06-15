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
// store users sessions
var session = require('express-session');

// salt needed for encryption
var SALT_WORK_FACTOR = 10;
var question;
var path = __dirname + '/public/';
var app = express();

app.engine('html', fileRender);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret:'unknown',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

// checks if user is logged in and redirects
app.use(function (req,res,next) {
    if (req.url === '/' && req.session.userid != null) {
        res.redirect('/loggedIn.html');
    }
    else {
        next();
    }
});

// Loads up all the pages and such
app.use(express.static(path));
// application/json parser
var jsonParser = bodyParser.json();


app.listen(8080, () => console.log('Listening on http://localhost:8080/'));
//-----------------------------------Methods-----------------------------------//
// Used to receive data from client
app.post('/', jsonParser, function(req, res) {
    question = req.body.title;
    res.send('Server received question');
});

app.post('/loggedIn', jsonParser, function(req, res) {
    console.log(req.body.title);
    question = req.body.title;
    res.send('Server received question');
});

// Used to send data to client
app.get('/data1', function(req, res) {
    Watson(req, res, question);
});

app.get('/logout', function (req, res) {
    req.session.userid = null;
    req.session.username = null;
    // this causes some issues so I need to reset the question
    question = null;
    console.log('logged out');
    res.redirect('/');
});

app.get('/getSession', function(req, res) {
    if (req.session.userid) {
        // verify that username matches the id
        User.findOne({'username': req.session.username }, function(err, person) {
            var obj = {
                name: person.first_name,
                lname: person.last_name,
                major: person.major
            };
            res.send(obj);
        });
    }
    else {
        res.send(null);
    }
});
//--------------------------------End of Methods-----------------------------//
//-----------------------Database Manipulation-----------------------------//
// note to self: use net start MongoDB to start database server

mongoose.connect("mongodb://localhost:27017/data");
var db = mongoose.connection;
db.once('open', () => console.log("Connected to Database"));
db.on('error', (err) => console.log("Database Connection Error"));

// creates a model for all the users in database
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    first_name: String,
    last_name: String,
    major: {
        type:String,
        lowercase: true
    }
});

// hashes the password asynchronously before saving
UserSchema.pre('save', function(next) {
    console.log('encrypting password ...')
    var user = this;
    // only hash password if it has been modified or is new
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

// Allows verification of password with the schema
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);

// checks the database for the same username
app.post('/validateUsername', function(req, res) {
    var username = req.body.username;
    User.findOne({'username': username }, function(err, person) {
        res.send(person === null);
    });
});

app.post('/register', function(req, res) {
    // verify once again that the passwords are the same.
    if (req.body.password != req.body.passwordConfirm) res.redirect('/signup.html');
    var newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        major: req.body.major,
        username: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err) {
        if (err) throw (err);
        console.log('User registered');
        req.session.userid = newUser._id
        req.session.username = newUser.username;
        res.redirect('/loggedIn.html');
    });
});

app.post('/login', function(req, res) {
    // this causes some issues so I need to reset the question
    question = null;
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) 
            throw err;
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) 
                throw err;

            if (isMatch) {
                req.session.userid = user._id;
                req.session.username = user.username;
                console.log(req.session);
                res.redirect('/loggedIn.html');
            }
            else {
                res.send('Bad login request!');
            }
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
        /*
        res.render('error', {
            message: err.message,
            error: err
        });
        */
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
function Watson(req, res, question) {
    // Separated functions because they contain keys
    var watson = require('./watson');
    /*
    // Natural language breaks up the question into keywords to puts into retrieve and rank
    watson.naturalLanguageProcessing(question, (keyword) => {
        watson.retrieveRank(keyword, (response) => res.send(response),
        () => res.send('Hmmmm. I don\'t see to have the documents to answer that.'));
    }, () => res.send('I\'m sorry. Can you please rephrase the question? I\'m still learning.'));
    */

    


    if (req.session.userid == null) {
        watson.retrieveRank(question, (response) => res.send(response),
        () => res.send('Hmmmm. I don\'t see to have the documents to answer that.<br>'));
    }
    // it first checks if user is trying to have a conversation. If I don't have the conversation
    // module created with the conversation API, it looks for it in the documents. If it can't find anything, it will send back error
    // from a list in the conversation API.
    else {
        
        watson.conversation(question, (response) => {
            if (response) 
                res.send(response + '<br>');
            else {
                watson.retrieveRank(question, (response) => res.send(response),
                () => watson.conversation('error', (response) => res.send(response + '<br>')));
            }
        });
    }
};
//-----------------------------------End of Watson Services --------------------------------------//