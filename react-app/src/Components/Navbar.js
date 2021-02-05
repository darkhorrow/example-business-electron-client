import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom';


import './Navbar.css';

class Navbar extends React.Component {
  render(){
    return(
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToogler" aria-controls="navbarToogler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarToogler">
                    <span className="navbar-brand" href="#">Business Example</span>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/home" className="nav-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
  }
}

export default Navbar;