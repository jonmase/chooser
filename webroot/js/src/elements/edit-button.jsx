import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditButton = React.createClass({
    handleDialogOpen: function() {
        this.props.handlers.dialogOpen(this.props.id);
    },
    
    render: function() {
        return (
            <IconButton
                onTouchTap={this.handleDialogOpen}
                iconClassName="material-icons"
            >
                edit
            </IconButton>         
        );
    }
});

module.exports = EditButton;