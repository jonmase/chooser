import React from 'react';

var ShortTextDisplay = React.createClass({
    render: function() {
        if(this.props.min && this.props.max) {
            var content = this.props.min + " to " + this.props.max;
        }
        else if(this.props.min) {
            var content = "At least " + this.props.min;
        }
        else if(this.props.max) {
            var content = "Up to " + this.props.max;
        }
        else {
            var content = "No information";
        }
    
        return (
            <p>
                <strong>{this.props.title}: </strong>
                {content}
            </p>
        );
    }
});

module.exports = ShortTextDisplay;