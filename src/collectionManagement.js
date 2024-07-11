import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-calendar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'react-calendar/dist/Calendar.css';
import Sidebar from './sidebarComponent';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import CollectionDetailsModal from './collectionDetailsModal'; // Adjust the path as needed

const CollectionManagement = () => {
  const [date, setDate] = useState(new Date());
  const [collections, setCollections] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]); // Default location
  const [activeLink, setActiveLink] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const mapRef = useRef();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    const fetchCollections = async (selectedDate) => {
      try {
        setDate(selectedDate);
        
        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        const response = await axios.get(`http://localhost:8080/getorders?date=${formattedDate}`);
        const data = response.data.orderslist;

        const collections = Array.isArray(data) ? data.map(order => {
          let location = { lat: 0, lng: 0 };
          try {
            location = JSON.parse(order.location);
          } catch (e) {
            console.error("Invalid location JSON:", order.location);
          }
          return {
            id: order._id,
            username: order.name,
            date: order.schedulePickup,
            address: location,
            totalWeight: order.totalWeight,
            contact: order.contact,
            items: order.items,
            status: order.status
          };
        }) : [];

        setCollections(collections);
        setMapLocations(collections.map(collection => collection.address));
        setFilteredCollections(collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections(date);
  }, [date]);

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = collections.filter(
      (collection) =>
        collection.username.toLowerCase().includes(lowercasedQuery) ||
        collection.id.toString().includes(lowercasedQuery)
    );
    setFilteredCollections(filtered);
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

  const handleViewClick = (collection) => {
    setSelectedCollection(collection);
    setModalIsOpen(true);
  };

  const handleStartPickup = async (collection) => {
    if (collection) {
      try {
        const response = await axios.post('http://localhost:8080/startpickup', {
          id: collection.id,
          status: 'in progress'
        });
        if (response.status === 200) {
          // Update local state to reflect status change
          setCollections(prevCollections => prevCollections.map(col =>
            col.id === collection.id ? { ...col, status: 'in progress' } : col
          ));
          setFilteredCollections(prevCollections => prevCollections.map(col =>
            col.id === collection.id ? { ...col, status: 'in progress' } : col
          ));
          setModalIsOpen(false);
        }
      } catch (error) {
        console.error("Error starting pickup:", error);
      }
    }
  };

  const handleCompletePickup = async (updatedItems) => {
    if (selectedCollection) {
      try {
        const response = await axios.post('http://localhost:8080/completepickup', {
          id: selectedCollection.id,
          status: 'completed',
          items: updatedItems
        });
        if (response.status === 200) {
          // Update local state to reflect status change
          setCollections(prevCollections => prevCollections.map(col =>
            col.id === selectedCollection.id ? { ...col, status: 'completed', items: updatedItems } : col
          ));
          setFilteredCollections(prevCollections => prevCollections.map(col =>
            col.id === selectedCollection.id ? { ...col, status: 'completed', items: updatedItems } : col
          ));
          setModalIsOpen(false);
        }
      } catch (error) {
        console.error("Error completing pickup:", error);
      }
    }
  };

  const activeCollections = filteredCollections.filter(collection => collection.status !== 'completed');
  const completedCollections = filteredCollections.filter(collection => collection.status === 'completed');

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
          <h2>Collection Management</h2>
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
                  {mapLocations.map((collection,index) => (
                    <Marker key={index} position={[collection.lat, collection.lng]}>
                      <Popup>{`Location: ${collection.lat}, ${collection.lng}`}</Popup>
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
            <h3>Collection List</h3>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableCellStyle}>Collection ID</th>
                  <th style={tableCellStyle}>UserName</th>
                  <th style={tableCellStyle}>Address</th>
                  <th style={tableCellStyle}>Date</th>
                  <th style={tableCellStyle}>Total Weight</th>
                  <th style={tableCellStyle}>Contact</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeCollections.map((collection) => (
                  <tr key={collection.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{collection.id}</td>
                    <td style={tableCellStyle}>{collection.username}</td>
                    <td style={tableCellStyle}>{`Lat: ${collection.address.lat}, Lng: ${collection.address.lng}`}</td>
                    <td style={tableCellStyle}>{collection.date}</td>
                    <td style={tableCellStyle}>{collection.totalWeight}</td>
                    <td style={tableCellStyle}>{collection.contact}</td>
                    <td style={tableCellStyle}>{collection.status}</td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle} onClick={() => handleViewClick(collection)}>View</button>
                      <button style={actionButtonStyle}>Edit</button>
                      <button style={actionButtonStyle}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={tableContainerStyle}>
            <h3>Collection History</h3>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableCellStyle}>Collection ID</th>
                  <th style={tableCellStyle}>UserName</th>
                  <th style={tableCellStyle}>Address</th>
                  <th style={tableCellStyle}>Date</th>
                  <th style={tableCellStyle}>Total Weight</th>
                  <th style={tableCellStyle}>Contact</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Items</th>
                </tr>
              </thead>
              <tbody>
                {completedCollections.map((collection) => (
                  <tr key={collection.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{collection.id}</td>
                    <td style={tableCellStyle}>{collection.username}</td>
                    <td style={tableCellStyle}>{`Lat: ${collection.address.lat}, Lng: ${collection.address.lng}`}</td>
                    <td style={tableCellStyle}>{collection.date}</td>
                    <td style={tableCellStyle}>{collection.totalWeight}</td>
                    <td style={tableCellStyle}>{collection.contact}</td>
                    <td style={tableCellStyle}>{collection.status}</td>
                    <td style={tableCellStyle}>
                      <ul>
                        {collection.items.map((item, index) => (
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
      {selectedCollection && (
        <CollectionDetailsModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          userInfo={{ 
            name: selectedCollection.username, 
            contact: selectedCollection.contact, 
            userId: selectedCollection.id 
          }}
          pickupInfo={{ 
            address: `Lat: ${selectedCollection.address.lat}, Lng: ${selectedCollection.address.lng}`, 
            scheduleDate: selectedCollection.date, 
            items: selectedCollection.items,
            status: selectedCollection.status 
          }}
          onStartPickup={() => handleStartPickup(selectedCollection)}
          onCompletePickup={handleCompletePickup}
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

export default CollectionManagement;
