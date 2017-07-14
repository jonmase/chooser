import React from 'react';

import Toggle from './toggle.jsx';

var ToggleLabelled = React.createClass({
    render: function() {
        var content = 
            <span style={{lineHeight: '24px'}}>
                <strong style={{verticalAlign: 'top'}}>{this.props.label}: </strong>
                <span>
                    <Toggle {...this.props} />
                    <span style={{verticalAlign: 'top'}}>{this.props.explanation}</span>
                </span>
            </span>;
    
        if(this.props.paragraph) {
            return (
                <p>content</p>
            );
        }
        else {
            return content;
        }
    }
});

module.exports = ToggleLabelled;