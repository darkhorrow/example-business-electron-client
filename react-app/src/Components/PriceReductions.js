import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'

import './PriceReductions.css';

class PriceReductions extends React.Component {

  state = {
    isLoading: true,
    items: null
  }

  async componentDidMount() {
    axios.get('http://localhost:8080/price-reductions').then(response => {
        this.setState({
            priceReductions: response.data,
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
            <AppTable id={'code'} elements={this.state.priceReductions} columns={columns} selection={selectRow} elementName={'price reduction'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default PriceReductions;