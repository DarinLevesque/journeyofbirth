var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PHPFPM = require('node-phpfpm');
var fortune = require('./lib/fortune.js');

// *** Allow PHP *** //
var phpfpm = new PHPFPM(
{
    host: '127.0.0.1',
    port: 9000,
    documentRoot: __dirname
});

// *** sendgrid test *** //
var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

// function helloTemplate(){
//   var helper = require('sendgrid').mail

//   from_email = new helper.Email("kelli@journeyofbirth.com")
//   to_email = new helper.Email("darinlevesque@gmail.com")
//   subject = "Hello World from the SendGrid Node.js Library"
//   content = new helper.Content("text/plain", "some text here")
//   mail = new helper.Mail(from_email, subject, to_email, content)
//   // The constructor above already creates our personalization object
//   // -name- and -card- are substitutions in my template
//   substitution = new helper.Substitution("-name-", "Example User")
//   mail.personalizations[0].addSubstitution(substitution)
//   substitution = new helper.Substitution("-card-", "Denver")
//   mail.personalizations[0].addSubstitution(substitution)
//   mail.setTemplateId("1f70cb4b-769e-4391-ae30-38e6e69cebe8")
//   return mail.toJSON()
// }

// function send(toSend){
//   //console.log(JSON.stringify(toSend, null, 2))
//   //console.log(JSON.stringify(toSend))

//   var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

//   var requestBody = toSend
//   var emptyRequest = require('sendgrid-rest').request
//   var requestPost = JSON.parse(JSON.stringify(emptyRequest))
//   requestPost.method = 'POST'
//   requestPost.path = '/v3/mail/send'
//   requestPost.body = requestBody
//   sg.API(requestPost, function (response) {
//     console.log(response.statusCode)
//     console.log(response.body)
//     console.log(response.headers)
//   })
// }

// send(helloTemplate())

// *** routes *** //
var routes = require('./routes/index.js');

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({
        defaultLayout: 'main'
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Assign Port
app.set('port', process.env.PORT || 3000);

// remove header venurability
app.disable('x-powered-by');

// set static folder
app.use(express.static(__dirname + '/public'));

// ignore tests in production
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

switch (app.get('env')) {
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        break;
}


// routes go here....
app.use('/', routes);
// app.get('/', function(req, res) {
//     res.render('comingsoon', { layout: null });
// });


// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// start node server
app.listen(app.get('port'), function() {
    console.log('Express started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.');
});
