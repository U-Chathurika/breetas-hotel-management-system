import './App.css';
import Headers from './components/Headers';
import AddStockItem from './components/AddStockItem';
import ViewStocks from './components/ViewStocks';
import UpdateStock from './components/UpdateStock';
import DeleteStock from './components/DeleteStock';
import Stocks from './components/Stocks';
import InventoryTracker from './components/InventoryTracker';
import GenerateReport from './components/GenerateReport';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Headers />
        <div className="container">
          <Routes>
            <Route path="/" element={<Stocks />} />
            <Route path="/add" element={<AddStockItem />} />
            <Route path="/view" element={<ViewStocks />} />
            <Route path="/update/:id" element={<UpdateStock />} />  {/* Corrected route for updating stock */}
            <Route path="/delete/:id" element={<DeleteStock />} />
            <Route path="/inventory-tracker" element={<InventoryTracker />} />
            <Route path="/reports" element={<GenerateReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
