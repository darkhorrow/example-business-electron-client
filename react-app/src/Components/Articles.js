import React from "react";

import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'
import { Modal, Button, Form } from 'react-bootstrap';

import ItemService from '../Service/ItemService';
import SupplierService from '../Service/SupplierService';
import PriceReductionService from '../Service/PriceReductionService';

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
    suppliers: null,
    priceReductions: null,
    itemSelected: null,
    showEditModal: false,
    showDeleteModal: false,
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

    PriceReductionService.getAllPriceReduction().then(response => {
      this.setState({
        priceReductions: response.data,
      })
    });
  }

  editItem = () => {
    if(this.state.itemSelected) {
      this.handleShowEdit();
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
      this.handleShowDelete();
    } else {
      this.setState({
        errorType: "warning",
        errorMessage: "Select an item to remove"
      })
      this.alertElement.current.open();
    }
  }

  handleCloseEdit = () => {
    this.setState({suppliersSelected: []});
    this.setState({showEditModal: false});
  }

  handleCloseDelete = () => {
    this.setState({showDeleteModal: false});
  }

  handleShowEdit() {
    this.setState({showEditModal: true});
  }

  handleShowDelete() {
    this.setState({showDeleteModal: true});
  }

  renderEditModal() {
    if(this.state.itemSelected) {
      const date = new Date(Date.parse(this.state.itemSelected.creationDate));
      const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
      const isActive = this.state.itemSelected.state === "ACTIVE";

      return(
        <Form onSubmit={this.handleEditSubmit} id="edit-form">
          <Form.Group controlId="editItemForm.code">
            <Form.Label>Item Code</Form.Label>
            <Form.Control type="text" defaultValue={this.state.itemSelected.code} placeholder={this.state.itemSelected.code} readOnly name="code"/>
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
            <Form.Control type="date" defaultValue={dateString} name="creationDate"/>
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

  renderDeleteModal() {
    if(this.state.itemSelected) {
      return(<>The item {this.state.itemSelected.code} will be removed. Do you want to procceed?</>);
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
    item.priceReductions = this.state.itemSelected.priceReductions;
    item.suppliers = suppliersObjects;
    item.creationDate += 'T' + this.state.itemSelected.creationDate.split('T')[1];

    ItemService.editItem(item).then(response => {
      this.setState({errorMessage: 'The item was edited successfully', errorType: 'success'});
      this.alertElement.current.open();
      this.handleCloseEdit();
      window.location.reload();
    }).catch(error => {
      if(error.response) {
        this.handleCloseDelete();
        this.setState({errorMessage: error.response.data.message, errorType: 'danger'});
        this.alertElement.current.open();
      } else {
        this.handleCloseDelete();
        this.setState({errorMessage: "Connection to the server failed", errorType: "danger"});
        this.alertElement.current.open();
      }
    });
  }

  handleDeleteSubmit = (event) => {
    event.preventDefault();
    this.handleCloseDelete();
    ItemService.removeItem(this.state.itemSelected.code).then(response => {
      this.setState({errorMessage: 'The item was removed successfully', errorType: 'success'});
      this.alertElement.current.open();
    }).catch(error => {
      if(error.response) {
        this.handleCloseDelete();
        this.setState({errorMessage: error.response.data.message, errorType: 'danger'});
        this.alertElement.current.open();
      } else {
        this.handleCloseDelete();
        this.setState({errorMessage: "Connection to the server failed", errorType: "danger"});
        this.alertElement.current.open();
      }
    });
  }

  render(){
    return this.state.isLoading ? this.renderLoadScreen() : this.renderLoginPage();
  }

  renderLoadScreen() {
    return <Spinner animation="grow" />;
  }

  renderLoginPage() {
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
      sort: true
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
            onEdit={this.editItem}
            onDelete={this.deleteItem}
            />
          </div>
        </div>
        <Modal show={this.state.showEditModal} onHide={this.handleCloseEdit} className="text-light" id="edit-modal">
          <Modal.Header closeButton className="bg-dark">
          <Modal.Title>Edit item</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            {this.renderEditModal()}
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={this.handleCloseEdit}>Cancel</Button>
            <Button type="submit" variant="primary" form="edit-form">Edit item</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showDeleteModal} onHide={this.handleCloseDelete} className="text-light" id="delete-modal">
          <Modal.Header closeButton className="bg-dark">
          <Modal.Title>Remove item</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            {this.renderDeleteModal()}
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={this.handleCloseDelete}>Cancel</Button>
            <Button onClick={this.handleDeleteSubmit} variant="danger">Remove item</Button>
          </Modal.Footer>
        </Modal>
        <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
      </div>
    );
  }
}

export default Articles;