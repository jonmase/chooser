import React from 'react';

import Toggle from './toggle.jsx';

var ToggleLabelled = React.createClass({
    render: function() {
        return (
            <p style={{lineHeight: '24px'}}>
                <strong style={{verticalAlign: 'top'}}>{this.props.field.label}: </strong>
                <Toggle field={this.props.field} />
            </p>
        );
    }
});

module.exports = ToggleLabelled;