import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

var ReloadDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="submit"
                label="OK"
                onTouchTap={this.props.handlers.close}
                primary={true}
                type="submit"
            />,
        ];
        
        return (
            <Dialog
                actions={actions}
                autoScrollBodyContent={true}
                modal={true}
                onRequestClose={this.props.handlers.close}
                open={this.props.open}
                title="More Recent Selection: Reload Required"
            >
                <p style={{marginBottom: 0}}>
                    It appears that you have made a selection (probably in another tab, window or browser) since you loaded this page. This page will now be reloaded so you can see your more recent selection. 
                </p>
            </Dialog>
        );
    }
});

module.exports = ReloadDialog;