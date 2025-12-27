import { useNavigate } from "react-router-dom";


function Sidebar({filters, setFilters, sort, setSort}) {

    const navigate = useNavigate();

    const setCategory = (category) => {
        setFilters(prev => ({ ...prev, category }));
    } 
    
    const setPrice = (price) => {
        setFilters(prev => ({ ...prev, price}));
    }

    const setCondition = (condition) => {
        setFilters(prev => ({...prev, condition}));
    }

    const clearFilters = () => {
        setFilters({ category: "", price: "", condition: ""})
    }

    const newListing = async () => {
        navigate('/new-listing')
    }

    return (
        <>
            <button onClick={() => newListing()}>Create New Listing</button>
            <button onClick={() => clearFilters()}>Clear Filters</button>
            <div className="sort">
                <select
                    id="sort-by"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="recent">Recent</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="highToLow">High to Low</option>
                </select>
            </div>

            <div className="filter">
                <h3>Category:</h3>
                <div className="selection"><label><input type="radio" name="category" value="keyboards" checked={filters.category === "keyboards"} onChange={() => setCategory("keyboards")}/> Keyboards</label></div>
                <div className="selection"><label><input type="radio" name="category" value="mice" checked={filters.category === "mice"} onChange={() => setCategory("mice")}/> Mice</label></div>
                <div className="selection"><label><input type="radio" name="category" value="cpu" checked={filters.category === "cpu"} onChange={() => setCategory("cpu")}/> CPU</label></div>
                <div className="selection"><label><input type="radio" name="category" value="gpu" checked={filters.category === "gpu"} onChange={() => setCategory("gpu")}/> GPU</label></div>
                <div className="selection"><label><input type="radio" name="category" value="motherboard" checked={filters.category === "motherboard"} onChange={() => setCategory("motherboard")}/> Motherboard</label></div>
                <div className="selection"><label><input type="radio" name="category" value="ram" checked={filters.category === "ram"} onChange={() => setCategory("ram")}/> RAM</label></div>
                <div className="selection"><label><input type="radio" name="category" value="storage" checked={filters.category === "storage"} onChange={() => setCategory("storage")}/> Storage</label></div>
                <div className="selection"><label><input type="radio" name="category" value="power supply" checked={filters.category === "power supply"} onChange={() => setCategory("power supply")}/> Power Supply</label></div>
                <div className="selection"><label><input type="radio" name="category" value="cooling" checked={filters.category === "cooling"} onChange={() => setCategory("cooling")}/> Cooling</label></div>
                <div className="selection"><label><input type="radio" name="category" value="cases" checked={filters.category === "cases"} onChange={() => setCategory("cases")}/> Cases</label></div>
                <div className="selection"><label><input type="radio" name="category" value="keycaps" checked={filters.category === "keycaps"} onChange={() => setCategory("keycaps")}/> Keycaps</label></div>
                <div className="selection"><label><input type="radio" name="category" value="monitors" checked={filters.category === "monitors"} onChange={() => setCategory("monitors")}/> Monitors</label></div>
                <div className="selection"><label><input type="radio" name="category" value="accessories" checked={filters.category === "accessories"} onChange={() => setCategory("accessories")}/> Accessories</label></div>
            </div>

            <div className="filter">
                <h3>Price</h3>
                <div className="selection"><label><input type="radio" name="price" value="under50" checked={filters.price === "under50"} onChange={() => setPrice("under50")}/> Under $50</label></div>
                <div className="selection"><label><input type="radio" name="price" value="50to100" checked={filters.price === "50to100"} onChange={() => setPrice("50to100")}/> $50-$100</label></div>
                <div className="selection"><label><input type="radio" name="price" value="100to200" checked={filters.price === "100to200"} onChange={() => setPrice("100to200")}/> $100-200</label></div>
                <div className="selection"><label><input type="radio" name="price" value="over200" checked={filters.price === "over200"} onChange={() => setPrice("over200")}/> Over $200</label></div>
            </div>

            <div className="filter">
                <h3>Condition</h3>
                <div className="selection"><label><input type="radio" name="condition" value="new" checked={filters.condition === "new"} onChange={() => setCondition("new")} /> New</label></div>
                <div className="selection"><label><input type="radio" name="condition" value="used" checked={filters.condition === "used"} onChange={() => setCondition("used")}/> Used</label></div>
                <div className="selection"><label><input type="radio" name="condition" value="refurbished" checked={filters.condition === "refurbished"} onChange={() => setCondition("refurbished")}/> Refurbished</label></div>
            </div>
        </>
    )
}
export default Sidebar;
