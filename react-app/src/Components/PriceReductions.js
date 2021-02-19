import React from "react";

import { Modal, Button, Form } from 'react-bootstrap';

import AppTable from './AppTable';

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
    showModal: false,
    action: null,
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
    }).catch(error => {
      this.renderAlert(error.response);
    });

    ItemService.getAllItems().then(response => {
      this.setState({
        items: response.data
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

  editPriceReduction() {
    if(this.state.priceReductionSelected) {
      this.handleShowModal();
      this.setState({
        modalTitle: 'Edit Price Reduction',
        modalButtonText: 'Edit Price Reduction',
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

  addPriceReduction() {
    this.handleShowModal();
    this.setState({
      modalTitle: 'Create Price Reduction',
      modalButtonText: 'Create Price Reduction',
      action: 'add'
    });
  }

  handleAction = (event) => {
    switch(event.target.getAttribute('action')) {
      case 'edit':
        this.editPriceReduction();
        break;
      case 'add':
        this.addPriceReduction();
        break;
      default:
        console.log('Invalid action performed');
    }
  }

  handleSubmit = (event) => {
    switch(this.state.action) {
      case 'edit':
        this.handleDeleteSubmit(event);
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

    const priceReduction = Object.fromEntries(new FormData(event.target));

    this.state.items.forEach(item => {
      if(item.code === Number(this.state.itemSelected)) {
        priceReduction.item = item;
      }
    });

    PriceReductionService.addPriceReduction(priceReduction).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  handleEditFormSubmit = (event) => {
    event.preventDefault();

    const priceReduction = Object.fromEntries(new FormData(event.target));

    this.state.items.forEach(item => {
      if(item.code === Number(priceReduction.item)) {
        priceReduction.item = item;
      }
    });

    PriceReductionService.editPriceReduction(priceReduction).then(response => {
      window.location.reload();
    }).catch(error => {
      this.renderAlert(error.response);
    });
  }

  renderAddModal() {
    const date = new Date();

    return (
      <Form onSubmit={this.handleAddFormSubmit} id="priceReductions">
        <Form.Group controlId="priceReduction.code">
          <Form.Label>Price Reduction Code</Form.Label>
          <Form.Control type="text" placeholder="i.e 123456789" name="code"/>
        </Form.Group>
        <Form.Group controlId="priceReduction.amountDeducted">
            <Form.Label>Price Reduction Amount Deducted</Form.Label>
            <Form.Control type="number" placeholder="i.e 15,3 or 15.3" name="amountDeducted" step="0.01"/>
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
    if(!this.state.priceReductionSelected) {
      return null;
    }

    return (
      <Form onSubmit={this.handleEditFormSubmit} id="priceReductions">
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
          <Form.Control type="datetime-local" name="startDate" defaultValue={this.state.priceReductionSelected.startDate} step="any"/>
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

export default PriceReductions;