import React from 'react';

import TableRowColumn from 'material-ui/Table/TableRowColumn';

var UnselectableCell = React.createClass({
    render: function() {
        return (
            <TableRowColumn style={this.props.style} onCellClick={this.props.onCellClick}>
                {this.props.children}
            </TableRowColumn>
        );
    }
});

module.exports = UnselectableCell;