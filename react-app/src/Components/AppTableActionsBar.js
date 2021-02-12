import React from "react";

import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import './AppTableActionsBar.css';

class AppTableActionsBar extends React.Component {
    render(){
        const name = this.props.elementName;

        return (
        <ButtonToolbar aria-label="Toolbar" className="mb-2">
            <ButtonGroup className="mr-2" aria-label="First group">
                <Button variant="secondary"><FontAwesomeIcon icon={faPlus} className="text-success"/> Add {name}</Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Second group">
                <Button variant="secondary" onClick={this.props.onEdit}><FontAwesomeIcon icon={faEdit} className="text-warning"/> Edit {name}</Button> 
                <Button variant="secondary"><FontAwesomeIcon icon={faTrashAlt} className="text-danger"/> Remove {name}</Button>
            </ButtonGroup>
        </ButtonToolbar>
        );
    }
  }
  
  export default AppTableActionsBar;