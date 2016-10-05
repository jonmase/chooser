import React from 'react';

var DateTimeDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {this.props.field.value?this.props.field.value.formatted:""}
            </span>
        );
    }
});

module.exports = DateTimeDisplay;