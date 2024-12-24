import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

export default function ViewStocks() {
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        getStocks();
    }, []);

    function getStocks() {
        axios.get("http://localhost:8070/stocks/")
            .then((res) => {
                setStocks(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    function deleteStock(id) {
        axios.delete(`http://localhost:8070/stocks/delete/${id}`)
            .then(() => {
                alert("Stock deleted successfully");
                getStocks();
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    const filteredStocks = stocks.filter(stock => {
        const matchesSearch = stock.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || 
                              (filter === 'available' && stock.quantity > 0) || 
                              (filter === 'outOfStock' && stock.quantity === 0);
        return matchesSearch && matchesFilter;
    });

    const handleUpdate = (id) => {
        navigate(`/update/${id}`); // Navigate to the UpdateStock page with the item's ID
    };

    return (
        <div className="container">
            <h1>All Stock Details</h1>
            <div className="search-filter">
                <input 
                    type="text" 
                    placeholder="Search by item name" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="available">Available</option>
                    <option value="outOfStock">Out of Stock</option>
                </select>
            </div>
            <div className="stocks-grid">
                {filteredStocks.map(stock => (
                    <div key={stock._id} className="stock-card">
                        <div className={`card-header ${stock.quantity > 0 ? 'available' : 'out-of-stock'}`}>
                            {stock.quantity > 0 ? 'Available' : 'Out of Stock'}
                        </div>
                        <div className="card-content">
                            <div>ID: {stock._id}</div>
                            <div>Name: {stock.itemName}</div>
                            <div>Category: {stock.category}</div>
                            <div>Quantity: {stock.quantity}</div>
                            <div>Price: Rs.{stock.unitPrice.toFixed(2)}</div>
                            <div>Expiry: {new Date(stock.expiryDate).toLocaleDateString()}</div>
                            <div>Supplier: {stock.supplierName}</div>
                            <div>Contact: {stock.contactNumber}</div>
                        </div>
                        <div className="card-actions">
                            <button 
                                className="btn btn-success" 
                                onClick={() => handleUpdate(stock._id)} // Call handleUpdate when clicked
                            >
                                Update
                            </button>
                            <button className="btn btn-danger" onClick={() => deleteStock(stock._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
