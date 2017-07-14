import React from 'react';

import Url from './url.jsx';

var UrlLabelled = React.createClass({
    render: function() {
        var content = 
            <span>
                <strong>{this.props.label}: </strong>
                <Url {...this.props} />
            </span>;
    
        if(this.props.paragraph) {
            return (
                <p>{content}</p>
            );
        }
        else {
            return content;
        }
    }
});

module.exports = UrlLabelled;