import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!pk) console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY');
const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialCart = (location?.state?.cart) ?? (() => {
        try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch {return []; }
    })();

    const [cart, setCart] = useState(initialCart);

    useEffect(() => {
        if(cart.length == 0) {
            continueShopping();
        }
    })
    
    const total = cart.reduce((sum, item) => {
        const price = Number(item.product?.price || item.price || 0);
        return sum + price;
    }, 0);

    function continueShopping() {
        navigate('/App', { state: { cart } });
    }

    function removeItem(itemId) {
        setCart(prev => prev.filter(i => String(i.product?._id || i._id || i.id) !== String(itemId)));
    }

    async function handleCheckout() {
        try {
            const email = localStorage.getItem('userEmail') || 'guest@example.com';
            console.log('Cart structure: ', cart);
            console.log('First item:', cart[0]);

            const items = cart.map(i => {
                const productId = i.product?._id || i._id || i.id || i.product?.id;
                console.log('Item: ', i);
                console.log('Extracted productId: ', productId);

                if (!productId) {
                    console.error('No product ID found for item: ', i);
                }
                return {
                    productId: String(productId),
                };
            });

            const validItems = items.filter(i => i.productId && i.productId !== 'undefined');

            if (validItems.length === 0) {
                alert('Cart items are missing product IDs.');
                return;
            }

            console.log('Sending checkout request:', { email, items: validItems });

            const res = await fetch (`${API_URL}/checkout/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ email, items }),
            });

            const data = await res.json();
            console.log('Response: ', { status: res.status, data });

            if (!res.ok) {
                console.error('Checkout failed: ', data);
                alert(data?.message || 'Checkout failed');
                return;
            }

            if (data.url) {
                console.log('Redirecting to Stripe');
                window.location.href = data.url;
            } else {
                console.error('No URL in response');
                alert('Checkout failed: No redirect URL');
            }

        } catch (err) {
            console.error('Checkout error:', err);
            alert('Checkout error' + err.message);
        }
    }

    return (
        <>
        <header>
            <h1>My Cart</h1>
        </header>
        <main className='checkout-main'>
            <div className='checkout-grid'>
                {cart.map((item, idx) => (
                    <div
                        key={`${item.product?._id || item._id || item.id || 'item'}-${idx}`}
                        className="checkout-card"
                    >
                    <img className="checkout-image" src={(item.product?.images && item.product.images[0]) || 'https://via.placeholder.com/300'} alt={item.product?.name || item.name} />
                    <h3>{item.product?.name || item.name}</h3>
                    <p>${item.product?.price || item.price}</p>
                    <img className="remove-icon" onClick={() => removeItem(item.product?._id || item._id || item.id)} src='https://cdn-icons-png.flaticon.com/512/1828/1828778.png' alt='remove icon' />
                    </div>
                ))}
            </div>
            <div className="checkout-summary">
                <p>Total: ${total}</p>
                <div className="buttons">
                    <button onClick={() => continueShopping()}>Continue Shopping</button>
                    <button onClick={() => handleCheckout()}>Checkout with Stripe</button>
                </div>
            </div>
        </main>
        </>
    )
}

export default Checkout;