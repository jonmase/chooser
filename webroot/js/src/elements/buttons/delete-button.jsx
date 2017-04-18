import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditButton = React.createClass({
    handleClick: function() {
        this.props.handleClick(this.props.id);
    },
    
    render: function() {
        var disabled = (this.props.disabled)?true:false;
        
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Delete";
        }
        
        return (
            <IconButton
                disabled={disabled}
                iconClassName="material-icons"
                iconStyle={this.props.iconStyle}
                onTouchTap={this.handleClick}
                style={this.props.style}
                tooltip={tooltip}
            >
                delete
            </IconButton>         
        );
    }
});

module.exports = EditButton;