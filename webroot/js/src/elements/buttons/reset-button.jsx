import React from 'react';
import IconButton from 'material-ui/IconButton';

var ResetButton = React.createClass({
    handleReset: function() {
        this.props.handleReset();
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
                onTouchTap={this.handleReset}
                style={this.props.style}
                tooltip={tooltip}
            >
                cached
            </IconButton>         
        );
    }
});

module.exports = ResetButton;