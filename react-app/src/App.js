import React from 'react';

import axios from 'axios';

import Login  from './Components/Login';
import Home  from './Components/Home';
import Articles  from './Components/Articles';
import AppNavbar from './Components/Navbar';

import ProtectedRoute from './Security/ProtectedRoute'

import { Route, Switch } from 'react-router-dom';

axios.interceptors.request.use(
    function(config) {
        config.headers.Authorization = sessionStorage.getItem('token');
        return config;
    }
);

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <>
                    <AppNavbar />
                    <ProtectedRoute exact path="/home" component={Home} />
                    <ProtectedRoute exact path="/items" component={Articles} />
                </>
            </Switch>     
        );
    }
}

export default App;