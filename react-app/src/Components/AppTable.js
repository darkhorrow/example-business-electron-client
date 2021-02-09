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
        <Table striped hover variant="dark">
            <tbody>
                {
                    this.props.elements.map((item) =>  {
                        return(
                            <tr>
                                <td><th>Code:</th> {item.code}</td>
                                <td><th>Description:</th> {item.description}</td>
                                <td><th>Price:</th> {item.price}</td>
                                <td><th>State:</th> {item.state}</td>
                                <td><th>Creation Date:</th> {item.creationDate}</td>
                                <td><th>Creator:</th> {item.creator.username}</td>
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