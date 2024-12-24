import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateStock() {
    const { id } = useParams();  // Fetch the 'id' parameter from the URL
    const navigate = useNavigate();  // Used for navigation after update

    // Define state variables for the stock fields
    const [stock, setStock] = useState({
        itemName: '',
        category: '',
        subCategory: '',
        quantity: '',
        unitPrice: '',
        supplierName: '',
        contactNumber: '',
        expiryDate: ''
    });

    // Fetch the current stock item details using the stock ID
    useEffect(() => {
        axios.get(`http://localhost:8070/stocks/get/${id}`)
            .then(response => {
                if (response.data.stock) {
                    const stockData = response.data.stock;

                    // Populate the state with the existing stock data
                    setStock({
                        itemName: stockData.itemName,
                        category: stockData.category,
                        subCategory: stockData.subCategory,
                        quantity: stockData.quantity,
                        unitPrice: stockData.unitPrice,
                        supplierName: stockData.supplierName,
                        contactNumber: stockData.contactNumber,
                        expiryDate: stockData.expiryDate.split('T')[0] // Format date to YYYY-MM-DD
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching stock item:', error);
                alert('Failed to load stock data.');
            });
    }, [id]); // Re-run this effect if the 'id' changes

    // Handle the input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStock({
            ...stock,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8070/stocks/update/${id}`, stock);
            alert('Stock item updated successfully!');
            navigate('/view');  // Navigate back to the stock list after update
        } catch (error) {
            console.error('Error updating stock item:', error);
            alert('Failed to update stock item.');
        }
    };

    return (
        <div className="container">
            <h2>Update Stock Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Item Name:</label>
                    <input
                        type="text"
                        name="itemName"
                        className="form-control"
                        value={stock.itemName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        className="form-control"
                        value={stock.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Subcategory:</label>
                    <input
                        type="text"
                        name="subCategory"
                        className="form-control"
                        value={stock.subCategory}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={stock.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Unit Price:</label>
                    <input
                        type="number"
                        name="unitPrice"
                        className="form-control"
                        value={stock.unitPrice}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Supplier Name:</label>
                    <input
                        type="text"
                        name="supplierName"
                        className="form-control"
                        value={stock.supplierName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contact Number:</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        className="form-control"
                        value={stock.contactNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Expiry Date:</label>
                    <input
                        type="date"
                        name="expiryDate"
                        className="form-control"
                        value={stock.expiryDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Stock</button>
            </form>
        </div>
    );
}

export default UpdateStock;
