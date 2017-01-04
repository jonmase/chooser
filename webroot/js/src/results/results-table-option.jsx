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
        var defaultFields = [];
        if(this.props.choice.use_code) {
            defaultFields.push({
                name: 'code',
                label: 'Code',
                type: 'text',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(this.props.choice.use_title) {
            defaultFields.push({
                name: 'title',
                label: 'Title',
                type: 'text',
                rowStyle: styles.tableRowColumnTitle,
            })
        }
        if(this.props.choice.use_min_places) {
            defaultFields.push({
                name: 'min_places',
                label: 'Min. Places',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(this.props.choice.use_max_places) {
            defaultFields.push({
                name: 'max_places',
                label: 'Max. Places',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(this.props.choice.use_points) {
            defaultFields.push({
                name: 'points',
                label: 'Points',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        
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
                                            sortField={this.props.sort.field}
                                            sortDirection={this.props.sort.direction}
                                            field={field.name}
                                            fieldType={field.type}
                                            key={field.name}
                                            label={field.label}
                                            sortHandler={this.handleSort}
                                        />
                                    );
                                }, this)}

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
                                        {defaultFields.map(function(field) {
                                            return (
                                                <TableRowColumn style={field.rowStyle} key={field.name}>{option[field.name]}</TableRowColumn>
                                            );
                                        })}
                                                
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