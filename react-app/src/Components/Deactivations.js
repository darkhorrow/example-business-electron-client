import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'

import './Deactivations.css';

class Users extends React.Component {

  state = {
    isLoading: true,
    deactivations: null
  }

  async componentDidMount() {
    axios.get('http://localhost:8080/deactivations').then(response => {
        console.log(response);
        this.setState({
            deactivations: response.data,
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
      dataField: 'deactivationReason',
      text: 'Deactivation Reason',
      sort: true
    }, {
      dataField: 'creator.username',
      text: 'Deactivation Creator',
      sort: true
    }];

    const selectRow = {
      mode: 'radio',
      clickToSelect: true
    };

    return (
      <div className="deactivations-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable id={'deactivationReason'} elements={this.state.deactivations} columns={columns} selection={selectRow} elementName={'deactivation'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;