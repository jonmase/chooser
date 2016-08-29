import React from 'react';

var ShortTextDisplay = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.title}: </strong>
                {this.props.content}
            </p>
        );
    }
});

module.exports = ShortTextDisplay;