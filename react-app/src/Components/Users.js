import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'
import { Modal, Button, Form } from 'react-bootstrap';

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
    showAddModal: false,
    showDeleteModal: false
  }

  async componentDidMount() {
    if(Auth.getRole() !== 'ADMIN') {
      this.props.history.push("/home");
    }

    UserService.getAllUsers().then(response => {
      this.setState({
        users: response.data,
        isLoading: false,
      })
    });
  }

  handleCloseAddModal = () => {
    this.setState({showAddModal: false});
  }

  handleShowAddModal = () => {
    this.setState({showAddModal: true});
  }

  handleCloseDeleteModal = () => {
    this.setState({showDeleteModal: false});
  }

  handleShowDeleteModal = () => {
    this.setState({showDeleteModal: true});
  }

  deleteUser = () => {
    if(this.state.userSelected) {
      this.handleShowDeleteModal();
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select a price reduction to edit"
      })
      this.alertElement.current.open();
    }
  }

  handleAddFormSubmit = (event) => {
    event.preventDefault();

    const user = Object.fromEntries(new FormData(event.target));

    UserService.addUser(user).then(response => {
      window.location.reload();
    }).catch(error => {
      if(error.response) {
        this.handleCloseAddModal();
        this.setState({errorMessage: error.response.data.message, errorType: 'danger'});
        this.alertElement.current.open();
      } else {
        this.handleCloseAddModal();
        this.setState({errorMessage: "Connection to the server failed", errorType: "danger"});
        this.alertElement.current.open();
      }
    });
  }

  handleDeleteSubmit = (event) => {
    event.preventDefault();
    this.handleCloseDeleteModal();
    UserService.removeUser(this.state.userSelected.username).then(response => {
      window.location.reload();
    }).catch(error => {
      if(error.response) {
        this.handleCloseDeleteModal();
        this.setState({errorMessage: error.response.data.message, errorType: 'danger'});
        this.alertElement.current.open();
      } else {
        this.handleCloseDeleteModal();
        this.setState({errorMessage: "Connection to the server failed", errorType: "danger"});
        this.alertElement.current.open();
      }
    });
  }

  renderDeleteModal() {
    if(this.state.userSelected) {
      return(<>The user '{this.state.userSelected.username}' will be removed. Do you want to procceed?</>);
    }
  }

  renderAddModal() {
    return (
      <Form onSubmit={this.handleAddFormSubmit} id="add-form">
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
    return this.state.isLoading ? this.renderLoadScreen() : this.renderLoginPage();
  }

  renderLoadScreen() {
    return <Spinner animation="grow" />;
  }

  renderLoginPage() {
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
            excludeActions={['edit']} 
            onAdd={this.handleShowAddModal}
            onDelete={this.deleteUser}
            />

            <Modal show={this.state.showAddModal} onHide={this.handleCloseAddModal} className="text-light" id="add-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Create user</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderAddModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseAddModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="add-form">Create user</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.showDeleteModal} onHide={this.handleCloseDeleteModal} className="text-light" id="delete-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Remove user</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderDeleteModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseDeleteModal}>Cancel</Button>
                <Button onClick={this.handleDeleteSubmit} variant="danger">Remove user</Button>
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