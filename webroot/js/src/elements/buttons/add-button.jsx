import React from 'react';
import IconButton from 'material-ui/IconButton';

var AddButton = React.createClass({
    handleClick: function() {
        //Call the passed handleClick method, without passing any arguments
        //If call this directly from onTouchTap, event gets passed, which then makes it think it is getting an optionId
        this.props.handleClick();
    },
    
    render: function() {
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Add";
        }
        return (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={this.handleClick}
                tooltip={tooltip}
            >
                add
            </IconButton>         
        );
    }
});

module.exports = AddButton;