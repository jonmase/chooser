import React from 'react';

var EmailDisplay = React.createClass({
    render: function() {
        return (
            <a href={"mailto:" + this.props.field.value}>{this.props.field.value}</a>
        );
    }
});

module.exports = EmailDisplay;