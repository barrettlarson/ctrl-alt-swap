require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
});

describe('Create Checkout Session', () => {
    it('should create a checkout session', async () => {
        const register = await request(app)
            .post('/auth/register')
            .send({ username: 'testemail@outlook.com', password: 'jesttest123' });

        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }

        const createProduct = await request(app)
            .post('/Product')
            .send(newProduct)
            .expect(201);
        
        const created = createProduct.body;

        const session = await request(app)
            .post('/checkout/create-checkout-session')
            .send({ email: 'testemail@outlook.com', items: [ { productId: String(created._id) }] });
            
        expect(session.statusCode).toBe(200);
        expect(session.body.url).toBeDefined();
    });
});