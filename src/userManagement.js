import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Sidebar from './sidebarComponent';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const [activeLink, setActiveLink] = useState(null);
  
    const handleLinkClick = (link) => {
      setActiveLink(link);
    };

  useEffect(() => {
    // Fetch users from server
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.example.com/users'); // Replace with your API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://api.example.com/users/${userId}`); // Replace with your API endpoint
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (userId) => {
    // Logic to edit user
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleView = (userId) => {
    // Logic to view user
    console.log(`View user with ID: ${userId}`);
  };

  const handleDownload = () => {
    const csv = users.map(user => `${user.id},${user.name},${user.email},${user.registrationDate},${user.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users_list.csv');
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

  const sidebarStyle = {
    width: '200px',
    backgroundColor: '#8ce08a',
    color: '#4b4b4b',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const sidebarLinkStyle = {
    display: 'block',
    marginBottom: '10px',
    color: '#4b4b4b',
    textDecoration: 'none',
    fontWeight: 'bold',
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
          <h2>User Management</h2>
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Name, User ID or email"
              style={searchInputStyle}
            />
            <button style={searchButtonStyle}>🔍</button>
          </div>
          <button onClick={handleDownload} style={searchButtonStyle}>Download List</button>
          <div style={tableContainerStyle}>
            <h3>Users List</h3>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableCellStyle}>User ID</th>
                  <th style={tableCellStyle}>Name</th>
                  <th style={tableCellStyle}>Email</th>
                  <th style={tableCellStyle}>Registration Date</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr style={tableRowStyle} key={user.id}>
                    <td style={tableCellStyle}>{user.id}</td>
                    <td style={tableCellStyle}>{user.name}</td>
                    <td style={tableCellStyle}>{user.email}</td>
                    <td style={tableCellStyle}>{user.registrationDate}</td>
                    <td style={tableCellStyle}>{user.status}</td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle} onClick={() => handleEdit(user.id)}>Edit</button>
                      <button style={actionButtonStyle} onClick={() => handleView(user.id)}>View</button>
                      <button style={actionButtonStyle} onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};


export default UserManagement;