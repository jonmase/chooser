import React from 'react';

var DateTimeDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {(this.props.value && this.props.value.formatted)?this.props.value.formatted:"Not set"}
            </span>
        );
    }
});

module.exports = DateTimeDisplay;