import React from "react";

import { Alert } from 'react-bootstrap';

import './AppAlert.css';

class AppAlert extends React.Component {
    state = {
        show: true
    }

    changeState = () => {this.setState({show: false})}
    open = () => {this.setState({show: true})}

    render() {
        return (
            <Alert variant={this.props.variant} show={this.state.show} dismissible onClose={this.changeState}>
                <Alert.Heading>{this.props.variant}</Alert.Heading>
                <p>{this.props.alertMessage}</p>
            </Alert>
        );
    }
}

export default AppAlert;