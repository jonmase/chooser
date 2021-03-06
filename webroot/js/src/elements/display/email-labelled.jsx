import React from 'react';

import Email from './email.jsx';

var EmailLabelled = React.createClass({
    render: function() {
        var content = 
            <span>
                <strong>{this.props.label}: </strong>
                <Email {...this.props} />
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

module.exports = EmailLabelled;