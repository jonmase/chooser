import React from 'react';
import IconButton from 'material-ui/IconButton';

var PublishButton = React.createClass({
    handleClick: function() {
        if(this.props.handleClick) {
            this.props.handleClick(this.props.id);
        }
    },
    
    render: function() {
        var disabled = (this.props.disabled)?true:false;
        
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Unpublish";
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
                stop
            </IconButton>         
        );
    }
});

module.exports = PublishButton;