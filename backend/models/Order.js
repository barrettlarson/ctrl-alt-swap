const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, {_id: false});

const addressSchema = new mongoose.Schema({
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
}, {_id: false});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    items: { type: [orderItemSchema], required: true },
    amount: { type: Number, required: true },
    shippingAddress: { type: addressSchema,
        required: function () {
            return this.status === 'paid' || this.status === 'shipped' || this.status === 'delivered';
        }
    },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending' },
    stripeSessionId: { type: String },
    paymentIntentId: { type: String },
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);