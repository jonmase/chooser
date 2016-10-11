import React from 'react';

import Wysiwyg from './wysiwyg.jsx';

var WysiwygLabelled = React.createClass({
    render: function() {
        return (
            <div style={{marginTop: '1em'}}>
                <strong>{this.props.label}: </strong><br />
                <Wysiwyg {...this.props} />
            </div>
        );
    }
});

module.exports = WysiwygLabelled;