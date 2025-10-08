import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialCart = (location && location.state && location.state.cart) || [];
    const [cart, setCart] = useState(initialCart);
    
    const total = cart.reduce((sum, item) => sum + (item.product?.price ?? item.price ?? 0), 0);

    function continueShopping() {
        navigate('/App');
    }

    function removeItem(itemId) {
        setCart(prev => prev.filter(i => String(i.product?._id || i._id || i.id) !== String(itemId)));
    }

    return (
        <>
        <header>
            <h1>My Cart</h1>
            <button onClick={() => continueShopping()}>Continue Shopping</button>
        </header>
        <main className='checkout-main'>
            <div className='checkout-grid'>
                {cart.map(item => (
                    <div key={item._id || item.id } className="checkout-card">
                    <img className="checkout-image" src={(item.product?.images && item.product.images[0]) || 'https://via.placeholder.com/300'} alt={item.product?.name || item.name} />
                    <h3>{item.product?.name || item.name}</h3>
                    <p>${item.product?.price || item.price}</p>
                    <img className="remove-icon" onClick={() => removeItem(item.product?._id || item._id || item.id)} src='https://cdn-icons-png.flaticon.com/512/1828/1828778.png' alt='remove icon' />
                    </div>
                ))}
            </div>
            <div className="checkout-summary">
                <p>Total: ${total}</p>
                <button>Checkout</button>
            </div>
        </main>
        </>
    )
}

export default Checkout;