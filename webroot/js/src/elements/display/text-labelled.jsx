import React from 'react';

import Text from './text.jsx';

var TextLabelled = React.createClass({
    render: function() {
        var content = 
            <span>
                <strong>{this.props.label}: </strong>
                <Text {...this.props} />
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

module.exports = TextLabelled;