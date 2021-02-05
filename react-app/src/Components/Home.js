import React from "react";

import axios from 'axios';

import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import './Home.css';

class Home extends React.Component {

  state = {
    isLoading: true
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
      messageOfTheDay: null
    });

    this.quoteOfTheDay();
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
      <div className="home-dark">
        <div className="container">
          <div className="row">
            <div class="jumbotron">
              <h1 class="display-4">Welcome back, </h1>
              <p class="lead">This is the main page of Example Business application.</p>
              <p class="lead">You can manipulate Items, Suppliers, Price reductions and more! Click a link on the navbar above and start!</p>
              <hr class="my-4"/>
              <p><b>Quote of the day</b></p>
              <p>{this.state.messageOfTheDay}}</p>
              <cite></cite>
            </div>
          </div>
        </div>
      </div>
    );
  }

  quoteOfTheDay() {
    if(this.state.messageOfTheDay == null) {
      axios.get('https://quotes.rest/qod?language=en').then(response => {
      this.setState({messageOfTheDay: response.data.contents.quotes[0].quote});
    }) 
    }  
  }
}

export default Home;