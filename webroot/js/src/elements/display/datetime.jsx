import React from 'react';

var DateTimeDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {this.props.value?this.props.value.formatted:""}
            </span>
        );
    }
});

module.exports = DateTimeDisplay;