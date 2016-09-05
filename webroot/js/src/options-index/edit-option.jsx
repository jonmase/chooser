import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditOption = React.createClass({
    handleDialogOpen: function() {
        this.props.handlers.dialogOpen(this.props.option.id);
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

module.exports = EditOption;