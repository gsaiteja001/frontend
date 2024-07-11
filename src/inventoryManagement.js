import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebarComponent';

// Mock server data fetching function
const fetchData = async (endpoint) => {
  // Replace with actual server call
  const data = {
    inventoryOverview: [
      { id: 1, category: 'Electronics', quantity: 100, storageLocation: 'Warehouse A' },
      { id: 2, category: 'Furniture', quantity: 50, storageLocation: 'Warehouse B' },
    ],
    detailedView: [
      { subCategory: 'Mobile Phones', quantity: 60, storageLocation: 'Shelf 1', status: 'Processing' },
      { subCategory: 'Laptops', quantity: 40, storageLocation: 'Shelf 2', status: 'Completed' },
    ],
    inventoryHistory: [
      { date: '2024-07-01', action: 'Added', category: 'Electronics', quantity: 100, status: 'Processing' },
      { date: '2024-06-25', action: 'Shipped', category: 'Furniture', quantity: 50, status: 'Completed' },
    ],
  };
  return data[endpoint];
};

const Inventory = () => {


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

  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const handleRecordClick = (recordId) => {
    if (selectedRecordId === recordId) {
      setSelectedRecordId(null);
    } else {
      setSelectedRecordId(recordId);
    }
  };

  return (
    <div style={containerStyle}>

    
    <Sidebar activeLink={activeLink} onLinkClick={handleLinkClick} />

      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <div>Logo</div>
          <div>
          <Link to="/dashboard"><span style={headerLinkStyle}>Dashboard</span> </Link>
            <span style={headerLinkStyle}>User Profile</span>
            <span style={headerLinkStyle}>Settings</span>
            <span style={headerLinkStyle}>Log Out</span>
          </div>
        </div>

        <InventoryOverview
          sectionStyle={sectionStyle}
          sectionTitleStyle={sectionTitleStyle}
          handleRecordClick={handleRecordClick}
          selectedRecordId={selectedRecordId}
        />
        {selectedRecordId && (
          <DetailedView
            sectionStyle={sectionStyle}
            sectionTitleStyle={sectionTitleStyle}
            recordId={selectedRecordId}
          />
        )}
        <InventoryHistory sectionStyle={sectionStyle} sectionTitleStyle={sectionTitleStyle} />
      </div>
    </div>
  );
};

const InventoryOverview = ({ sectionStyle, sectionTitleStyle, handleRecordClick, selectedRecordId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData('inventoryOverview');
      setData(result);
    };
    fetchDataAsync();
  }, []);

  const tableHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
    padding: '10px',
    borderRadius: '5px',
  };

  const tableRowStyle = (isSelected) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#a2d5ab' : 'transparent',
  });

  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Inventory Overview</div>
      <div style={tableHeaderStyle}>
        <div>Category</div>
        <div>Quantity</div>
        <div>Storage Location</div>
      </div>
      {data.map((record) => (
        <div
          key={record.id}
          style={tableRowStyle(selectedRecordId === record.id)}
          onClick={() => handleRecordClick(record.id)}
        >
          <div>{record.category}</div>
          <div>{record.quantity}</div>
          <div>{record.storageLocation}</div>
        </div>
      ))}
    </div>
  );
};

const DetailedView = ({ sectionStyle, sectionTitleStyle, recordId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData('detailedView');
      setData(result);
    };
    fetchDataAsync();
  }, [recordId]);

  const tableHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
    padding: '10px',
    borderRadius: '5px',
  };

  const tableRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
  };

  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Detailed view</div>
      <div style={tableHeaderStyle}>
        <div>Sub-Category</div>
        <div>Quantity</div>
        <div>Storage Location</div>
        <div>Status</div>
      </div>
      {data.map((detail, index) => (
        <div key={index} style={tableRowStyle}>
          <div>{detail.subCategory}</div>
          <div>{detail.quantity}</div>
          <div>{detail.storageLocation}</div>
          <div>{detail.status}</div>
        </div>
      ))}
    </div>
  );
};

const InventoryHistory = ({ sectionStyle, sectionTitleStyle }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData('inventoryHistory');
      setData(result);
    };
    fetchDataAsync();
  }, []);

  const tableHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
    padding: '10px',
    borderRadius: '5px',
  };

  const tableRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
  };

  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Inventory History</div>
      <div style={tableHeaderStyle}>
        <div>Date</div>
        <div>Action</div>
        <div>Category</div>
        <div>Quantity</div>
        <div>Status</div>
      </div>
      {data.map((history, index) => (
        <div key={index} style={tableRowStyle}>
          <div>{history.date}</div>
          <div>{history.action}</div>
          <div>{history.category}</div>
          <div>{history.quantity}</div>
          <div>{history.status}</div>
        </div>
      ))}
    </div>
  );
};

export default Inventory;
