import React from "react";

import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'
import { Modal, Button, Form } from 'react-bootstrap';

import SupplierService from '../Service/SupplierService';

import AppAlert from './Alerts/AppAlert';

import './Suppliers.css';

class Suppliers extends React.Component {
  constructor(props){
    super(props);
    this.alertElement = React.createRef();
  }

  state = {
    isLoading: true,
    suppliers: null,
    supplierSelected: null,
  }

  async componentDidMount() {
    SupplierService.getAllSuppliers().then(response => {
      this.setState({
        suppliers: response.data,
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

  handleCloseEditModal = () => {
    this.setState({showEditModal: false});
  }

  handleShowEditModal = () => {
    this.setState({showEditModal: true});
  }

  handleItemChange = (event) => {
    this.setState({itemSelected: event.target.value});
  }

  handleAddFormSubmit = (event) => {
    event.preventDefault();

    const supplier = Object.fromEntries(new FormData(event.target));

    SupplierService.addSupplier(supplier).then(response => {
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

  handleEditFormSubmit = (event) => {
    event.preventDefault();

    const supplier = Object.fromEntries(new FormData(event.target));

    SupplierService.editSupplier(supplier).then(response => {
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

  editPriceReduction = () => {
    if(this.state.supplierSelected) {
      this.handleShowEditModal();
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select a price reduction to edit"
      })
      this.alertElement.current.open();
    }
  }

  renderAddModal() {
    return (
      <Form onSubmit={this.handleAddFormSubmit} id="add-form">
        <Form.Group controlId="supplier.name">
          <Form.Label>Supplier Name</Form.Label>
          <Form.Control type="text" placeholder="i.e Example Provider S.L" name="name" />
        </Form.Group>
        <Form.Group controlId="supplier.country">
          <Form.Label>Supplier Country</Form.Label>
          <Form.Control type="text" placeholder="i.e ES, Spain, uk..." name="country" />
        </Form.Group>
      </Form>
    );
  }

  renderEditModal() {
    if(!this.state.supplierSelected) {
      return null;
    }

    return (
      <Form onSubmit={this.handleEditFormSubmit} id="edit-form">
        <Form.Group controlId="supplier.name">
          <Form.Label>Supplier Name</Form.Label>
          <Form.Control type="text" placeholder="i.e Example Provider S.L" defaultValue={this.state.supplierSelected.name} readOnly name="name" />
        </Form.Group>
        <Form.Group controlId="supplier.country">
          <Form.Label>Supplier Country</Form.Label>
          <Form.Control type="text" placeholder="i.e ES, Spain, uk..." defaultValue={this.state.supplierSelected.country} name="country" />
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
      dataField: 'name',
      text: 'Supplier name',
      sort: true
    }, {
      dataField: 'country',
      text: 'Supplier Country',
      sort: true
    }];

    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, event) => {
        this.setState({
          supplierSelected: row
        })
      }
    };

    return (
      <div className="suppliers-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable 
            id={'name'} 
            elements={this.state.suppliers} 
            columns={columns} 
            selection={selectRow} 
            elementName={'supplier'} 
            excludeActions={['delete', 'details']} 
            onAdd={this.handleShowAddModal} 
            onEdit={this.editPriceReduction} 
            />

            <Modal show={this.state.showAddModal} onHide={this.handleCloseAddModal} className="text-light" id="add-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Create supplier</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderAddModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseAddModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="add-form">Create supplier</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.showEditModal} onHide={this.handleCloseEditModal} className="text-light" id="edit-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Edit supplier</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderEditModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseEditModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="edit-form">Edit supplier</Button>
              </Modal.Footer>
            </Modal>

            <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Suppliers;