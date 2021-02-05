import React from "react";

import axios from 'axios';

import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import './Home.css';

class Home extends React.Component {

  state = {
    isLoading: true,
    username: "",
    password: ""
  }

  async componentDidMount() {
    this.setState({
      isLoading: false
    });
  }

  render(){
    const {isLoading} = this.state;

    return isLoading ? this.renderLoadScreen() : this.renderLoginPage();
  }

  renderLoadScreen() {
    return <Spinner animation="grow" />;
  }

  renderLoginPage() {
    return (
      null
    );
  }
}

export default Home;