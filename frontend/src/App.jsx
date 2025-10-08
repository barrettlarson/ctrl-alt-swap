import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { API_URL } from './api'

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); 
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/Product`);
        const data = await res.json();
        console.log('products fetch response:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Unexpected products data format:', data);
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      }
    }
    load();
  }, []);

  function addToCart(productId) {
    setCart(prev => {
      const found = prev.find(i => String(i.productId) === String(productId));
      if (found) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      const product = products.find(p => String(p._id) === String(productId) || p.id === productId);
      return [...prev, { productId, quantity: 1, product }];
    });
  }

  const totalCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const checkout = async () => {
    if(!cart.length) return alert('Cart is empty');
    else {
      navigate('/Checkout', { state: { cart } });
    }

  }

  return (
    <>
      <header>
        <h1>CtrlAltSwap!</h1>
        <input className='search-bar' 
          type="text" 
          placeholder="Search for items..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} />
        <div className='cart-and-count'>
          <img className='cart-icon' onClick={checkout} src='https://cdn-icons-png.flaticon.com/512/1170/1170678.png' alt='cart icon' />
          <span className='item-count'>{totalCount}</span>
        </div>
      </header>
      <main>
        <div className='product-grid'>
          {products
          .filter(p=> p.name.toLowerCase().includes(search.toLowerCase()))
          .map(p => (
            <div key={p._id || p.id } className="product-card">
              <img className="product-image" src={(p.images && p.images[0]) || 'https://via.placeholder.com/300'} alt={p.name} />
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button onClick={() => addToCart(p._id || p.id)}>Add to Cart</button>
            </div>
        ))}
      </div>
      </main>

    </>
  )
}

export default App
