import React from 'react';

import DateTime from './datetime.jsx';

var DateTimeLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.field.label}: </strong>
                <DateTime field={this.props.field} />
            </p>
        );
    }
});

module.exports = DateTimeLabelled;