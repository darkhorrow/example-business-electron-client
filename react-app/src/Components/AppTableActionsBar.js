import React from "react";

import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import './AppTableActionsBar.css';

class AppTableActionsBar extends React.Component {
    render(){
        const name = this.props.elementName;

        return (
        <ButtonToolbar aria-label="Toolbar" className="mb-2">
            <ButtonGroup className="mr-2" aria-label="First group">
                <Button><FontAwesomeIcon icon={faPlus} /> Add {name}</Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Second group">
                <Button variant="warning"><FontAwesomeIcon icon={faEdit} /> Edit {name}</Button> <Button variant="danger"><FontAwesomeIcon icon={faTrash} /> Remove {name}</Button>
            </ButtonGroup>
        </ButtonToolbar>
        );
    }
  }
  
  export default AppTableActionsBar;