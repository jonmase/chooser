import React from 'react';

import IconButton from 'material-ui/IconButton';

var AddOption = React.createClass({
    handleDialogOpen: function() {
        this.props.handlers.dialogOpen();
    },
    
    render: function() {
        return (
            <IconButton
                tooltip="Add Option"
                onTouchTap={this.handleDialogOpen}
                iconClassName="material-icons"
            >
                add
            </IconButton>         
        );
    }
});

module.exports = AddOption;