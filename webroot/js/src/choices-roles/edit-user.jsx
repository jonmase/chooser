import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditUser = React.createClass({
    handleDialogOpen: function() {
        //Call the handler (handleEditUserDialogOpen in roles-container.jsx), passing through the user, as the only value in an array
        this.props.handlers.dialogOpen([this.props.user.username]);
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

module.exports = EditUser;