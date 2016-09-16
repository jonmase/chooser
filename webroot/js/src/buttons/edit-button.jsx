import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditButton = React.createClass({
    handleEdit: function() {
        this.props.handleEdit(this.props.id);
    },
    
    render: function() {
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Edit";
        }
        return (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={this.handleEdit}
                tooltip={tooltip}
            >
                edit
            </IconButton>         
        );
    }
});

module.exports = EditButton;