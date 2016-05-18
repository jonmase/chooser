import React from 'react';

var FieldLabel = React.createClass({
    render: function() {
        return (
            <label>
                {this.props.label}<br />
                <span className="sublabel">{this.props.instructions}</span>
            </label>
        );
    }
});

module.exports = FieldLabel;