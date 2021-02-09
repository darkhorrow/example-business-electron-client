import React from "react";

import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import {Table} from 'react-bootstrap';

import './AppTable.css';

class AppTable extends React.Component {

  state = {
    isLoading: true
  }

  async componentDidMount() {
    this.setState({
      isLoading: false
    });
  }

  render(){
    return this.state.isLoading ? this.renderLoadScreen() : this.renderList();
  }

  renderLoadScreen() {
    return <Spinner animation="grow" />;
  }

  renderList() {
    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>State</th>
                    <th>Creation Date</th>
                    <th>Creator</th>
                </tr>
            </thead>
            <tbody>
                {
                    this.props.elements.map((item) =>  {
                        return(
                            <tr>
                                <td>{item.code}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.state}</td>
                                <td>{item.creationDate}</td>
                                <td>{item.creator.username}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    );
  }
}

export default AppTable;