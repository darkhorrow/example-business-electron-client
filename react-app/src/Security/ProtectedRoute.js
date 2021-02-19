import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import Auth from './Auth';

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        if(Auth.isLoggedIn()) {
            return (<Component {...props} />);
        }
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('username');
        return(<Redirect to='/login' />);
    }} />
)

export default ProtectedRoute;