import React from "react";

import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import './AppTableActionsBar.css';

class AppTableActionsBar extends React.Component {
    renderAddAction() {
        const name = this.props.elementName;
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onAdd}><FontAwesomeIcon icon={faPlus} className="text-success"/> Add {name}</Button>;
        }
        return this.props.excludeActions.includes('add') ? null : <Button variant="secondary" onClick={this.props.onAdd}><FontAwesomeIcon icon={faPlus} className="text-success"/> Add {name}</Button>;
    }

    renderEditAction() {
        const name = this.props.elementName;
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onEdit}><FontAwesomeIcon icon={faEdit} className="text-warning"/> Edit {name}</Button>;
        }
        return this.props.excludeActions.includes('edit') ? null : <Button variant="secondary" onClick={this.props.onEdit}><FontAwesomeIcon icon={faEdit} className="text-warning"/> Edit {name}</Button>;
    }

    renderDeleteAction() {
        const name = this.props.elementName;
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onDelete}><FontAwesomeIcon icon={faTrashAlt} className="text-danger"/> Remove {name}</Button>;
        }
        return this.props.excludeActions.includes('delete') ? null : <Button variant="secondary" onClick={this.props.onDelete}><FontAwesomeIcon icon={faTrashAlt} className="text-danger"/> Remove {name}</Button>;
    }

    render(){
        const name = this.props.elementName;
        return (
        <ButtonToolbar aria-label="Toolbar" className="mb-2">
            <ButtonGroup className="mr-2" aria-label="First group">
                {this.renderAddAction()}
            </ButtonGroup>
            <ButtonGroup aria-label="Second group">
                {this.renderEditAction()}
                {this.renderDeleteAction()}
            </ButtonGroup>
        </ButtonToolbar>
        );
    }
  }
  
  export default AppTableActionsBar;