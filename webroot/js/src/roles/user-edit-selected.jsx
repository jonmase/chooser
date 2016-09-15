import React from 'react';
import IconButton from 'material-ui/IconButton';

var EditSelectedUsers = React.createClass({
    handleDialogOpen: function() {
        //Call the handler (handleEditUserDialogOpen in roles-container.jsx) and pass through the currently selected users
        //Must pass the users through here as this handler can also be called from edit-user.jsx, which sends a single user
        this.props.handlers.dialogOpen(this.props.state.usersSelected);
    },
    
    render: function() {
        //Are there any selected users? If not, edit button will be disabled
        var noUsersSelected = this.props.state.usersSelected.length===0;
        
        return (
            <IconButton
                tooltip={noUsersSelected?"":"Edit Selected Users"}
                onTouchTap={this.handleDialogOpen}
                iconClassName="material-icons"
                disabled={noUsersSelected}
            >
                edit
            </IconButton>         
        );
    }
});

module.exports = EditSelectedUsers;