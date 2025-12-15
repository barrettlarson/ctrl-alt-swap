import { useNavigate } from "react-router-dom";

function NewListing() {
    const navigate = useNavigate();
    const continueShopping = async () => {
        navigate('/app');
    };

    return(
        <>
            <h1>Create New Listing</h1>
            <input placeholder="Product Name"></input>
            <input placeholder="Brand"></input>
            <input placeholder="Description"></input>
            <button>Create Listing</button>
            <button onClick={() => continueShopping()}>Continue Shopping</button>
        </>
    )
}

export default NewListing;