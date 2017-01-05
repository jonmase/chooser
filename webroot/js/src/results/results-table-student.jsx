import React from 'react';

import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';

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
            sortField: 'user.username',
            sortDirection: 'asc',
        };
        
        return initialState;
    },
    handleSort: function(field, fieldType) {
        var direction = 'asc';
        if(field === this.state.sortField) {
            if(this.state.sortDirection === 'asc') {
                direction = 'desc';
            }
        }
        
        this.setState({
            sortField: field,
            sortDirection: direction,
        });
        
        this.props.handlers.sort('selection', field, fieldType, direction);
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
                                    sortField={this.state.sortField}
                                    sortDirection={this.state.sortDirection}
                                    field="user.username"
                                    fieldType="text"
                                    label="Username"
                                    sortHandler={this.handleSort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.state.sortField}
                                    sortDirection={this.state.sortDirection}
                                    field="user.lastname"
                                    fieldType="text"
                                    label="Name"
                                    sortHandler={this.handleSort}
                                />
                                <TableHeaderColumn style={styles.tableRowColumn}>
                                    Status
                                </TableHeaderColumn>
                                <SortableTableHeaderColumn
                                    sortField={this.state.sortField}
                                    sortDirection={this.state.sortDirection}
                                    field="modified"
                                    fieldType="datetime"
                                    label="Saved/Submitted Date"
                                    sortHandler={this.handleSort}
                                />
                                <SortableTableHeaderColumn
                                    sortField={this.state.sortField}
                                    sortDirection={this.state.sortDirection}
                                    field="option_count"
                                    fieldType="number"
                                    label="Options Selected"
                                    sortHandler={this.handleSort}
                                />
                                <TableHeaderColumn style={styles.actionsTableRowColumn}>{/* ACTIONS */}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                        >
                            {this.props.selections.map(function(selection, index) {
                                return (
                                    <TableRow 
                                        key={selection.id} 
                                    >
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.user.username}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.user.fullname}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.confirmed?"Submitted":"Auto-saved"}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.modified.formatted}</TableRowColumn>
                                        <TableRowColumn style={styles.tableRowColumn}>{selection.option_count}</TableRowColumn>
                                        <UnselectableCell style={styles.actionsTableRowColumn}>
                                            <ExpandButton
                                                handleMore={this.props.handlers.view} 
                                                id={index}
                                                tooltip=""
                                            />
                                        </UnselectableCell>
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