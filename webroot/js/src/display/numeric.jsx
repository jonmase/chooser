import React from 'react';

var NumericDisplay = React.createClass({
    render: function() {
        var field = this.props.field;

        return (
            <p>
                <strong>{field.label}: </strong>
                {field.value}
            </p>
        );
    }
});

module.exports = NumericDisplay;