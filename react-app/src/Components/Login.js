import React from "react";

import axios from 'axios';

import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserLock } from '@fortawesome/free-solid-svg-icons'

import './Login.css';

class Login extends React.Component {

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
      <div className="login-dark">
        <form onSubmit={this.handleSumbit}>
          <h2 className="sr-only">Login Form</h2>
          <div className="illustration"><FontAwesomeIcon icon={faUserLock} /></div>
          <div className="form-group"><input className="form-control" type="text" name="username" onChange={this.handleChange} placeholder="Username" autoComplete="off"/></div>
          <div className="form-group"><input className="form-control" type="password" name="password" onChange={this.handleChange} placeholder="Password"/></div>
          <div className="form-group"><button className="btn btn-primary btn-block" type="submit">Log In</button></div>
        </form>
      </div>
    );
  }

  handleSumbit = (event) => {
    event.preventDefault();

    const user = JSON.stringify(Object.fromEntries(new FormData(event.target)));

    axios.post('http://localhost:8080/login', user,  { 
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      localStorage.setItem('token', response.data.token);
      this.props.history.push("/home");
    }) 
  }
}

export default Login;