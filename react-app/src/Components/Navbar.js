import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom';
import { Navbar, Nav, Modal, Button } from 'react-bootstrap';


import './Navbar.css';

class AppNavbar extends React.Component {
  state = {
    showModal: false
  }

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleClose() {
    this.setState({showModal: false});
  }

  handleShow() {
    this.setState({showModal: true});
  }

  render(){
    return(
      <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
          <Navbar.Brand>Business Example</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
              <Nav className="mr-auto">
                  <Link to="/home" className="nav-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={this.handleShow}><FontAwesomeIcon icon={faUser} /> Logout</Nav.Link>
              </Nav>
          </Navbar.Collapse>
          <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Log out</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to close the session?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>Close</Button>
              <Button variant="primary" onClick={this.handleClose}>Log out</Button>
            </Modal.Footer>
          </Modal>
      </Navbar>
    );
  }
}

export default AppNavbar;