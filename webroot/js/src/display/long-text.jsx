import React from 'react';

var LongTextDisplay = React.createClass({
    render: function() {
        return (
            <div>
                <strong>{this.props.title}: </strong><br />
                <div>
                    {this.props.content}
                </div>
            </div>
        );
    }
});

module.exports = LongTextDisplay;