import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.css'
import Sidebar from './Sidebar';
import { API_URL } from './api'

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
  })();

  const initialCart = location.state?.cart || stored || [];

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(initialCart); 
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    condition: ""
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
      .filter(p => !filters.category || (p.category || "").toLowerCase() === filters.category)
      .filter(p => {
        if (!filters.condition) return true;
        return (p.condition || "").toLowerCase() === filters.condition;
      })
      .filter(p => {
        if (!filters.price) return true;
        const price = Number(p.price);
        if (Number.isNaN(price)) return false;

        if (filters.price === "under50") return price < 50;
        if (filters.price === "50to100") return price >= 50 && price <= 100;
        if (filters.price === "100to200") return price > 100 && price <=200;
        if (filters.price === "over200") return price > 200;
        return true;
      });
  }, [products, search, filters]);

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

  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cart)); }
    catch (e) { console.error('Failed to save cart to localStorage:', e); }
  }, [cart])

  function addToCart(productId) {
    for(let item of cart) {
      if(String(item.productId) === String(productId)) {
        alert('Item already in cart');
        return;
      }
    }
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
      navigate('/checkout', { state: { cart } });
    }

  }

  const navProduct = async (product) => {
    navigate('/product', { state: { product }})
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
      <div className="layout">
        <aside>
          <Sidebar filters={filters} setFilters={setFilters}/>
        </aside>
        <main>
        <div className='product-grid'>
          {filteredProducts
          .map(p => (
            <div key={p._id || p.id } className="product-card" onClick={() => navProduct(p)}>
              <img className="product-image" src={(p.images && p.images[0]) || 'https://via.placeholder.com/300'} alt={p.name} />
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button onClick={(e) => {
                e.stopPropagation();
                addToCart(p._id || p.id)}}
                >Add to Cart</button>
            </div>
        ))}
      </div>
        </main>
      </div>

    </>
  )
}

export default App
