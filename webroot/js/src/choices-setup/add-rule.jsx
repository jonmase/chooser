import React from 'react';
import IconButton from 'material-ui/IconButton';

var AddRule = React.createClass({
    handleDialogOpen: function() {
        this.props.handlers.dialogOpen();
    },
    
    render: function() {
        return (
            <IconButton
                onTouchTap={this.handleDialogOpen}
                iconClassName="material-icons"
            >
                add
            </IconButton>         
        );
    }
});

module.exports = AddRule;