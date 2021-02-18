import React from "react";

import AppTableActionsBar from './AppTableActionsBar';

import Spinner from 'react-bootstrap/Spinner';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

import './AppTable.css';

class AppTable extends React.Component {

  state = {
    isLoading: true
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
      keyRowSelected: null
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
          <>
          <AppTableActionsBar 
          elementName={this.props.elementName} 
          onEdit={this.props.onEdit} 
          onDelete={this.props.onDelete} 
          onAdd={this.props.onAdd} 
          onDetails={this.props.onDetails}
          excludeActions={this.props.excludeActions}
          visibleByRoles={this.props.visibleByRoles}
          />
          
          <BootstrapTable 
          keyField={this.props.id} 
          data={this.props.elements} 
          columns={this.props.columns} 
          pagination={paginationFactory()} 
          selectRow={this.props.selection} 
          filter={filterFactory()} 
          bordered={false}
          bootstrap4
          />
          </>
    );
  }
}

export default AppTable;