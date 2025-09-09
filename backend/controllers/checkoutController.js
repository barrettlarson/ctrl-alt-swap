const Stripe = require('stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');


const createCheckoutSession = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { email, items } = req.body;
        if (!email || !items || !Array.isArray(items) || items.length === 0) {
            console.log('Invalid request body:', req.body);
            return res.status(400).json({ message: 'Email and items are required.' });
        }

        const ids = [...new Set(items.map(i => i.productId))];
        const products = await Product.find({ _id: { $in: ids } });

        if (products.length !== ids.length) {
            const foundIds = new Set(products.map(p => String(p._id)));
            const missing = ids.filter(id => !foundIds.has(String(id)));
            console.log('Some products not found:', missing);
            return res.status(400).json({ message: 'One or more products not found.' });
        }

        const lineItems = products.map(p => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: p.name,
                    images: p.images?.slice(0, 1) || [] },
                    unit_amount: Math.round(p.price * 100),
            },
            quantity: 1,
        }));

        const amount = lineItems.reduce((sum, li) => sum + li.price_data.unit_amount, 0);

        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: email,
            line_items: lineItems,
            success_url: `${CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/cart`,
            shipping_address_collection: { allowed_countries: ['US', 'CA'] },
            metadata: {
                cart: JSON.stringify(items)
            }
        });

        await Order.create({
            email, 
            items: products.map(p => {
                const it = items.find(i => String(i.productId) === String(p._id));
                return {
                    productId: p._id,
                    title: p.name,
                    price: Number(p.price),
                    image: p.images?.[0]
                };
            }),
            amount,
            currency: 'usd',
            status: 'pending',
            stripeSessionId: session.id
        });

        return res.json({ url: session.url });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(400).json({ message: 'Checkout error' });
    }
};

module.exports = {
    createCheckoutSession
};