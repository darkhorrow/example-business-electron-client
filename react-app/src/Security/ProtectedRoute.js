import React from 'react'
import { Redirect } from 'react-router-dom'

import Auth from './Auth';

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = Auth.isLoggedIn();
       
        return isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to='/login'/>
        );
    }
}

export default ProtectedRoute;