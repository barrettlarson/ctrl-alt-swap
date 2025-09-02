import { useState } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <nav className="top-nav">
      <h1>CtrlAltSwap!</h1>
      <input type="text" placeholder="Search for items..." />
      <p>Likes</p>
      <p>Cart</p>
      <p>Sell now</p>
    </nav>
    <nav className="bottom-nav">
      <p>Parts</p>
      <p>Accessories</p>
      <p>Sale</p>
    </nav>
      <div className='product-list'>
        <div className='product-card'>
        </div>
      </div>
    </>
  )
}

export default App
