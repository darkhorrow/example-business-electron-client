import React from "react";

import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrashAlt, faInfoCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons'

import Auth from '../Security/Auth';

import './AppTableActionsBar.css';

class AppTableActionsBar extends React.Component {
    renderDetailsAction() {
        const name = this.props.elementName;
        if(this.props.visibleByRoles && !this.props.visibleByRoles.add.includes(Auth.getRole())) {
            return null;
        }
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onDetails} action="details"><FontAwesomeIcon icon={faInfoCircle} className="text-info"/> Details of {name}</Button>;
        }
        return this.props.excludeActions.includes('details') ? null : <Button variant="secondary" onClick={this.props.onDetails} action="details"><FontAwesomeIcon icon={faInfoCircle} className="text-info"/> Details of {name}</Button>;
    }

    renderAddAction() {
        const name = this.props.elementName;
        if(this.props.visibleByRoles && !this.props.visibleByRoles.add.includes(Auth.getRole())) {
            return null;
        }
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onAdd} action="add"><FontAwesomeIcon icon={faPlus} className="text-success"/> Add {name}</Button>;
        }
        return this.props.excludeActions.includes('add') ? null : <Button variant="secondary" onClick={this.props.onAdd} action="add"><FontAwesomeIcon icon={faPlus} className="text-success"/> Add {name}</Button>;
    }

    renderEditAction() {
        const name = this.props.elementName;
        if(this.props.visibleByRoles && !this.props.visibleByRoles.edit.includes(Auth.getRole())) {
            return null;
        }
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onEdit} action="edit"><FontAwesomeIcon icon={faEdit} className="text-warning"/> Edit {name}</Button>;
        }
        return this.props.excludeActions.includes('edit') ? null : <Button variant="secondary" onClick={this.props.onEdit} action="edit"><FontAwesomeIcon icon={faEdit} className="text-warning"/> Edit {name}</Button>;
    }

    renderDeleteAction() {
        const name = this.props.elementName;
        if(this.props.visibleByRoles && !this.props.visibleByRoles.delete.includes(Auth.getRole())) {
            return null;
        }
        if(!this.props.excludeActions) {
            return <Button variant="secondary" onClick={this.props.onDelete} action="remove"><FontAwesomeIcon icon={faTrashAlt} className="text-danger" /> Remove {name}</Button>;
        }
        return this.props.excludeActions.includes('delete') ? null : <Button variant="secondary" onClick={this.props.onDelete} action="remove"><FontAwesomeIcon icon={faTrashAlt} className="text-danger"/> Remove {name}</Button>;
    }

    renderItemDeactivation() {
        const name = this.props.elementName;
        if(name !== 'item' || !Auth.isLoggedIn()) {
            return null;
        }

        return <Button variant="secondary" onClick={this.props.onDeactivate}><FontAwesomeIcon icon={faClipboardList} className="text-dark" action="deactivate"/> Deactivate {name}</Button>;
    }

    render(){
        return (
        <ButtonToolbar aria-label="Toolbar" className="mb-2">
            <ButtonGroup className="mr-2" aria-label="First group">
                {this.renderDetailsAction()}
            </ButtonGroup>
            <ButtonGroup className="mr-2" aria-label="Second group">
                {this.renderAddAction()}
            </ButtonGroup>
            <ButtonGroup aria-label="Third group">
                {this.renderItemDeactivation()}
                {this.renderEditAction()}
                {this.renderDeleteAction()}
            </ButtonGroup>
        </ButtonToolbar>
        );
    }
  }
  
  export default AppTableActionsBar;