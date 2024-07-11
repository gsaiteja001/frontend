import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './login';
import Dashboard from './dashboard';
import UserManagement from './userManagement';
import CollectionManagement from './collectionManagement';
import OrderManagement from './orderManagement';
import Inventory from './inventoryManagement';
import Sidebar from './sidebarComponent';
import ReCommerceOrderManagement from './reCommerceManagement.js'




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/collectionManagement" element={<CollectionManagement />} />
          <Route path="/orderManagement" element={<OrderManagement />} />
          <Route path="/" element={<OrderManagement />} />
          <Route path="/inventoryManagement" element={<Inventory />} />
          <Route path="/reCommerceManagement" element={<ReCommerceOrderManagement />} />
      
        </Routes>
      </div>
    </Router>
  );
}

export default App;


