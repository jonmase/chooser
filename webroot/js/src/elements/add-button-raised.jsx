import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var AddButtonRaised = React.createClass({
    render: function() {
        return (
            <RaisedButton
                icon={<FontIcon className="material-icons">
                    add
                </FontIcon>}
                label={typeof(this.props.label) !== "undefined"?this.props.label:"Add"}
                labelPosition="before"
                onTouchTap={this.props.handlers.dialogOpen}
                primary={true}
            />
        );
    }
});

module.exports = AddButtonRaised;