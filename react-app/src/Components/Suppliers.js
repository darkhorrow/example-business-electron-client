import React from "react";

import { Modal, Button, Form } from 'react-bootstrap';

import AppTable from './AppTable';

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
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleCloseModal = () => {
    this.setState({showModal: false, itemSelected: null, action: null, modalTitle: null, modalButtonText: null});
  }

  handleShowModal = () => {
    this.setState({showModal: true});
  }

  handleItemChange = (event) => {
    this.setState({itemSelected: event.target.value});
  }

  editSupplier() {
    if(this.state.supplierSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Edit Supplier',
        modalButtonText: 'Edit Supplier',
        action: 'edit'
      });
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select a user to remove"
      });
      this.alertElement.current.open();
    }
  }

  addSupplier() {
    this.handleShowModal();
    this.setState({
      modalTitle: 'Create Supplier',
      modalButtonText: 'Create Supplier',
      action: 'add'
    });
  }

  handleAction = (event) => {
    switch(event.target.getAttribute('action')) {
      case 'edit':
        this.editSupplier();
        break;
      case 'add':
        this.addSupplier();
        break;
      default:
        console.log('Invalid action performed');
    }
  }

  handleSubmit = (event) => {
    switch(this.state.action) {
      case 'edit':
        this.handleEditFormSubmit(event);
        break;
      case 'add':
        this.handleAddFormSubmit(event);
        break;
      default:
        console.log('Invalid action performed');
    }
  }

  handleAddFormSubmit = (event) => {
    event.preventDefault();

    const supplier = Object.fromEntries(new FormData(event.target));

    SupplierService.addSupplier(supplier).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleEditFormSubmit = (event) => {
    event.preventDefault();

    const supplier = Object.fromEntries(new FormData(event.target));

    SupplierService.editSupplier(supplier).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  renderAddModal() {
    return (
      <Form onSubmit={this.handleAddFormSubmit} id="priceReductions">
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
      <Form onSubmit={this.handleEditFormSubmit} id="priceReductions">
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
      case 'edit':
        return this.renderEditModal();
      default:
        return null;
    }
  }

  render(){
    return this.state.isLoading ? null : this.renderPage();
  }

  renderPage() {
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
            onAdd={this.handleAction} 
            onEdit={this.handleAction} 
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
                <Button type="submit" variant="primary" form="priceReductions">{this.state.modalButtonText}</Button>
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