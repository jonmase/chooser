import React from 'react';

import Email from './email.jsx';

var EmailLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.label}: </strong>
                <Email {...this.props} />
            </p>
        );
    }
});

module.exports = EmailLabelled;