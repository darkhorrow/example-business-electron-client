import React from "react";

import axios from 'axios';

import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteRight, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'

import './Home.css';

class Home extends React.Component {

  state = {
    isLoading: true
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
      messageOfTheDay: null,
      quoteAuthor: null
    });

    this.quoteOfTheDay();
  }

  render(){
    return this.state.isLoading ? this.renderLoadScreen() : this.renderLoginPage();
  }

  renderLoadScreen() {
    return <Spinner animation="grow" />;
  }

  renderLoginPage() {
    return (
      <div className="home-dark">
        <div className="container">
          <div className="row">
            <div className="jumbotron bg-dark text-light">
              <h1 className="display-4">Welcome back, </h1>
              <p className="lead">This is the main page of Example Business application.</p>
              <p className="lead">You can manipulate Items, Suppliers, Price reductions and more! Click a link on the navbar above and start!</p>
              <hr className="my-4"/>
              <h5><FontAwesomeIcon icon={faQuoteLeft}/> <b>Quote of the day</b> <FontAwesomeIcon icon={faQuoteRight} /></h5>
              <blockquote className="blockquote">
                <p className="mb-0">{this.state.messageOfTheDay}</p>
                <footer className="blockquote-footer">{this.state.quoteAuthor}</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    );
  }

  quoteOfTheDay() {
    if(this.state.messageOfTheDay == null) {
      axios.get('https://quotes.rest/qod?language=en').then(response => {
      this.setState({
        messageOfTheDay: response.data.contents.quotes[0].quote,
        quoteAuthor: response.data.contents.quotes[0].author
      });
      
    }); 
    }  
  }
}

export default Home;