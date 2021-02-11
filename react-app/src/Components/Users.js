import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'

import './Users.css';

class Users extends React.Component {

  state = {
    isLoading: true,
    items: null
  }

  async componentDidMount() {
    axios.get('http://localhost:8080/users').then(response => {
        console.log(response);
        this.setState({
            users: response.data,
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
      dataField: 'username',
      text: 'User username',
      sort: true
    }, {
      dataField: 'role',
      text: 'User Role',
      sort: true
    }];

    const selectRow = {
      mode: 'radio',
      clickToSelect: true
    };

    return (
      <div className="users-dark pt-5">
        <div className="container">
          <div className="row-fluid py-5">
            <AppTable id={'username'} elements={this.state.users} columns={columns} selection={selectRow} elementName={'user'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;