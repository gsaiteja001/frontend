import { BrowserRouter as Router, Route, Switch, Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const activeLink = location.pathname;
    const sidebarStyle = {
        backgroundColor: '#7cba72',
        padding: '20px',
        width: '250px',
        color: 'white',
    };
  
    const sidebarItemStyle = (link) => ({
        marginBottom: '10px',
        cursor: 'pointer',
        display: 'block',
        marginBottom: '10px',
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
      padding: '10px',
      textDecoration: 'none',
      color: 'black',
      cursor: 'pointer',
      backgroundColor: activeLink === link ? 'lightgray' : '#7cba72',
      display: 'block',
    });
  
    return (
        <div style={sidebarStyle}>
        <Link to="/user-management" style={sidebarItemStyle('/user-management')}>User Management</Link>
        <Link to="/collectionManagement" style={sidebarItemStyle('/collectionManagement')}>Collection Management</Link>
        <Link to="/inventoryManagement" style={sidebarItemStyle('/inventoryManagement')}>Inventory Management</Link>
        <Link to="/orderManagement" style={sidebarItemStyle('/orderManagement')}>Order Management</Link>
        <div style={sidebarItemStyle('/analyticsReporting')}>Analytics and Reporting</div>
        <Link to="/communicationPage" style={sidebarItemStyle('/communicationPage')}>communication</Link>
        <Link to="/reCommerceManagement" style={sidebarItemStyle('/reCommerceManagement')}>E-commerce Management</Link>
      </div>
    );
  };

  export default Sidebar;