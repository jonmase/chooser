import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var EditButtonRaised = React.createClass({
    render: function() {
        return (
            <RaisedButton
                icon={<FontIcon className="material-icons">
                    edit
                </FontIcon>}
                label={typeof(this.props.label) !== "undefined"?this.props.label:"Edit"}
                labelPosition="before"
                onTouchTap={this.props.handlers.dialogOpen}
                primary={true}
            />
        );
    }
});

module.exports = EditButtonRaised;