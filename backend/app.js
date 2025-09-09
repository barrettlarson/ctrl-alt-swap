const express = require('express');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const stripeWebHookRoutes = require('./routes/stripeWebHookRoutes');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
]

const cors = require('cors');

app.use(cors({
    origin(origin, cb) {
        if (!origin) return cb(null, true);
        return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use('/webhook', stripeWebHookRoutes);
app.use(express.json());

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use('/auth', authRoutes);
app.use('/Product', productRoutes);
app.use('/checkout', checkoutRoutes);


app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app
