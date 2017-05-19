/*var app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs'),
    url = require('url');

app.listen(8080, '127.0.0.1');

function handler (req, res) {
    if(req.url.indexOf('.html') != -1) { //req.url has the pathname, check if it conatins '.html'
        fs.readFile(__dirname + '/public/index.html',
        function (err, data) {
            if (err) {
            res.writeHead(500);
            console.log('Something went wrong with rendering the page!');
            return res.end('Error loading index.html');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }

    if(req.url.indexOf('.css') != -1) { //req.url has the pathname, check if it conatins '.css'
        fs.readFile(__dirname + '/public/css/style.css', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });

    }
}

console.log('Server is now running at http://127.0.0.1:8080/');*/

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var question;

var path = __dirname + '/public/';


app.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});
app.use(express.static(path));

app.post('/', function(req, res) {
    question = req.body.ques;
    console.log(question);

    res.send('Server received question');
});

app.get('/', function(req, res) {
    
});

app.listen(8080, () => console.log('Listening on http://localhost:8080/'));

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
/*
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
  username: 'ba66d105-29a9-4e3a-b53b-2c5140e07697',
  password: 'dWLyDwMWO0Jr',
  version_date: ConversationV1.VERSION_DATE_2017_04_21
});

conversation.message({
  input: { text: 'What\'s the weather?' },
  workspace_id: '383c5555-35d0-43e2-bb9b-a74f2e805aac'
 }, function(err, response) {
     if (err) {
       console.error(err);
     } else {
       console.log(JSON.stringify(response, null, 2));
     }
});
*/