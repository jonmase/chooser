import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var AddButtonRaised = React.createClass({
    render: function() {
        var label = this.props.label
        if(!label) {
            label = "Add";
        }
        return (
            <RaisedButton
                icon={<FontIcon className="material-icons">
                    add
                </FontIcon>}
                label={label}
                labelPosition="before"
                onTouchTap={this.props.handleAdd}
                primary={true}
            />
        );
    }
});

module.exports = AddButtonRaised;