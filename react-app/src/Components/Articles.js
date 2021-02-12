import React from "react";

import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'
import { Modal, Button, Form } from 'react-bootstrap';

import ItemService from '../Service/ItemService';
import './Articles.css';

class Articles extends React.Component {

  state = {
    isLoading: true,
    items: null,
    itemSelected: null
  }

  async componentDidMount() {
    ItemService.getAllItems().then(response => {
      this.setState({
        items: response.data,
        isLoading: false,
        showEditModal: false
      })
    });
  }

  editItem = () => {
    this.handleShowEdit();
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
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Item Code</Form.Label>
            <Form.Control type="text" placeholder={this.state.itemSelected.code} readOnly />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect3">
            <Form.Label>Item Description</Form.Label>
            <Form.Control type="text" defaultValue={this.state.itemSelected.description}/>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Item State</Form.Label>
            <Form.Control as="select">
              <option>ACTIVE</option>
              <option>DISCONTINUED</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label>Item Code</Form.Label>
            <Form.Control type="date" defaultValue={dateString} />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Example multiple select</Form.Label>
            <Form.Control as="select" multiple>

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
            <Button variant="primary">Log out</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Articles;