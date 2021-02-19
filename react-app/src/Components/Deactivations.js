import React from "react";

import axios from 'axios';

import AppTable from './AppTable';

import Auth from '../Security/Auth';

import './Deactivations.css';

class Deactivations extends React.Component {

  state = {
    isLoading: true,
    deactivations: null
  }

  async componentDidMount() {
    if(Auth.getRole() !== 'ADMIN') {
      this.props.history.push("/home");
    }

    axios.get('http://localhost:8080/deactivations').then(response => {
        this.setState({
            deactivations: response.data,
            isLoading: false
        });
    });
  }

  render(){
    return this.state.isLoading ? null : this.renderPage();
  }

  renderPage() {
    const columns = [{
      dataField: 'deactivationReason',
      text: 'Deactivation Reason',
      sort: true
    }, {
      dataField: 'creator.username',
      text: 'Deactivation Creator',
      sort: true
    }];

    return (
      <div className="deactivations-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable 
            id={'deactivationReason'} 
            elements={this.state.deactivations} 
            columns={columns} 
            elementName={'deactivation'} 
            excludeActions={['add', 'edit', 'delete', 'details']} />
          </div>
        </div>
      </div>
    );
  }
}

export default Deactivations;