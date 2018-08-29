const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
  app.post('/api/stripe', requireLogin, async(req, res) => {
    console.log('req.body:', req.body);
    if (!req.user) {
      return res.status(401).send({error: 'You must log in!'});
    }
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 email credits',
      source:req.body.id
    });
    console.log('chargge: ', charge);
    req.user.credits +=1;
    const user = await req.user.save();
    res.send(user);
  });
}
