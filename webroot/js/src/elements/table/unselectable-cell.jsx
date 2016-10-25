import React from 'react';

import TableRowColumn from 'material-ui/Table/TableRowColumn';

var UnselectableCell = React.createClass({
    render: function() {
        return (
            <TableRowColumn style={this.props.style}>
                <div onClick={(e) => {
                    //Stop row from being (de)selected when this cell is clicked
                    //See https://github.com/callemall/material-ui/issues/4535
                    e.preventDefault();
                    e.stopPropagation();
                }}>
                    {this.props.children}
                </div>
            </TableRowColumn>
        );
    }
});

module.exports = UnselectableCell;