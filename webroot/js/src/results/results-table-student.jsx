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
        this.props.resultsContainerHandlers.sort('selection', field, fieldType);
    },
    render: function() {
        return (
            <div>
                {(this.props.selections.length == 0)?
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
                                    field="user.username"
                                    fieldType="text"
                                    label="Username"
                                    sortHandler={this.handleSort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="user.lastname"
                                    fieldType="text"
                                    label="Name"
                                    sortHandler={this.handleSort}
                                />
                                <TableHeaderColumn style={styles.tableRowColumn}>
                                    Status
                                </TableHeaderColumn>
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="modified"
                                    fieldType="date"
                                    label="Saved/Submitted Date"
                                    sortHandler={this.handleSort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="option_count"
                                    fieldType="number"
                                    label="Options Selected"
                                    sortHandler={this.handleSort}
                                />
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                        >
                            {this.props.selections.map(function(selection) {
                                return (
                                    <TableRow 
                                        key={selection.id} 
                                    >
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.user.username}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.user.fullname}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.confirmed?"Submitted":"Auto-saved"}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.modified.formatted}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.option_count}</TableRowColumn>
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

module.exports = ResultsTable