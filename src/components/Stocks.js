import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function StockDashboard() {
    const [stocks, setStocks] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedStockId, setSelectedStockId] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:8070/stocks');
            setStocks(response.data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    const handleAddImage = (stockId) => {
        setSelectedStockId(stockId);
        setShowImageModal(true);
    };

    const handleImageUpload = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 4);
        setImageFiles(selectedFiles);
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0 || !selectedStockId) {
            alert('Please select up to 4 image files first.');
            return;
        }

        const formData = new FormData();
        imageFiles.forEach((file, index) => {
            formData.append(`images`, file);
        });

        try {
            await axios.post(`http://localhost:8070/stocks/${selectedStockId}/images`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setShowImageModal(false);
            setImageFiles([]);
            fetchStocks();
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    return (
        <div className="container">
            <h1>Stock Management</h1>
            <StockTable stocks={stocks} handleAddImage={handleAddImage} />
            <AddNewItemButton />
            <AdditionalFeatures />
            <ImageUploadModal 
                showImageModal={showImageModal}
                setShowImageModal={setShowImageModal}
                handleImageUpload={handleImageUpload}
                uploadImages={uploadImages}
                imageFiles={imageFiles}
            />
        </div>
    );
}

function StockTable({ stocks, handleAddImage }) {
    return (
        <table className="stock-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Availability</th>
                    <th>View Details</th>
                    <th>Add Image</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map(stock => (
                    <StockRow key={stock._id} stock={stock} handleAddImage={handleAddImage} />
                ))}
            </tbody>
        </table>
    );
}

function StockRow({ stock, handleAddImage }) {
    const getAvailabilityStatus = (quantity) => {
        if (quantity === 0) return 'Out of Stock';
        if (quantity <= 10) return 'Low Stock';
        return 'Available';
    };

    return (
        <tr>
            <td>{stock.itemName}</td>
            <td>{stock.category}</td>
            <td>{getAvailabilityStatus(stock.quantity)}</td>
            <td>
                <Link to={`/view/${stock._id}`}>
                    <button className="btn btn-info">View Details</button>
                </Link>
            </td>
            <td>
                <button className="btn btn-secondary" onClick={() => handleAddImage(stock._id)}>
                    Add Image
                </button>
            </td>
        </tr>
    );
}

function AddNewItemButton() {
    return (
        <div className="add-new-item-container">
            <Link to="/add">
                <button className="btn btn-success">+ Add New Item</button>
            </Link>
        </div>
    );
}

function AdditionalFeatures() {
    return (
        <div className="additional-features">
            <Link to="/inventory-tracker">
                <button className="btn btn-primary">Inventory Tracker</button>
            </Link>
            <Link to="/reports">
                <button className="btn btn-warning">Generate Reports</button>
            </Link>
        </div>
    );
}

function ImageUploadModal({ showImageModal, setShowImageModal, handleImageUpload, uploadImages, imageFiles }) {
    if (!showImageModal) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Images for Stock Item</h2>
                <input 
                    type="file" 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    multiple 
                    max="4"
                />
                <p>{imageFiles.length} images selected (max 4).</p>
                <button className="btn btn-primary" onClick={uploadImages}>Upload</button>
                <button className="btn btn-danger" onClick={() => setShowImageModal(false)}>Cancel</button>
            </div>
        </div>
    );
}

export default StockDashboard;
