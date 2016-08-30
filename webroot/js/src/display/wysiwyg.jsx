import React from 'react';

var WysiwygDisplay = React.createClass({
    createMarkup: function() {
        return {__html: this.props.field.value};
    },

    render: function() {
        return (
            <div>
                <strong>{this.props.field.label}: </strong><br />
                <div dangerouslySetInnerHTML={this.createMarkup()} />
            </div>
        );
    }
});

module.exports = WysiwygDisplay;