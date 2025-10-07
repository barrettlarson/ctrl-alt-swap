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
            { name: 'Mechanical Keyboard', price: 59.99, images: ['https://m.media-amazon.com/images/I/61P7MvyRbUL.jpg'], condition: 'new', category: 'keyboards'},
            { name: 'HyperX Mouse', price: 39.99, images: ['https://row.hyperx.com/cdn/shop/products/hyperx_pulsefire_raid_2_angled_back.jpg?v=1662435267'], category: 'mice', condition: 'new' },
            { name: '27" 4K Monitor', price: 329.99, images: ['https://datavision.com/cdn/shop/files/CLARITY27inchUHD4KMonitor_1_ba2de81a-c00e-43f5-9fb3-69999b0280a8.png?v=1701376056'], category: 'monitors', condition: 'new' },
            { name: '16GB DDR4 RAM', price: 79.99, images: ['https://m.media-amazon.com/images/I/51VO7toQIyL.jpg'], category: 'ram', condition: 'new' },
            { name: '1TB NVMe SSD', price: 119.99, images: ['https://webobjects2.cdw.com/is/image/CDW/7068398?$product-main$'], category: 'storage', condition: 'new' },
            { name: 'NVIDIA RTX 3060', price: 399.99, images: ['https://m.media-amazon.com/images/I/61jN35sc4jS._UF894,1000_QL80_.jpg'], category: 'gpu', condition: 'new' },
            { name: 'AMD Ryzen 5 5600X', price: 199.99, images: ['https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/amd_100_100000065box_ryzen_5_5600x_3_7_1604533549_1598377.jpg'], category: 'cpu', condition: 'new' },
            { name: '750W Power Supply', price: 89.99, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKL76AAJvL5-VpTk3kRrZ_rx--DqGf17V3YQ&s'], category: 'power supply', condition: 'new' },
            { name: 'CPU Cooler', price: 49.99, images: ['https://thermaltakeusa.com/cdn/shop/files/cl-p117-ca14bl-a_01.jpg?v=1691181757'], category: 'cooling', condition: 'new' },
            { name: 'PC Case', price: 99.99, images: ['https://cdn.mos.cms.futurecdn.net/uXngTqwS7CS3FSi675TJwG.jpg'], category: 'cases', condition: 'new' },
            { name: 'Keycap Set', price: 29.99, images: ['https://i5.walmartimages.com/seo/PBT-keycaps-MOA-Profile-Cute-Keycaps-Set-Double-Shot-75-Percent-Key-Puller-Cherry-Gateron-MX-Switches-Mechanical-Gaming-Keyboard-only-keycap-Dark-Lig_9529960e-6d2f-42d3-8726-dac603619855.efe5eefdb6712cc0e8081edbc46c7881.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF'], category: 'keycaps', condition: 'new' },
            { name: 'Gaming Headset', price: 79.99, images: ['https://assets-prd.ignimgs.com/2021/01/28/corsair-1611868540158.jpg'], category: 'accessories', condition: 'new' },
        ];

    const makeSlug = s => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const prepared = sampleProducts.map((p, i) => {
        const base = makeSlug(p.name || `product-${i}`);
        const uniq = `${base}-${Date.now().toString(36).slice(-4)}-${i}`;
        return {
            name: p.name,
            price: p.price,
            images: p.images && p.images.length ? p.images : [],
            condition: p.condition || 'new',
            category: p.category || 'uncategorized',
            description: p.description || '',
            brand: p.brand || '',
            slug: uniq
        };
    });

    await  Product.deleteMany({});
    const created = await Product.create(prepared);
    console.log('Seed created:', created); 
    return res.status(201).json(created);
    } catch (error) {
        console.error('SEED ERROR:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
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