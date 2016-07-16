var express = require('express');
var router = express.Router();
// var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// app.get('/', function(req, res) {
//     res.render('comingsoon', { layout: null });
// });

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/services', function(req, res) {
    res.render('services');
});

router.get('/pricing', function(req, res) {
    res.render('pricing', {layout: 'pricing'});
});

router.get('/contact', function(req, res) {
    res.render('contact');
});

router.post('/contact', function(req, res) {
var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

function helloTemplate(){
  var helper = require('sendgrid').mail

  from_email = new helper.Email("Kelli@journeyofbirth.com")
  to_email = new helper.Email("info@pkcphotography.com")
  subject = "Hello World from the SendGrid Node.js Library"
  content = new helper.Content("text/plain", "some text here")
  mail = new helper.Mail(from_email, subject, to_email, content)
  // The constructor above already creates our personalization object
  // -name- and -card- are substitutions in my template
  substitution = new helper.Substitution("Sender_Name", "Example User")
  mail.personalizations[0].addSubstitution(substitution)
  substitution = new helper.Substitution("-card-", "Denver")
  mail.personalizations[0].addSubstitution(substitution)
  mail.setTemplateId("1f70cb4b-769e-4391-ae30-38e6e69cebe8")
  return mail.toJSON()
}

function send(toSend){
  //console.log(JSON.stringify(toSend, null, 2))
  //console.log(JSON.stringify(toSend))

  var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

  var requestBody = toSend
  var emptyRequest = require('sendgrid-rest').request
  var requestPost = JSON.parse(JSON.stringify(emptyRequest))
  requestPost.method = 'POST'
  requestPost.path = '/v3/mail/send'
  requestPost.body = requestBody
  sg.API(requestPost, function (response) {
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  })
}

send(helloTemplate())
});

router.get('/payment', function(req, res) {
    res.render('payment');
});

router.post('/charge', function(req, res, next) {
    var stripeToken = req.body.stripeToken;
    var amount = req.body.price * 100;

    // ensure amount === actual product amount to avoid fraud

    stripe.charges.create({
            card: stripeToken,
            currency: 'usd',
            amount: amount
        },
        function(err, charge) {
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                res.send('success');
            }
        });
});

// router.post('/payment', function(req, res) {
//     var stripeToken = request.body.stripeToken;

//     var charge = stripe.charges.create({
//         amount: 1000, // amount in cents, again
//         currency: "usd",
//         source: stripeToken,
//         description: "Example charge"
//     }, function(err, charge) {
//         if (err && err.type === 'StripeCardError') {
//             // The card has been declined
//         }
//     });
//     res.render('success');

// });

module.exports = router;
