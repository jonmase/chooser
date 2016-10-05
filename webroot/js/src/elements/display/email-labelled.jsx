import React from 'react';

import Email from './email.jsx';

var EmailLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.field.label}: </strong>
                <Email field={this.props.field} />
            </p>
        );
    }
});

module.exports = EmailLabelled;