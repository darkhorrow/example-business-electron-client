import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';


import './Navbar.css';

class AppNavbar extends React.Component {
  render(){
    return(
        <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
            <Navbar.Brand>Business Example</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <Link to="/home" className="nav-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
  }
}

export default AppNavbar;