import React from "react";

import { Modal, Button, Form } from 'react-bootstrap';

import { selectFilter } from 'react-bootstrap-table2-filter';

import AppTable from './AppTable';

import ItemService from '../Service/ItemService';
import SupplierService from '../Service/SupplierService';

import AppAlert from './Alerts/AppAlert';

import './Articles.css';

class Articles extends React.Component {
  constructor(props){
    super(props);
    this.alertElement = React.createRef();
  }

  state = {
    isLoading: true,
    items: null,
    suppliers: [],
    itemSelected: null,
    showEditModal: false,
    showDeleteModal: false,
    showAddModal: false,
    showDeactivateModal: false,
    showDetailsModal: false,
    errorMessage: null,
    errorType: null,
    suppliersSelected: []
  }

  async componentDidMount() {
    ItemService.getAllItems().then(response => {
      this.setState({
        items: response.data,
        isLoading: false,
      })
    });

    SupplierService.getAllSuppliers().then(response => {
      this.setState({
        suppliers: response.data,
      })
    });
  }

  handleCloseModal = () => {
    this.setState({showModal: false, action: null, modalTitle: null, modalButtonText: null, suppliersSelected: []});
  }

  handleShowModal = () => {
    this.setState({showModal: true});
  }

  handleEditSuppliersChange = (event) => {
    const target = event.target;
    var value = target.value;
    if(target.checked){
        this.state.suppliersSelected.push(value);
    }else{
        const index = this.state.suppliersSelected.indexOf(value);
        if(index > -1) {
          this.state.suppliersSelected.splice(index, 1);
        }
    }
  }

  editItem = () => {
    if(this.state.itemSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Edit Item',
        modalButtonText: 'Edit Item',
        action: 'edit'
      });
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select an item to edit"
      })
      this.alertElement.current.open();
    }
  }

  deleteItem = () => {
    if(this.state.itemSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Remove Item',
        modalButtonText: 'Remove Item',
        action: 'remove'
      });
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select an item to remove"
      })
      this.alertElement.current.open();
    }
  }

  addItem = () => {
    this.handleShowModal();
    this.setState({
      modalTitle: 'Add Supplier',
      modalButtonText: 'Add Supplier',
      action: 'add'
    });
  }

  showDetails = () => {
    if(this.state.itemSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Item Details',
        modalButtonText: 'Item Details',
        action: 'details'
      });
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select an item to check its details"
      })
      this.alertElement.current.open();
    }
  }

  deactivateItem = () => {
    if(this.state.itemSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Deactivate Item',
        modalButtonText: 'Deactivate Item',
        action: 'deactivate'
      });
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select an item to deactivate"
      })
      this.alertElement.current.open();
    }
  }

  handleAction = (event) => {
    switch(event.target.getAttribute('action')) {
      case 'edit':
        this.editItem();
        break;
      case 'add':
        this.addItem();
        break;
      case 'remove':
        this.deleteItem();
        break;
      case 'deactivate':
        this.deactivateItem();
        break;
      case 'details':
        this.showDetails();
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
      case 'remove':
        this.handleDeleteSubmit();
        break;
      case 'deactivate':
        this.handleDeactivateSubmit();
        break;
      case 'details':
        break;
      default:
        console.log('Invalid action performed');
    }
  }

  handleEditSubmit = (event) => {
    event.preventDefault();
    const suppliersObjects = [];

    this.state.suppliers.forEach(supplier => {
      this.state.suppliersSelected.forEach(selectedSupplier => {
        if(selectedSupplier === supplier.name) {
          suppliersObjects.push(supplier);
        }
      });
    });

    const item = Object.fromEntries(new FormData(event.target));
    item.suppliers = suppliersObjects;

    ItemService.editItem(item).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleDeleteSubmit = (event) => {
    event.preventDefault();
    ItemService.removeItem(this.state.itemSelected.code).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleAddSubmit = (event) => {
    event.preventDefault();
    const suppliersObjects = [];

    this.state.suppliers.forEach(supplier => {
      this.state.suppliersSelected.forEach(selectedSupplier => {
        if(selectedSupplier === supplier.name) {
          suppliersObjects.push(supplier);
        }
      });
    });

    const item = Object.fromEntries(new FormData(event.target));
    item.suppliers = suppliersObjects;

    ItemService.addItem(item).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleDeactivateSubmit = (event) => {
    event.preventDefault();

    const deactivation = Object.fromEntries(new FormData(event.target));

    ItemService.deactivateItem(this.state.itemSelected, deactivation).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  renderEditModal() {
    if(this.state.itemSelected) {
      const isActive = this.state.itemSelected.state === "ACTIVE";

      return(
        <Form onSubmit={this.handleEditSubmit} id="items">
          <Form.Group controlId="editItemForm.code">
            <Form.Label>Item Code</Form.Label>
            <Form.Control type="text" defaultValue={this.state.itemSelected.code} placeholder={this.state.itemSelected.code} readOnly name="code"/>
          </Form.Group>
          <Form.Group controlId="editItemForm.price">
            <Form.Label>Item Price</Form.Label>
            <Form.Control type="number" defaultValue={this.state.itemSelected.price} name="price" step="0.01"/>
          </Form.Group>
          <Form.Group controlId="editItemForm.description">
            <Form.Label>Item Description</Form.Label>
            <Form.Control type="text" defaultValue={this.state.itemSelected.description} name="description"/>
          </Form.Group>
          <Form.Group controlId="editItemForm.state">
            <Form.Label>Item State</Form.Label>
            <Form.Control as="select" name="state">
              {isActive ?
                  (<>
                  <option selected>ACTIVE</option>
                  <option>DISCONTINUED</option>
                  </>)
                  :
                  (<>
                  <option>ACTIVE</option>
                  <option selected>DISCONTINUED</option>
                  </>)
              }
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editItemForm.creationDate">
            <Form.Label>Item Creation Date</Form.Label>
            <Form.Control type="datetime-local" defaultValue={this.state.itemSelected.creationDate} name="creationDate"/>
          </Form.Group>

          <Form.Group controlId="editItemForm.suppliers">
            <Form.Label>Item Suppliers</Form.Label>
            {this.state.suppliers.map((supplier, i) => {
                  if(this.state.itemSelected.suppliers.length < 1) {
                    return  (<Form.Check type={'checkbox'} id={i + '-check'} label={supplier.name} onChange={this.handleEditSuppliersChange} value={supplier.name} name="suppliers"/>);
                  }

                  const result = this.state.itemSelected.suppliers.map((itemSupplier) => {
                    if(itemSupplier.name === supplier.name) {
                      return (<Form.Check type={'checkbox'} id={i + '-check'} label={supplier.name} checked disabled onChange={this.handleEditSuppliersChange} value={supplier.name} name="suppliers"/>);
                    } else {
                      return (<Form.Check type={'checkbox'} id={i + '-check'} label={supplier.name} onChange={this.handleEditSuppliersChange} value={supplier.name} name="suppliers"/>);
                    }
                  });
                  return result;
              })}
          </Form.Group>
        </Form>
      );
    }
  }

  renderAddModal() {
    const date = new Date();
    return(
      <Form onSubmit={this.handleAddSubmit} id="items">
        <Form.Group controlId="addItemForm.code">
          <Form.Label>Item Code</Form.Label>
          <Form.Control type="text" placeholder="i.e 123456789" name="code"/>
        </Form.Group>
        <Form.Group controlId="addItemForm.price">
            <Form.Label>Item Price</Form.Label>
            <Form.Control type="number" placeholder="i.e 15,3 or 15.3" name="price" step=".01"/>
          </Form.Group>
        <Form.Group controlId="addItemForm.description">
          <Form.Label>Item Description</Form.Label>
          <Form.Control type="text" placeholder="i.e White comfy chair" name="description"/>
        </Form.Group>
        <Form.Group controlId="addItemForm.state">
          <Form.Label>Item State</Form.Label>
          <Form.Control as="select" name="state">
              <option selected>ACTIVE</option>
              <option>DISCONTINUED</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="addItemForm.creationDate">
          <Form.Label>Item Creation Date</Form.Label>
          <Form.Control type="datetime-local" defaultValue={date.toISOString().split('Z')[0]} name="creationDate"/>
        </Form.Group>

        <Form.Group controlId="addItemForm.suppliers">
          <Form.Label>Item Suppliers</Form.Label>
          {this.state.suppliers.map((supplier, i) => {
            return <Form.Check type={'checkbox'} id={i + '-check'} label={supplier.name} onChange={this.handleEditSuppliersChange} value={supplier.name} name="suppliers"/>;    
          })}
        </Form.Group>
      </Form>
    );
  }

  renderDetailsModal() {
    if(!this.state.itemSelected) {
      return null;
    }
    return (
      <Form id="items">
        <Form.Group controlId="detailsItemForm.code">
          <Form.Label>Item Code</Form.Label>
          <Form.Control type="text" defaultValue={this.state.itemSelected.code} placeholder={this.state.itemSelected.code} readOnly />
        </Form.Group>
        <Form.Group controlId="detailsItemForm.price">
          <Form.Label>Item Price</Form.Label>
          <Form.Control type="number" defaultValue={this.state.itemSelected.price} readOnly />
        </Form.Group>
        <Form.Group controlId="detailsItemForm.description">
          <Form.Label>Item Description</Form.Label>
          <Form.Control type="text" defaultValue={this.state.itemSelected.description} readOnly />
        </Form.Group>
        <Form.Group controlId="detailsItemForm.state">
          <Form.Label>Item State</Form.Label>
          <Form.Control type="text" defaultValue={this.state.itemSelected.state} readOnly />
        </Form.Group>
        <Form.Group controlId="detailsItemForm.creationDate">
          <Form.Label>Item Creation Date</Form.Label>
          <Form.Control type="datetime-local" defaultValue={this.state.itemSelected.creationDate} readOnly/>
        </Form.Group>
        <Form.Group controlId="detailsItemForm.suppliers">
          <Form.Label>Item Suppliers</Form.Label>
          <Form.Control as="select" multiple>
            {this.state.itemSelected.suppliers.map(supplier => {
            return <option>{supplier.name} ({supplier.country})</option>
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="detailsItemForm.priceReductions">
          <Form.Label>Item Price Reductions</Form.Label>
          <Form.Control as="select" multiple>
            {this.state.itemSelected.priceReductions.map(priceReduction => {
            return <option>{priceReduction.code} | {priceReduction.amountDeducted}€ | ({priceReduction.startDate} - {priceReduction.endDate})</option>
            })}
          </Form.Control>
        </Form.Group>
      </Form>
    );
  }

  renderDeleteModal() {
    if(this.state.itemSelected) {
      return(<Form onSubmit={this.handleDeleteSubmit} id="items">The item {this.state.itemSelected.code} will be removed. Do you want to procceed?</Form>);
    }
  }

  renderDeactivateModal() {
    if(this.state.itemSelected) {
      return (
        <Form onSubmit={this.handleDeactivateSubmit} id="items">
          <Form.Group controlId="deactivateItemForm.reason">
            <Form.Label>Deactivation Reason</Form.Label>
            <Form.Control type="text" placeholder="i.e Not affordable to sell due to its low demand right now" name="deactivationReason" />
          </Form.Group>
        </Form>
      );
    }
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
      case 'remove':
        return this.renderDeleteModal();
      case 'deactivate':
        return this.renderDeactivateModal();
      case 'details':
        return this.renderDetailsModal();
      default:
        return null;
    }
  }

  render(){
    return this.state.isLoading ? null : this.renderPage();
  }

  renderPage() {
    const filterStateOptions = {
      'ACTIVE': 'ACTIVE',
      'DISCONTINUED': 'DISCONTINUED'
    };

    const columns = [{
      dataField: 'code',
      text: 'Item Code',
      sort: true
    }, {
      dataField: 'price',
      text: 'Item Price',
      sort: true
    }, {
      dataField: 'description',
      text: 'Item Description',
      sort: true
    }, {
      dataField: 'state',
      text: 'Item State',
      sort: true,
      formatter: cell => filterStateOptions[cell],
      filter: selectFilter({
        options: filterStateOptions
      })
    }, {
      dataField: 'creationDate',
      text: 'Item Creation Date',
      sort: true
    }, {
      dataField: 'creator.username',
      text: 'Item Creator',
      sort: true
    }];

    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, event) => {
        this.setState({
          itemSelected: row
        })
      }
    };

    const toolbarPermissions = {
      add: ['USER', 'ADMIN'],
      edit: ['USER', 'ADMIN'],
      delete: ['ADMIN']
    };

    return (
      <div className="articles-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable 
            id={'code'} 
            elements={this.state.items} 
            columns={columns} 
            selection={selectRow} 
            elementName={'item'}
            onEdit={this.handleAction}
            onDelete={this.handleAction}
            onAdd={this.handleAction}
            onDetails={this.showDetails}
            onDeactivate={this.deactivateItem}
            visibleByRoles={toolbarPermissions} 
            filterOptions={filterStateOptions}
            />
          </div>
        </div>

        <Modal show={this.state.showModal} onHide={this.handleCloseModal} className="text-light" id="users-modal">
          <Modal.Header closeButton className="bg-dark">
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            {this.renderModalBody()}
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={this.handleCloseModal}>Cancel</Button>
            {this.state.action !== 'details' ? <Button type="submit" variant="primary" form="items">{this.state.modalButtonText}</Button> : null}
          </Modal.Footer>
        </Modal>

        <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
      </div>
    );
  }
}

export default Articles;