const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products || products.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const prod = await Product.findById(req.params.id);
        if (!prod) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(prod); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, condition, category, images, brand, slug } = req.body;

        if (!name || !price || !category || !images || images.length === 0) {
            return res.status(400).json({ message: 'Name, price, and category, and images are required.' });
        }

        const priceNum = Number(price);
        if (Number.isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({ message: 'Price must be a positive number.' });
        }

        const makeSlug = s => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const finalSlug = slug && typeof slug === 'string' ? slug : makeSlug(name);

        const newProduct = await Product.create({
            name,
            slug: finalSlug,
            images: images || [],
            brand: brand || '',
            description: description || '',
            price: priceNum,
            condition: condition || '',
            category
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeProduct = async (req, res) => {
    try {
        const found = await Product.findById(req.params.id);
        if (!found) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const allowed = ['name', 'description', 'price', 'condition', 'category', 'images', 'brand', 'slug'];
        const updates = {};
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) updates[key] = req.body[key];
        }

        if (updates.price !== undefined) {
            const priceNum = Number(updates.price);
            if (Number.isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({ message: 'Price must be a positive number.' });
            }
            updates.price = priceNum;
        }

        if (updates.name && !updates.slug) {
            updates.slug = updates.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const seedProducts = async (req, res) => {
    try {
        const sampleProducts = [
            { name: 'Mechanical Keyboard', price: 59.99, images: ['https://i.pcmag.com/imagery/roundups/02th3QKnG4NLgUrOSBe1cfh-30.fit_lim.size_1050x.jpg'], condition: 'new', category: 'keyboards', condition: 'new' },
            { name: 'HyperX Mouse', price: 39.99, images: ['https://row.hyperx.com/cdn/shop/products/hyperx_pulsefire_raid_2_angled_back.jpg?v=1662435267'], category: 'mice', condition: 'new' },
        ];

    const makeSlug = s => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const prepared = sampleProducts.map((p, i) => {
        const base = makeSlug(p.name || `product-${i}`);
        const uniq = `${base}-${Date.now().toString(36).slice(-4)}-${i}`;
        return {
            name: p.name,
            price: p.price,
            images: p.images || [],
            condition: p.condition || '',
            category: p.category || 'uncategorized',
            description: p.description || '',
            brand: p.brand || '',
            slug: uniq
        };
    });

    await  Product.deleteMany({});
    const created = await Product.insertMany(prepared);
    return res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    removeProduct,
    updateProduct,
    seedProducts
};