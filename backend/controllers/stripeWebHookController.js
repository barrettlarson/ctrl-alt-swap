const Stripe = require('stripe');
const Order = require('../models/Order');

const webhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummykey');
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const order = await Order.findOneAndUpdate(
        {stripeSessionId: session.id},
        {
            status: 'paid',
            paymentIntentId: session.payment_intent,
            email: session.customer_details?.email || session.customer_email,
            shippingAddress: {
                name: session.customer_details?.name,
                line1: session.customer_details?.address?.line1,
                line2: session.customer_details?.address?.line2,
                city: session.customer_details?.address?.city,
                state: session.customer_details?.address?.state,
                postal_code: session.customer_details?.address?.postal_code,
                country: session.customer_details?.address?.country,
            }
        }, 
        {new: true}
        );

        if (order && Array.isArray(order.items)) {
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId , available: false },
                    { $set: { available: false } }
                )
            }
        }
    }
    res.json({ received: true });
};

module.exports = { webhook };