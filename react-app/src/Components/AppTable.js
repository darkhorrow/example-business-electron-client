import React from "react";

import Spinner from 'react-bootstrap/Spinner';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

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
          <BootstrapTable 
          keyField={this.props.id} 
          data={this.props.elements} 
          columns={this.props.columns} 
          pagination={paginationFactory()} 
          selectRow={this.props.selection} 
          bordered={false} 
          bootstrap4 
          striped 
          hover
          />
    );
  }
}

export default AppTable;