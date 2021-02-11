import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faBoxes, faTruck, faTags, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons'

import { Link, withRouter } from 'react-router-dom';
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
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleClose() {
    this.setState({showModal: false});
  }

  handleShow() {
    this.setState({showModal: true});
  }

  handleLogOut() {
    sessionStorage.removeItem('token');
    this.handleClose();
    this.props.history.push("/login");
  }

  render(){
    return(
      <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
          <Navbar.Brand>Business Example</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
              <Nav className="mr-auto">
                  <Link to="/home" className="nav-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
                  <Link to="/items" className="nav-link"><FontAwesomeIcon icon={faBoxes} /> Items</Link>
                  <Link to="/suppliers" className="nav-link"><FontAwesomeIcon icon={faTruck} /> Suppliers</Link>
                  <Link to="/price-reductions" className="nav-link"><FontAwesomeIcon icon={faTags} /> Price reductions</Link>
                  <div className="navbar-roles-division"></div>
                  <Link to="/users" className="nav-link"><FontAwesomeIcon icon={faUsers} /> Users</Link>
                  <Link to="/deactivations" className="nav-link"><FontAwesomeIcon icon={faClipboardList} /> Deactivations</Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={this.handleShow}><FontAwesomeIcon icon={faUser} /> Logout</Nav.Link>
              </Nav>
          </Navbar.Collapse>
          <Modal show={this.state.showModal} onHide={this.handleClose} className="text-light" id="logout-modal">
            <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Log out</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">Are you sure you want to close the session?</Modal.Body>
            <Modal.Footer className="bg-dark">
              <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
              <Button variant="primary" onClick={this.handleLogOut}>Log out</Button>
            </Modal.Footer>
          </Modal>
      </Navbar>
    );
  }
}

export default withRouter(AppNavbar);