import React from 'react';

import Text from './text.jsx';

var TextLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.field.label}: </strong>
                <Text field={this.props.field} />
            </p>
        );
    }
});

module.exports = TextLabelled;