import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditButton = React.createClass({
    handleEdit: function() {
        this.props.handleEdit(this.props.id);
    },
    
    render: function() {
        var disabled = (this.props.disabled)?true:false;
        
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Edit";
        }
        
        return (
            <IconButton
                disabled={disabled}
                iconClassName="material-icons"
                iconStyle={this.props.iconStyle}
                onTouchTap={this.handleEdit}
                style={this.props.style}
                tooltip={tooltip}
            >
                edit
            </IconButton>         
        );
    }
});

module.exports = EditButton;