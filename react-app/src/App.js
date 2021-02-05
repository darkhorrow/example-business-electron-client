import React from 'react';

import Login  from './Components/Login';
import Home  from './Components/Home';

import ProtectedRoute from './Security/ProtectedRoute'

import { Route, Switch } from 'react-router-dom';

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <ProtectedRoute exact path="/home" component={Home} />
            </Switch>
        );
    }
}

export default App;