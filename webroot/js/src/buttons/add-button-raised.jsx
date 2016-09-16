import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var AddButtonRaised = React.createClass({
    handleAdd: function() {
        //Call the passed handleAdd method, without passing any arguments
        //If call this directly from onTouchTap, event gets passed, which then makes it think it is getting an optionId
        this.props.handleAdd();
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
                onTouchTap={this.handleAdd}
                primary={true}
            />
        );
    }
});

module.exports = AddButtonRaised;