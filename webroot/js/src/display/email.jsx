import React from 'react';

var EmailDisplay = React.createClass({
    render: function() {
        var field = this.props.field;

        return (
            <p>
                <strong>{field.label}: </strong>
                <a href={"mailto:" + field.value}>{field.value}</a>
            </p>
        );
    }
});

module.exports = EmailDisplay;