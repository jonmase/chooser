import React from 'react';

import Checkbox from './checkbox.jsx';

var CheckboxLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.field.label}: </strong>
                <Checkbox field={this.props.field} />
            </p>
        );
    }
});

module.exports = CheckboxLabelled;