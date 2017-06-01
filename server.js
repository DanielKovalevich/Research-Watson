// Written by Daniel Kovalevich
// Purpose: Learn more about Watson
// Last Edit: 05/30/17

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
function Watson(res, question){
    WatsonNaturalLanguageProcessing(question, (keyword) => {
        WatsonRetrieveRank(keyword, (response) => res.send(response));
    }, () => res.send('I\'m sorry. Can you please rephrase the question? I\'m still learning.'));

    
};
    

function WatsonCoversation() {
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
}

function WatsonNaturalLanguageProcessing(question, callback, errorCallback) {
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': '00a62a36-a58a-492a-a052-85d7d779e83d',
    'password': '56SBGoYmsCKD',
    'version_date': '2017-02-27'
    });

    // EXAMPLE TEST
    var parameters = {
        'text': question,
        'features': {
            'keywords': {
                'sentiment': false,
                'limit': 5
            }
        }
    };


    natural_language_understanding.analyze(parameters, function(err, response) {
    if (err) {
        console.log('error:', err);
        errorCallback(err);
    }
    else{
        // Combine all returned keywords from questions in order to send to the Retrieve and Rank function
        var retrievedKeywords;
        console.log(response.keywords);
        for (var i in response.keywords) {
            retrievedKeywords = retrievedKeywords != undefined ? retrievedKeywords + ' ' + response.keywords[i].text : response.keywords[i].text;
        }
        console.log(retrievedKeywords);
        callback(response.keywords[0].text);
    }
    });
}

function WatsonRetrieveRank(question, callback) {
    var watson = require('watson-developer-cloud');
    var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
    var retrieve_and_rank = watson.retrieve_and_rank({
        username: '1368f41a-0119-40dc-8428-2b3cb4edae99',
        password: 'WrX74uZ2Asmc',
        version: 'v1'
    });

    var solrClient = retrieve_and_rank.createSolrClient({
        cluster_id: 'sc514d7838_1d1d_4381_85d8_46c010e76be2',
        collection_name: 'Research'
    });

    console.log('Searching all documents.');
    var query = solrClient.createQuery();
    query.q({ 'body' : question });

    solrClient.search(query, function(err, searchResponse) {
    if(err) {
        console.log('Error searching for documents: ' + err);
    }
        else {
        console.log('Found ' + searchResponse.response.numFound + ' documents.');
        //console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0], null, 2));
        var jsonResponse = searchResponse.response.docs[0];
        console.log(jsonResponse);
        jsonResponse = jsonResponse['title'] + ' ' + jsonResponse['contentHtml'];
        callback(jsonResponse);
        }
    });


}