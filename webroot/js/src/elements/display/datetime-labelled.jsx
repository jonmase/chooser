import React from 'react';

import DateTime from './datetime.jsx';

var DateTimeLabelled = React.createClass({
    render: function() {
        var content = 
            <span>
                <strong>{this.props.label}: </strong>
                <DateTime {...this.props} />
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

module.exports = DateTimeLabelled;