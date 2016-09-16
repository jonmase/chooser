import React from 'react';
import IconButton from 'material-ui/IconButton';

var AddButton = React.createClass({
    handleAdd: function() {
        //Call the passed handleAdd method, without passing any arguments
        //If call this directly from onTouchTap, event gets passed, which then makes it think it is getting an optionId
        this.props.handleAdd();
    },
    
    render: function() {
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Add";
        }
        return (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={this.handleAdd}
                tooltip={tooltip}
            >
                add
            </IconButton>         
        );
    }
});

module.exports = AddButton;