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
var app = express();

var path = __dirname + '/public/';

app.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

app.use(express.static(__dirname + '/public'));

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