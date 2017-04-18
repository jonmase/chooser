import React from 'react';
import IconButton from 'material-ui/IconButton';

var ExpandButton = React.createClass({
    handleMore: function() {
        if(this.props.handleMore) {
            this.props.handleMore(this.props.id);
        }
    },
    render: function() {
        var disabled = (this.props.disabled)?true:false;
        
        var tooltip = this.props.tooltip;
        if(typeof(tooltip) === "undefined") {
            tooltip = "More";
        }
        
        return (
            <IconButton
                disabled={disabled}
                iconClassName="material-icons"
                iconStyle={this.props.iconStyle}
                onTouchTap={this.handleMore}
                style={this.props.style}
                tooltip={tooltip}
            >
                more_horiz
            </IconButton>         
        );
    }
});

module.exports = ExpandButton;