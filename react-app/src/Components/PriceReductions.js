import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'
import { Modal, Button, Form } from 'react-bootstrap';

import PriceReductionService from '../Service/PriceReductionService';
import ItemService from '../Service/ItemService';

import AppAlert from './Alerts/AppAlert';

import './PriceReductions.css';

class PriceReductions extends React.Component {
  constructor(props){
    super(props);
    this.alertElement = React.createRef();
  }

  state = {
    isLoading: true,
    priceReductions: null,
    showAddModal: false,
    items: [],
    itemSelected: null,
    errorMessage: null,
    errorType: null
  }

  async componentDidMount() {
    PriceReductionService.getAllPriceReduction().then(response => {
      this.setState({
        priceReductions: response.data,
        isLoading: false,
      })
    });

    ItemService.getAllItems().then(response => {
      this.setState({
        items: response.data
      })
    });
  }

  handleCloseAddModal = () => {
    this.setState({showAddModal: false});
  }

  handleShowAddModal = () => {
    this.setState({showAddModal: true});
  }

  handleItemChange = (event) => {
    const itemCode = event.target.value;
    this.setState({itemSelected: itemCode});
  }

  handleAddFormSubmit = (event) => {
    event.preventDefault();

    const priceReduction = Object.fromEntries(new FormData(event.target));

    this.state.items.forEach(item => {
      if(item.code === Number(this.state.itemSelected)) {
        priceReduction.item = item;
      }
    });

    PriceReductionService.addPriceReduction(priceReduction).then(response => {
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

  renderAddModal() {
    const date = new Date();

    return (
      <Form onSubmit={this.handleAddFormSubmit} id="add-form">
        <Form.Group controlId="priceReduction.code">
          <Form.Label>Price Reduction Code</Form.Label>
          <Form.Control type="text" placeholder="i.e 123456789" name="code"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.amountDeducted">
            <Form.Label>Price Reduction Amount Deducted</Form.Label>
            <Form.Control type="number" placeholder="i.e 15,3 or 15.3" name="amountDeducted" step="any"/>
          </Form.Group>
        <Form.Group controlId="priceReduction.startDate">
          <Form.Label>Price Reduction Start Date</Form.Label>
          <Form.Control type="datetime-local" defaultValue={date.toISOString().split('Z')[0]} name="startDate" step="any"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.endDate">
          <Form.Label>Price Reduction End Date</Form.Label>
          <Form.Control type="datetime-local" name="endDate" step="any"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.items">
          <Form.Label>Item Associated</Form.Label>
          {this.state.items.map((item, i) => {
            return <Form.Check type={'radio'} id={i + '-radio'} label={item.code + ' [' + item.description + ']'} onChange={this.handleItemChange} value={item.code} name="item"/>;    
          })}
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
      dataField: 'code',
      text: 'Price Reduction Code',
      sort: true
    }, {
      dataField: 'amountDeducted',
      text: 'Price Reduction Amount Deducted',
      sort: true
    }, {
      dataField: 'startDate',
      text: 'Price Reduction Start Date',
      sort: true
    }, {
      dataField: 'endDate',
      text: 'Price Reduction End Date',
      sort: true
    }
    ];

    const selectRow = {
      mode: 'radio',
      clickToSelect: true
    };

    return (
      <div className="price-reductions-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable 
            id={'code'} 
            elements={this.state.priceReductions} 
            columns={columns} 
            selection={selectRow} 
            elementName={'price reduction'} 
            excludeActions={['delete']}
            onAdd={this.handleShowAddModal}
            />

            <Modal show={this.state.showAddModal} onHide={this.handleCloseAddModal} className="text-light" id="add-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Create item</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderAddModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseAddModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="add-form">Create item</Button>
              </Modal.Footer>
            </Modal>

            <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
          </div>
        </div>
      </div>
    );
  }
}

export default PriceReductions;