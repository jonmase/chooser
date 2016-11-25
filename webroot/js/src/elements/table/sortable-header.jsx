import React from 'react';

import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';

import SortIcon from './sort-icon.jsx';

var styles = {
    tableHeaderColumn: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    tableHeaderColumnTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: '30%',
    },
};

var SortableHeader = React.createClass({
    handleSort: function() {
        this.props.sortHandler(this.props.field, this.props.fieldType);
    },
    render: function() {
        if(this.props.field === 'title') {
            var style = styles.tableHeaderColumnTitle;
        }
        else {
            var style = styles.tableHeaderColumn;
        }
    
        return (
            <TableHeaderColumn style={style}>
                <div onTouchTap={this.handleSort} style={{cursor: 'hand', cursor: 'pointer'}}>
                    {(this.props.sortField === this.props.field)?
                        <SortIcon direction={this.props.sortDirection} />
                    :""}
                    &nbsp;
                    <span>{this.props.label}</span>
                </div>
            </TableHeaderColumn>
        );
    }
});

module.exports = SortableHeader;