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
            sortField: 'title',
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
        
        this.props.handlers.sort('option', field, fieldType, direction);
    },
    render: function() {
        var defaultFields = this.props.optionDefaultFields;
        defaultFields.forEach(function(field) {
            if(field.name === 'title') {
                field.rowStyle = styles.tableRowColumnTitle;
            }
            else {
                field.rowStyle = styles.tableRowColumn;
            }
        });
        
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
                                {defaultFields.map(function(field) {
                                    return (
                                        <SortableTableHeaderColumn
                                            sortField={this.state.sortField}
                                            sortDirection={this.state.sortDirection}
                                            field={field.name}
                                            fieldType={field.type}
                                            key={field.name}
                                            label={field.label}
                                            sortHandler={this.handleSort}
                                        />
                                    );
                                }, this)}

                                <SortableTableHeaderColumn
                                    sortField={this.state.sortField}
                                    sortDirection={this.state.sortDirection}
                                    field="count"
                                    fieldType="number"
                                    label="Times Selected"
                                    sortHandler={this.handleSort}
                                />
                                <TableHeaderColumn style={styles.actionsTableRowColumn}>{/* ACTIONS */}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                        >
                            {this.props.options.map(function(option, index) {
                                return (
                                    <TableRow 
                                        key={option.id} 
                                    >
                                        {defaultFields.map(function(field) {
                                            return (
                                                <TableRowColumn style={field.rowStyle} key={field.name}>{option[field.name]}</TableRowColumn>
                                            );
                                        })}
                                                
                                        <TableRowColumn style={styles.tableRowColumn}>{option.count}</TableRowColumn>
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

module.exports = ResultsTable;