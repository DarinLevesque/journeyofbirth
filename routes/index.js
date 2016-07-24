var express = require('express');
var router = express.Router();
var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);
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
    var request = sg.emptyRequest()
    request.body = {
        "personalizations": [{
            "to": [{
                "email": "kelli@journeyofbirth.com"
            }],
            "subject": "JoB Contact Form: " + req.body.subject
        }],
        "from": {
            "email": req.body.email,
        },
        "content": [{
            "type": "text/plain",
            "value": req.body.name + " " + req.body.phone + " " + "Services interested in: " + req.body.service + " " + req.body.comments
        }]
    };
    request.method = 'POST'
    request.path = '/v3/mail/send'
    sg.API(request, function(response) {
        console.log(response.statusCode)
        console.log(response.body)
        console.log(response.headers)
        res.message_success("Email Sent Successfully")
        res.end("Email Sent Successfully");
        
    })
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
