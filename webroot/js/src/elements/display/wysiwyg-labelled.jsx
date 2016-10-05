import React from 'react';

import Wysiwyg from './wysiwyg.jsx';

var WysiwygLabelled = React.createClass({
    render: function() {
        return (
            <div style={{marginTop: '1em'}}>
                <strong>{this.props.field.label}: </strong><br />
                <Wysiwyg field={this.props.field} />
            </div>
        );
    }
});

module.exports = WysiwygLabelled;