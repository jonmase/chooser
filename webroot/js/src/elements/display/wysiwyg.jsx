import React from 'react';

var WysiwygDisplay = React.createClass({
    createMarkup: function() {
        return {__html: this.props.field.value};
    },

    render: function() {
        return (
            <div dangerouslySetInnerHTML={this.createMarkup()} />
        );
    }
});

module.exports = WysiwygDisplay;