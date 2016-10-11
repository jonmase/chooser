import React from 'react';

import Toggle from './toggle.jsx';

var ToggleLabelled = React.createClass({
    render: function() {
        return (
            <p style={{lineHeight: '24px'}}>
                <strong style={{verticalAlign: 'top'}}>{this.props.label}: </strong>
                <span>
                    <Toggle {...this.props} />
                    <span style={{verticalAlign: 'top'}}>{this.props.explanation}</span>
                </span>
            </p>
        );
    }
});

module.exports = ToggleLabelled;