import React from 'react';

import Checkbox from './checkbox.jsx';

var CheckboxLabelled = React.createClass({
    render: function() {
        var content = 
            <span>
                <strong>{this.props.label}: </strong>
                <Checkbox {...this.props} />
            </span>;
    
        if(this.props.paragraph) {
            return (
                <div className="paragraph">{content}</div>
            );
        }
        else {
            return content;
        }
    }
});

module.exports = CheckboxLabelled;