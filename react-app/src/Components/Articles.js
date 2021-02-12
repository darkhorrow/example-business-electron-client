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
    errorMessage: null,
    errorType: null
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

  handleCloseEdit = () => {
    this.setState({showEditModal: false});
  }

  handleShowEdit() {
    this.setState({showEditModal: true});
  }

  renderEditModal() {
    if(this.state.itemSelected) {
      const date = new Date(Date.parse(this.state.itemSelected.creationDate));
      const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
      return(
        <Form>
          <Form.Group controlId="editItemForm.code">
            <Form.Label>Item Code</Form.Label>
            <Form.Control type="text" placeholder={this.state.itemSelected.code} readOnly />
          </Form.Group>
          <Form.Group controlId="editItemForm.description">
            <Form.Label>Item Description</Form.Label>
            <Form.Control type="text" defaultValue={this.state.itemSelected.description}/>
          </Form.Group>
          <Form.Group controlId="editItemForm.state">
            <Form.Label>Item State</Form.Label>
            <Form.Control as="select">
              <option>ACTIVE</option>
              <option>DISCONTINUED</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editItemForm.creationDate">
            <Form.Label>Item Creation Date</Form.Label>
            <Form.Control type="date" defaultValue={dateString} />
          </Form.Group>
          <Form.Group controlId="editItemForm.suppliers">
            <Form.Label>Item Suppliers</Form.Label>
            <Form.Control as="select" multiple>
              {this.state.suppliers.map((supplier, i) => {
                  if(this.state.itemSelected.suppliers.length < 1) {
                    return <option key={'s'+i} >{supplier.name}</option>
                  }

                  const result = this.state.itemSelected.suppliers.map((itemSupplier) => {
                    if(itemSupplier.name === supplier.name) {
                      return <option key={'s'+i} selected>{supplier.name}</option>
                    } else {
                      return <option key={'s'+i} >{supplier.name}</option>
                    }
                  });
                  return result;
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editItemForm.priceReductions">
            <Form.Label>Item Price Reductions</Form.Label>
            <Form.Control as="select" multiple>
              {this.state.priceReductions.map((priceReduction, i) => {
                  if(this.state.itemSelected.priceReductions.length < 1) {
                    return <option key={'pr'+i} >{priceReduction.code}</option>
                  }

                  const result = this.state.itemSelected.priceReductions.map((itemPriceReduction) => {
                    if(itemPriceReduction.code === priceReduction.code) {
                      return <option key={'pr'+i} selected>{priceReduction.code}</option>
                    } else {
                      return <option key={'pr'+i} >{priceReduction.code}</option>
                    }
                  });
                  return result;
              })}
            </Form.Control>
          </Form.Group>
        </Form>
      );
    }
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
            <Button variant="primary">Edit item</Button>
          </Modal.Footer>
        </Modal>
        <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
      </div>
    );
  }
}

export default Articles;