
import React, { useState } from 'react';
import Sidebar from './sidebarComponent';
import OrdersTable from './customer_order_details';


const OrderManagement = () => {
    const [activeLink, setActiveLink] = useState(null);
  
    const handleLinkClick = (link) => {
      setActiveLink(link);
    };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  };

  const sidebarStyle = {
    backgroundColor: '#7cba72',
    padding: '20px',
    width: '250px',
    color: 'white',
  };

  const sidebarItemStyle = {
    marginBottom: '10px',
    cursor: 'pointer',
    display: 'block',
    marginBottom: '10px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
    
  };

  const mainContentStyle = {
    flex: 1,
    padding: '20px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2c4e3',
    padding: '10px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
  };

  const headerLinkStyle = {
    marginLeft: '15px',
    cursor: 'pointer',
    color: 'black',
  };

  const sectionStyle = {
    backgroundColor: '#d9f0d7',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2c6e36',
  };

  const listStyle = {
    listStyleType: 'none',
    paddingLeft: '0',
  };

  const listItemStyle = {
    marginBottom: '8px',
  };

  return (
    <div style={containerStyle}>
      <Sidebar activeLink={activeLink} onLinkClick={handleLinkClick} />

      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <div>Logo</div>
          <div>
            <span style={headerLinkStyle}>Dashboard</span>
            <span style={headerLinkStyle}>User Profile</span>
            <span style={headerLinkStyle}>Settings</span>
            <span style={headerLinkStyle}>Log Out</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Sales Dashboard</div>
          <ul style={listStyle}>
            <li style={listItemStyle}>1. Metrics Overview ---- total sales ---- Revenue ---- Average Order value ---- New customers</li>
            <li style={listItemStyle}>2. Sales Trends Graph ---- Line chart</li>
            <li style={listItemStyle}>3. Top Products ---- Product name ---- category ---- Quantity sold ---- Revenue</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Order Management (recycler)</div>
          <ul style={listStyle}>
            <li style={listItemStyle}>1. Search bar ---- filters [All, Pending Processed, Shipped, Completed, Cancelled]</li>
            <li style={listItemStyle}>2. table ---- Order ID ---- Recycler name ---- Item Type ---- Quantity ---- Date ---- Status ---- Total ---- Actions (View/Edit/Invoice)</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Order Details (recycler)</div>
          <ul style={listStyle}>
            <li style={listItemStyle}>1. Search bar ---- filters [All, Pending Processed, Shipped, Completed, Cancelled]</li>
            <li style={listItemStyle}>2. table ---- Recycler details ---- Item sold (Type, Quantity, Price) ---- Shipment Tracking info ---- Invoice Management</li>
            <li style={listItemStyle}>3. Customer Management (recyclers) ---- filters ---- [all, new, returning, vip] ---- orders (no.) ---- total spend ---- actions (view/edit)</li>
          </ul>
        </div>
        <OrdersTable/>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Transaction Management</div>
          <ul style={listStyle}>
            <li style={listItemStyle}>1. Search bar ---- filters [all, pending, completed]</li>
            <li style={listItemStyle}>2. table ---- customer name (household) ---- date ---- status ---- amount ---- payment type ---- actions (view)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
