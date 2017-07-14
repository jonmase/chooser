import React from 'react';

import Wysiwyg from './wysiwyg.jsx';

var WysiwygLabelled = React.createClass({
    render: function() {
        var content = 
            <span>
                <strong>{this.props.label}: </strong><br />
                <Wysiwyg {...this.props} />
            </span>;
    
        if(this.props.paragraph) {
            return (
                <div style={{marginTop: '1em'}}>{content}</div>
            );
        }
        else {
            return content;
        }
    }
});

module.exports = WysiwygLabelled;