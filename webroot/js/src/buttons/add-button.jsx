import React from 'react';
import IconButton from 'material-ui/IconButton';

var AddButton = React.createClass({
    render: function() {
        var tooltip = this.props.tooltip
        if(!tooltip) {
            tooltip = "Add";
        }
        return (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={this.props.handleAdd}
                tooltip={tooltip}
            >
                add
            </IconButton>         
        );
    }
});

module.exports = AddButton;