import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'

import './Articles.css';

class Articles extends React.Component {

  state = {
    isLoading: true,
    items: null
  }

  async componentDidMount() {
    axios.get('http://localhost:8080/items').then(response => {
        this.setState({
            items: response.data,
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
      dataField: 'price',
      text: 'Item Price',
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
      clickToSelect: true
    };

    return (
      <div className="articles-dark container-fluid pt-5">
        <div className="row-fluid py-5">
          <AppTable id={'code'} elements={this.state.items} columns={columns} selection={selectRow} elementName={'item'}/>
        </div>
      </div>
    );
  }
}

export default Articles;