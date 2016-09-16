import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditButton = React.createClass({
    handleDelete: function() {
        this.props.handleDelete(this.props.id);
    },
    
    render: function() {
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Delete";
        }
        return (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={this.handleDelete}
                tooltip={tooltip}
            >
                delete
            </IconButton>         
        );
    }
});

module.exports = EditButton;