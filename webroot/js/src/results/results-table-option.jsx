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
                                    label="Code"
                                    sortHandler={this.props.resultsContainerHandlers.sort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="user.lastname"
                                    fieldType="text"
                                    label="Title"
                                    sortHandler={this.props.resultsContainerHandlers.sort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.props.sort.field}
                                    sortDirection={this.props.sort.direction}
                                    field="option_count"
                                    fieldType="number"
                                    label="Times Selected"
                                    sortHandler={this.props.resultsContainerHandlers.sort}
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

module.exports = OptionsTable;