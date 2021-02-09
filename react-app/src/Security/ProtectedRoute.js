import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import Auth from './Auth';

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
       Auth.isLoggedIn()
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

export default ProtectedRoute;