import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var EditButtonRaised = React.createClass({
    handleClick: function() {
        if(this.props.handleClick) {
            this.props.handleClick(this.props.id);
        }
    },
    
    render: function() {
        var label = this.props.label
        if(typeof(label) === "undefined") {
            label = "Edit";
        }
        return (
            <RaisedButton
                icon={<FontIcon className="material-icons">
                    edit
                </FontIcon>}
                label={label}
                labelPosition="before"
                onTouchTap={this.handleClick}
                primary={true}
            />
        );
    }
});

module.exports = EditButtonRaised;