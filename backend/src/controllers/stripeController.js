
const stripe = require('stripe')('sk_test_51OJ9ozBnSVSW4jmuipJmrVPUEh96ppWDEatkjZUaxLFrJvdyiAFdckr3jnuCP1718m2oJu02GaXCqq0jwU80hrqE00cgtGedms');

const payment = async(req, res) => {
  const amountInCents = Math.round(parseFloat(req.body.total) * 100);
  console.log('amount -',amountInCents) ;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Books',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://your-website.com/success', // Redirect to success page
      cancel_url: 'http://your-website.com/cancel', // Redirect to cancel page
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Create Checkout Session error:', error.message);
    res.status(500).json({ error: 'Failed to create Checkout Session' });
  }
};



module.exports = {payment};