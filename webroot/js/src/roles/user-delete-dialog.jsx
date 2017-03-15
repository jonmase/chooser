import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import UserList from './user-list.jsx';

var RuleViewDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="close"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handleCancel}
            />,
            <FlatButton
                key="submit"
                label="Confirm"
                primary={true}
                secondary={false}
                onTouchTap={this.props.handleSubmit}
            />,
        ];
        
        var pluralise = this.props.usersBeingDeleted.length > 0;
        
        var title = "Remove User Permissions";
        
        return (
            <Dialog
                actions={actions}
                modal={false}
                onRequestClose={this.props.handleCancel}
                open={this.props.open}
                title={title}
            >
                <p>Are you sure you want to remove the additional permissions for <span>{pluralise?"these users":"this user"}</span>?</p>
                <p>Please note that users will still have their default permissions based on their role in the WebLearn site that this choice is launched from.</p>
                <UserList
                    users={this.props.users}
                    userIndexesToList={this.props.usersBeingDeleted}
                />
            </Dialog>
        );
    }
});

module.exports = RuleViewDialog;