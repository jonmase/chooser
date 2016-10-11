import React from 'react';

var TextDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {this.props.value}
            </span>
        );
    }
});

module.exports = TextDisplay;