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
    
var OptionsTable = React.createClass({
    getInitialState: function () {
        var initialState = {
        };
        
        return initialState;
    },
    render: function() {
        return (
            <div>
                {(this.props.selections.length == 0)?
                    <p>There are no results to show.</p>
                :
                    <Table 
                        selectable={true}
                        multiSelectable={true}
                    >
                        <TableHeader 
                            adjustForCheckbox={true} 
                            displaySelectAll={true}
                        >
                            <TableRow>
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="user.username"
                                    fieldType="text"
                                    label="Username"
                                    sortHandler={this.props.resultsContainerHandlers.sort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="user.lastname"
                                    fieldType="text"
                                    label="Name"
                                    sortHandler={this.props.resultsContainerHandlers.sort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="modified"
                                    fieldType="date"
                                    label="Saved/Submitted"
                                    sortHandler={this.props.resultsContainerHandlers.sort}
                                />
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            displayRowCheckbox={true}
                            deselectOnClickaway={false}
                        >
                            {this.props.selections.map(function(selection) {
                                return (
                                    <TableRow 
                                        key={selection.id} 
                                    >
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.user.username}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.user.fullname}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.modified.formatted}</TableRowColumn>
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

module.exports = OptionsTable;