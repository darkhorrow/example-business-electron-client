import React from "react";

import { Modal, Button, Form } from 'react-bootstrap';

import AppTable from './AppTable';

import Auth from '../Security/Auth';

import UserService from '../Service/UserService';

import AppAlert from './Alerts/AppAlert';

import './Users.css';

class Users extends React.Component {
  constructor(props){
    super(props);
    this.alertElement = React.createRef();
  }

  state = {
    isLoading: true,
    users: null,
    userSelected: null,
    showModal: false, 
    action: null
  }

  async componentDidMount() {
    if(Auth.getRole() !== 'ADMIN') {
      this.props.history.push("/home");
    }

    UserService.getAllUsers().then(response => {
      this.setState({
        users: response.data,
        isLoading: false
      })
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleCloseModal = () => {
    this.setState({showModal: false, action: null, modalTitle: null, modalButtonText: null});
  }

  handleShowModal = () => {
    this.setState({showModal: true});
  }

  deleteUser() {
    if(this.state.userSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Remove User',
        modalButtonText: 'Remove User',
        action: 'remove'
      });
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select a user to remove"
      });
      this.alertElement.current.open();
    }
  }

  addUser() {
    this.handleShowModal();
    this.setState({
      modalTitle: 'Create User',
      modalButtonText: 'Create User',
      action: 'add'
    });
  }

  handleAction = (event) => {
    switch(event.target.getAttribute('action')) {
      case 'remove':
        this.deleteUser();
        break;
      case 'add':
        this.addUser();
    }
  }

  handleSubmit = (event) => {
    switch(this.state.action) {
      case 'remove':
        this.handleDeleteSubmit(event);
        break;
      case 'add':
        this.handleAddFormSubmit(event);
    }
  }

  handleAddFormSubmit(event) {
    event.preventDefault();

    const user = Object.fromEntries(new FormData(event.target));

    UserService.addUser(user).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleDeleteSubmit(event) {
    event.preventDefault();
    UserService.removeUser(this.state.userSelected.username).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  renderAlert(errorResponse) {
    if(errorResponse) {
      this.handleCloseModal();
      this.setState({errorMessage: errorResponse.data.message ? errorResponse.data.message : 'Unknown error found', errorType: 'danger'});
      this.alertElement.current.open();
    } else {
      this.handleCloseModal();
      this.setState({errorMessage: "Connection to the server failed", errorType: "danger"});
      this.alertElement.current.open();
    }
  }

  renderModalBody() {
    switch(this.state.action) {
      case 'add':
        return this.renderAddModal();
      case 'remove':
        return this.renderDeleteModal();
      default:
        return null;
    }
  }

  renderDeleteModal() {
    if(this.state.userSelected) {
      return(<Form onSubmit={this.handleSubmit} id="users">The user '{this.state.userSelected.username}' will be removed. Do you want to procceed?</Form>);
    }
  }

  renderAddModal() {
    return (
      <Form onSubmit={this.handleSubmit} id="users">
        <Form.Group controlId="user.name">
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="i.e example.username" name="username" />
        </Form.Group>
        <Form.Group controlId="user.password">
          <Form.Label>User Password</Form.Label>
          <Form.Control type="password" placeholder="i.e example.password42" name="password" />
        </Form.Group>
        <Form.Group controlId="user.role">
          <Form.Label>User Role</Form.Label>
          <Form.Control as="select" name="role">
              <option selected>USER</option>
              <option>ADMIN</option>
          </Form.Control>
        </Form.Group>
      </Form>
    );
  }

  render(){
    return this.state.isLoading ? null : this.renderPage();
  }

  renderPage() {
    const columns = [{
      dataField: 'username',
      text: 'User username',
      sort: true
    }, {
      dataField: 'role',
      text: 'User Role',
      sort: true
    }];

    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, event) => {
        this.setState({
          userSelected: row
        })
      }
    };

    return (
      <div className="users-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable 
            id={'username'} 
            elements={this.state.users} 
            columns={columns} 
            selection={selectRow} 
            elementName={'user'} 
            excludeActions={['edit', 'details']} 
            onAdd={this.handleAction}
            onDelete={this.handleAction}
            />

            <Modal show={this.state.showModal} onHide={this.handleCloseModal} className="text-light" id="users-modal">
              <Modal.Header closeButton className="bg-dark">
                <Modal.Title>{this.state.modalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderModalBody()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="users">{this.state.modalButtonText}</Button>
              </Modal.Footer>
            </Modal>

            <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;