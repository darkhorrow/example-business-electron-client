import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'

import './Suppliers.css';

class Suppliers extends React.Component {

  state = {
    isLoading: true,
    items: null
  }

  async componentDidMount() {
    axios.get('http://localhost:8080/suppliers').then(response => {
        this.setState({
            suppliers: response.data,
            isLoading: false
        });
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
      clickToSelect: true
    };

    return (
      <div className="suppliers-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable id={'name'} elements={this.state.suppliers} columns={columns} selection={selectRow} elementName={'supplier'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Suppliers;