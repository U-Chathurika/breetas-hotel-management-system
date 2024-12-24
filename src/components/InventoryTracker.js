import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Adjusted the path to import from the parent directory

export default function InventoryTracker() {
  const [stocks, setStocks] = useState([]);
  const [lowStockThreshold, setLowStockThreshold] = useState(10); // Default threshold

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

  const getLowStockItems = () => {
    return stocks.filter(stock => stock.quantity <= lowStockThreshold);
  };

  return (
    <div className="container">
      <div className="inventory-section">
        <h1 className="inventory-title">Inventory Tracker</h1>
        <div className="threshold-container">
          <label>Low Stock Threshold:</label>
          <input
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="low-stock-section">
        <h2 className="low-stock-warning">Low Stock Warning</h2>
        <ul className="low-stock-items">
          {getLowStockItems().map((item) => (
            <li
              key={item._id}
              style={{
                color: item.quantity === 0 ? 'red' : 'orange',
              }}
            >
              {item.itemName} - Quantity: {item.quantity}
              {item.quantity === 0 ? ' (Out of Stock)' : ' (Low Stock)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
