import React from "react";

import axios from 'axios';

import './Home.css';

class Home extends React.Component {
  async componentDidMount() {
    this.quoteOfTheDay();
  }

  render() {
    return (
      <div className="home-dark">
        <div className="container">
          <div className="row">
            <div className="jumbotron bg-dark text-light">
              <h1 className="display-4">Welcome back, <b>{sessionStorage.getItem('username')}</b></h1>
              <p className="lead">This is the main page of Example Business application.</p>
              <p className="lead">You can manipulate Items, Suppliers, Price reductions and more! Click a link on the navbar above and start!</p>
              <hr className="my-4"/>
              <h5 className="mb-3"><b>Quote of the day</b></h5>
              <blockquote className="blockquote pl-3">
                <p className="mb-0 d-flex justify-content-center">"{localStorage.getItem('qotd')}"</p>
                <footer className="blockquote-footer d-flex justify-content-center">{localStorage.getItem('qotd_author')}</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    );
  }

  quoteOfTheDay() {
    if(!localStorage.getItem('qotd_day') ||(new Date() - new Date(localStorage.getItem('qotd_day'))) > (24 * 60 * 60 * 1000)) {
      var instance = axios.create();
      
      delete instance.defaults.headers.common['Authorization'];
      instance.get('https://quotes.rest/qod?language=en').then(response => {
        localStorage.setItem('qotd', response.data.contents.quotes[0].quote);
        localStorage.setItem('qotd_author', response.data.contents.quotes[0].author);
        localStorage.setItem('qotd_day', new Date());
      });
    }  
  }
}

export default Home;