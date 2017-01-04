import React from 'react';

import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';

var styles = {
    tableRowColumn: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    actionsTableRowColumn: {
        paddingLeft: '12px',
        paddingRight: 0,
        textAlign: 'right',
        whiteSpace: 'normal',
        width: '48px',
    },
};
    
var ResultsTable = React.createClass({
    getInitialState: function () {
        var initialState = {
        };
        
        return initialState;
    },
    handleSort: function(field, fieldType) {
        this.props.resultsContainerHandlers.sort('option', field, fieldType);
    },
    render: function() {
        return (
            <div>
                {(this.props.options.length == 0)?
                    <p>There are no results to show.</p>
                :
                    <Table 
                        selectable={false}
                        //multiSelectable={true}
                    >
                        <TableHeader 
                            adjustForCheckbox={false} 
                            displaySelectAll={false}
                        >
                            <TableRow>
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="code"
                                    fieldType="text"
                                    label="Code"
                                    sortHandler={this.handleSort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="title"
                                    fieldType="text"
                                    label="Title"
                                    sortHandler={this.handleSort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="count"
                                    fieldType="number"
                                    label="Times Selected"
                                    sortHandler={this.handleSort}
                                />
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                        >
                            {this.props.options.map(function(option) {
                                return (
                                    <TableRow 
                                        key={option.id} 
                                    >
                                        <TableRowColumn style={styles.tableRowColumn}>{option.code}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{option.title}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{option.count}</TableRowColumn>
                                    </TableRow>
                                );
                            }, this)}
                        </TableBody>
                    </Table>
                }
            </div>
        );
    }
});

module.exports = ResultsTable;