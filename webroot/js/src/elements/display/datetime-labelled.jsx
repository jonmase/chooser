import React from 'react';

import DateTime from './datetime.jsx';

var DateTimeLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.label}: </strong>
                <DateTime {...this.props} />
            </p>
        );
    }
});

module.exports = DateTimeLabelled;