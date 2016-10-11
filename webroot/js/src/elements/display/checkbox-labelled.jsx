import React from 'react';

import Checkbox from './checkbox.jsx';

var CheckboxLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.label}: </strong>
                <Checkbox {...this.props} />
            </p>
        );
    }
});

module.exports = CheckboxLabelled;