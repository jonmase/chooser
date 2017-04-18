import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var AddButtonRaised = React.createClass({
    handleClick: function() {
        //Call the passed handleClick method, without passing any arguments
        //If call this directly from onTouchTap, event gets passed, which then makes it think it is getting an optionId
        if(this.props.handleClick) {
            this.props.handleClick();
        }
    },
    
    render: function() {
        var label = this.props.label
        if(typeof(label) === "undefined") {
            label = "Add";
        }
        return (
            <RaisedButton
                icon={<FontIcon className="material-icons">
                    add
                </FontIcon>}
                label={label}
                labelPosition="before"
                onTouchTap={this.handleClick}
                primary={true}
            />
        );
    }
});

module.exports = AddButtonRaised;