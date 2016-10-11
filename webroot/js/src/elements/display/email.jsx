import React from 'react';

var EmailDisplay = React.createClass({
    render: function() {
        return (
            <a href={"mailto:" + this.props.value}>{this.props.value}</a>
        );
    }
});

module.exports = EmailDisplay;