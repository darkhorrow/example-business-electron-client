import React from "react";

import axios from 'axios';

import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';

import AppAlert from './Alerts/AppAlert';

import './Login.css';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.alertElement = React.createRef();
  }

  state = {
    isLoading: true
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
      errorMessage: null,
      errorType: null
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
      <div className="login-dark">
        <form onSubmit={this.handleSumbit}>
          <h2 className="sr-only">Login Form</h2>
          <div className="illustration"><FontAwesomeIcon icon={faUserLock} /></div>
          <div className="form-group"><input className="form-control" type="text" name="username" onChange={this.handleChange} placeholder="Username" autoComplete="off"/></div>
          <div className="form-group"><input className="form-control" type="password" name="password" onChange={this.handleChange} placeholder="Password"/></div>
          <div className="form-group"><button className="btn btn-primary btn-block" type="submit">Log In</button></div>
        </form>
        <AppAlert variant={this.state.errorType} alertMessage={this.state.errorMessage} ref={this.alertElement}/>
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
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('role', response.data.role);
      sessionStorage.setItem('username', JSON.parse(user).username);
      this.props.history.push("/home");
    }).catch(error => {
      if(error.response) {
        const type = error.response.status === 401 ? "danger" : "warning";
        this.setState({errorMessage: error.response.data.message, errorType: type});
        this.alertElement.current.open();
      } else {
        this.setState({errorMessage: "Connection to the server failed", errorType: "danger"});
        this.alertElement.current.open();
      }
    })
  }
}

export default Login;