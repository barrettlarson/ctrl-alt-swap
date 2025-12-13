import './index.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function Product() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const product = state?.product;

    const initialCart = (location?.state?.cart) ?? (() => {
        try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch {return []; }
    })();

    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function continueShopping() {
        navigate('/app', { state: { cart }});
    }

    return (
        <div className="product-page">
            <div className="product-content" onClick={e => e.stopPropagation()}>
                <div className="product-header">
                    <h2>{product.name}</h2>
                    <img className="exit-icon" onClick={() => continueShopping()} src='https://cdn-icons-png.flaticon.com/512/1828/1828778.png' alt='remove icon' />
                    <p>Brand: {product.brand}</p>
                    <p>Description: {product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Category: {product.category}</p>
                    <p>Condition: {product.condition}</p>
                    <img className="product-page-image" src={(product.images && product.images[0]) || 'https://via.placeholder.com/300'} alt={product.name} />

                </div>
            </div>
        </div>
    )
}

export default Product;