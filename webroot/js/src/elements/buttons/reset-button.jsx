import React from 'react';
import IconButton from 'material-ui/IconButton';

var ResetButton = React.createClass({
    handleClick: function() {
        this.props.handleClick();
    },
    
    render: function() {
        var disabled = (this.props.disabled)?true:false;
        
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Reset";
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
                autorenew
            </IconButton>         
        );
    }
});

module.exports = ResetButton;