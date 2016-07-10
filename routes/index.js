var express = require('express');
var router = express.Router();
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// app.get('/', function(req, res) {
//     res.render('comingsoon', { layout: null });
// });

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

router.get('/services', function(req, res) {
    res.render('services');
});

router.get('/pricing', function(req, res) {
    res.render('pricing');
});

router.get('/payment', function(req, res) {
    res.render('payment');
});

router.post('/charge', function(req, res,next) {
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