import React from "react";

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
    priceReductionSelected: null,
    priceReductions: null,
    showAddModal: false,
    showEditModal: false,
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
    this.setState({showAddModal: false, itemSelected: null});
  }

  handleShowAddModal = () => {
    this.setState({showAddModal: true});
  }

  handleCloseEditModal = () => {
    this.setState({showEditModal: false, itemSelected: null});
  }

  handleShowEditModal = () => {
    this.setState({showEditModal: true});
  }

  handleItemChange = (event) => {
    this.setState({itemSelected: event.target.value});
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

  handleEditFormSubmit = (event) => {
    event.preventDefault();

    const priceReduction = Object.fromEntries(new FormData(event.target));

    this.state.items.forEach(item => {
      if(item.code === Number(this.state.itemSelected)) {
        priceReduction.item = item;
      }
    });

    PriceReductionService.editPriceReduction(priceReduction).then(response => {
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
    if(this.state.priceReductionSelected) {
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
            return <Form.Check type={'radio'} key={i + '-radio'} id={i + '-radio'} label={item.code + ' [' + item.description + ']'} onChange={this.handleItemChange} value={item.code} name="item"/>;    
          })}
        </Form.Group>
      </Form>
    );
  }

  renderEditModal() {
    const date = new Date();
    if(!this.state.priceReductionSelected) {
      return null;
    }

    return (
      <Form onSubmit={this.handleEditFormSubmit} id="edit-form">
        <Form.Group controlId="priceReduction.code">
          <Form.Label>Price Reduction Code</Form.Label>
          <Form.Control type="text" placeholder="i.e 123456789" defaultValue={this.state.priceReductionSelected.code} readOnly name="code"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.amountDeducted">
            <Form.Label>Price Reduction Amount Deducted</Form.Label>
            <Form.Control type="number" placeholder="i.e 15,3 or 15.3" defaultValue={this.state.priceReductionSelected.amountDeducted} name="amountDeducted" step="any"/>
          </Form.Group>
        <Form.Group controlId="priceReduction.startDate">
          <Form.Label>Price Reduction Start Date</Form.Label>
          <Form.Control type="datetime-local" defaultValue={date.toISOString().split('Z')[0]} name="startDate" defaultValue={this.state.priceReductionSelected.startDate} step="any"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.endDate">
          <Form.Label>Price Reduction End Date</Form.Label>
          <Form.Control type="datetime-local" name="endDate" defaultValue={this.state.priceReductionSelected.endDate} step="any"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.items">
          <Form.Label>Item Associated</Form.Label>
          {this.state.items.map((item, i) => {
              var result = null;
              item.priceReductions.forEach((priceReduction) => {
                if(priceReduction.code === this.state.priceReductionSelected.code) {
                  result = item;
                }
              });
              if(result) {
                return  <Form.Check type={'radio'} key={i + '-radio'} id={i + '-radio'} label={result.code + ' [' + result.description + ']'} onChange={this.handleItemChange} defaultChecked={true} value={result.code} name="item"/>;
              } else {
                return  <Form.Check type={'radio'} key={i + '-radio'} id={i + '-radio'} label={item.code + ' [' + item.description + ']'} onChange={this.handleItemChange} value={item.code} name="item"/>;
              }
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
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, event) => {
        this.setState({
          priceReductionSelected: row
        })
      }
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
            onEdit={this.editPriceReduction}
            />

            <Modal show={this.state.showAddModal} onHide={this.handleCloseAddModal} className="text-light" id="add-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Create price reduction</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderAddModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseAddModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="add-form">Create price reduction</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.showEditModal} onHide={this.handleCloseEditModal} className="text-light" id="edit-modal">
              <Modal.Header closeButton className="bg-dark">
              <Modal.Title>Edit price reduction</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark">
                {this.renderEditModal()}
              </Modal.Body>
              <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={this.handleCloseEditModal}>Cancel</Button>
                <Button type="submit" variant="primary" form="edit-form">Edit price reduction</Button>
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