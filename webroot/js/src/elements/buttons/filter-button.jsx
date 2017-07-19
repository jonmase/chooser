import React from 'react';
import IconButton from 'material-ui/IconButton';

var FilterButton = React.createClass({
    render: function() {
        var disabled = (this.props.disabled)?true:false;
        
        var tooltip = this.props.tooltip;
        if(typeof(tooltip) === "undefined") {
            tooltip = "Filter";
        }
        
        return (
            <IconButton
                disabled={disabled}
                iconClassName="material-icons"
                iconStyle={this.props.iconStyle}
                onTouchTap={this.props.handleClick}
                style={this.props.style}
                tooltip={tooltip}
            >
                filter_list
            </IconButton>         
        );
    }
});

module.exports = FilterButton;