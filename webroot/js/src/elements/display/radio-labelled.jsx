import React from 'react';

import Text from './text.jsx';

var RadioLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.label}: </strong>
                <Text {...this.props} />
            </p>
        );
    }
});

module.exports = RadioLabelled;