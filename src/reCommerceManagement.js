import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-calendar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'react-calendar/dist/Calendar.css';
import Sidebar from './sidebarComponent';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import OrderDetailsModal from './orderDetailsModal'; // Adjust the path as needed

const ReCommerceOrderManagement = () => {
  const [date, setDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]); // Default location
  const [activeLink, setActiveLink] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const mapRef = useRef();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };


  function parseLocation(locationString) {
    if (!locationString) {
        return { address: '', lat: '', lng: '' };
    }
    const match = locationString.match(/(.*?)(LatLng\(([^,]+), ([^)]+)\))/);
    if (match) {
        const address = match[1].trim();
        const lat = match[3].trim();
        const lng = match[4].trim();
        return { address, lat, lng };
    } else {
        return { address: '', lat: '', lng: '' };
    }
}

useEffect(() => {
    const fetchOrders = async (selectedDate) => {
        try {
            setDate(selectedDate);

            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
            console.log("formatted date..", formattedDate);
            const response = await axios.get(`http://localhost:8080/getreCommerceOrders?date=${formattedDate}`);
            console.log("res...", response.data.orderslist);
            const data = response.data.orderslist;

            const orders = Array.isArray(data) ? data.map(order => {
              const { address, lat, lng } = parseLocation(order.location);
              console.log('Address:', address);
              console.log('Latitude:', lat);
              console.log('Longitude:', lng);
                return {
                  id: order._id,
                  username: order.name,
                  date: order.date,
                  address: address,
                  lat: parseFloat(lat), // Ensure lat is a number
                  lng: parseFloat(lng),
                  price: order.totalPrice,
                  contact: order.contact,
                  items: order.cart,
                  status: order.status
                };
            }) : [];

            setOrders(orders);
            setMapLocations(orders.map(order => ({ lat: order.lat, lng: order.lng })));
            setFilteredOrders(orders);
            console.log("orders..", orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    fetchOrders(date);
}, [date]);




  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.username.toLowerCase().includes(lowercasedQuery) ||
        order.id.toString().includes(lowercasedQuery)
    );
    setFilteredOrders(filtered);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(newLocation);
          const map = mapRef.current;
          if (map) {
            map.setView(newLocation, 13); // Adjust zoom level as needed
          }
        },
        (error) => {
          console.error("Error getting current location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const handleStartOrder = async (order) => {
    if (order) {
      try {
        const response = await axios.post('http://localhost:8080/startDelivery', {
          id: order.id,
          status: 'in progress'
        });
        if (response.status === 200) {
          // Update local state to reflect status change
          setOrders(prevOrders => prevOrders.map(ord =>
            ord.id === order.id ? { ...ord, status: 'in progress' } : ord
          ));
          setFilteredOrders(prevOrders => prevOrders.map(ord =>
            ord.id === order.id ? { ...ord, status: 'in progress' } : ord
          ));
          setModalIsOpen(false);
        }
      } catch (error) {
        console.error("Error starting order:", error);
      }
    }
  };

  const handleCompleteOrder = async (updatedItems) => {
    if (selectedOrder) {
      try {
        const response = await axios.post('http://localhost:8080/completeorder', {
          id: selectedOrder.id,
          status: 'completed',
          items: updatedItems
        });
        if (response.status === 200) {
          // Update local state to reflect status change
          setOrders(prevOrders => prevOrders.map(ord =>
            ord.id === selectedOrder.id ? { ...ord, status: 'completed', items: updatedItems } : ord
          ));
          setFilteredOrders(prevOrders => prevOrders.map(ord =>
            ord.id === selectedOrder.id ? { ...ord, status: 'completed', items: updatedItems } : ord
          ));
          setModalIsOpen(false);
        }
      } catch (error) {
        console.error("Error completing order:", error);
      }
    }
  };

  const activeOrders = filteredOrders.filter(order => order.status !== 'completed');
  const completedOrders = filteredOrders.filter(order => order.status === 'completed');

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={logoStyle}>Logo</div>
        <nav style={navStyle}>
          <a href="/dashboard" style={linkStyle}>Dashboard</a>
          <a href="#" style={linkStyle}>User Profile</a>
          <a href="#" style={linkStyle}>Settings</a>
          <a href="#" style={linkStyle}>Log Out</a>
        </nav>
      </header>
      <div style={mainStyle}>
        <Sidebar activeLink={activeLink} onLinkClick={handleLinkClick} />
        <main style={contentStyle}>
          <h2>Order Management</h2>
          <div style={viewStyle}>
            <div style={calendarStyle}>
              <h3>Calendar View</h3>
              <Calendar onChange={handleDateChange} value={date} />
            </div>
            <div style={mapStyle}>
              <h3>Map View</h3>
              <div style={mapContainerStyle}>
                <MapContainer center={currentLocation} zoom={13} style={mapInnerContainerStyle} ref={mapRef}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {mapLocations.map((order, index) => (
                    <Marker key={index} position={[order.lat, order.lng]}>
                      <Popup>{`Location: ${order.lat}, ${ order.lng}`}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <button style={locateButtonStyle} onClick={handleLocationClick}>Locate Me</button>
            </div>
          </div>
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Name, User ID or email"
              style={searchInputStyle}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button style={searchButtonStyle} onClick={handleSearch}>🔍</button>
          </div>
          <div style={tableContainerStyle}>
            <h3>Order List</h3>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableCellStyle}>Order ID</th>
                  <th style={tableCellStyle}>Name</th>
                  <th style={tableCellStyle}>Address</th>
                  <th style={tableCellStyle}>Date</th>
                  <th style={tableCellStyle}>Total Price</th>
                  <th style={tableCellStyle}>Contact</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order) => (
                  <tr key={order.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{order.id}</td>
                    <td style={tableCellStyle}>{order.username}</td>
                    <td style={tableCellStyle}>{order.address}</td>
                    <td style={tableCellStyle}>{order.date}</td>
                    <td style={tableCellStyle}>{order.price}</td>
                    <td style={tableCellStyle}>{order.contact}</td>
                    <td style={tableCellStyle}>{order.status}</td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle} onClick={() => handleViewClick(order)}>View</button>
                      <button style={actionButtonStyle}>Edit</button>
                      <button style={actionButtonStyle}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={tableContainerStyle}>
            <h3>Order History</h3>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableCellStyle}>Order ID</th>
                  <th style={tableCellStyle}>UserName</th>
                  <th style={tableCellStyle}>Address</th>
                  <th style={tableCellStyle}>Date</th>
                  <th style={tableCellStyle}>Total Price</th>
                  <th style={tableCellStyle}>Contact</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Items</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((order) => (
                  <tr key={order.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{order.id}</td>
                    <td style={tableCellStyle}>{order.username}</td>
                    <td style={tableCellStyle}>{order.address}</td>
                    <td style={tableCellStyle}>{order.date}</td>
                    <td style={tableCellStyle}>{order.price}</td>
                    <td style={tableCellStyle}>{order.contact}</td>
                    <td style={tableCellStyle}>{order.status}</td>
                    <td style={tableCellStyle}>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.category} ({item.weight} kg) - Price: {item.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          userInfo={{ 
            name: selectedOrder.username, 
            contact: selectedOrder.contact, 
            userId: selectedOrder.id 
          }}
          orderInfo={{ 
            address: `Lat: ${selectedOrder.address.lat}, Lng: ${selectedOrder.address.lng}`, 
            scheduleDate: selectedOrder.date, 
            items: selectedOrder.items,
            status: selectedOrder.status 
          }}
          onStartOrder={() => handleStartOrder(selectedOrder)}
          onCompleteOrder={handleCompleteOrder}
        />
      )}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#ffffff',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#d873f5',
  padding: '10px 20px',
  color: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const logoStyle = {
  fontSize: '1.5em',
};

const navStyle = {
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
};

const mainStyle = {
  display: 'flex',
  flex: '1',
};

const contentStyle = {
  flex: '1',
  backgroundColor: '#e0f7da',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

const searchInputStyle = {
  flex: '1',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #cccccc',
};

const searchButtonStyle = {
  marginLeft: '10px',
  padding: '10px 20px',
  backgroundColor: '#8ce08a',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const tableContainerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const tableHeaderStyle = {
  backgroundColor: '#d873f5',
  color: '#ffffff',
};

const tableRowStyle = {
  backgroundColor: '#f9f9f9',
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #dddddd',
};

const actionButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#8ce08a',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '5px',
};

const locateButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#8ce08a',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '5px',
};

const viewStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
};

const calendarStyle = {
  flex: '1',
  marginRight: '10px',
};

const mapStyle = {
  flex: '1',
  marginLeft: '10px',
};

const mapContainerStyle = {
  height: '300px',
  position: 'relative',
};



const mapInnerContainerStyle = {
  height: '100%',
  width: '100%',
  borderRadius: '10px',
};

export default ReCommerceOrderManagement;
