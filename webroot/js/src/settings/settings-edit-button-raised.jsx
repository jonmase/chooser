import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var EditSettingsRaised = React.createClass({
    render: function() {
        return (
            <RaisedButton
                icon={<FontIcon className="material-icons">
                    edit
                </FontIcon>}
                label="Edit"
                labelPosition="before"
                onTouchTap={this.props.handlers.dialogOpen}
                primary={true}
            />
        );
    }
});

module.exports = EditSettingsRaised;