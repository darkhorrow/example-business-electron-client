import React from "react";

import axios from 'axios';
import AppTable from './AppTable';

import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteRight, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'

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
    return (
      <div className="container mt-5">
        <div className="row-fluid py-5">
          <AppTable elements={this.state.items} />
        </div>
      </div>
      
    );
  }
}

export default Articles;