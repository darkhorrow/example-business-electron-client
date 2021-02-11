import React from 'react';

import axios from 'axios';

import Login  from './Components/Login';
import Home  from './Components/Home';
import Articles  from './Components/Articles';
import Suppliers  from './Components/Suppliers';
import PriceReductions  from './Components/PriceReductions';
import Users from './Components/Users';
import Deactivations from './Components/Deactivations';

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
                    <ProtectedRoute exact path="/suppliers" component={Suppliers} />
                    <ProtectedRoute exact path="/price-reductions" component={PriceReductions} />
                    <ProtectedRoute exact path="/users" component={Users} />
                    <ProtectedRoute exact path="/deactivations" component={Deactivations} />
                </>
            </Switch>     
        );
    }
}

export default App;