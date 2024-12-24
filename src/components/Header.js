import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Navbar</Link>
        <ul className="navbar-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/add" className="nav-link">Add Stock</Link></li>
          <li><Link to="/view" className="nav-link">View Stocks</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
















