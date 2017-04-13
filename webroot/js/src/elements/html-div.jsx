import React from 'react';

var HtmlDiv = React.createClass({
    createMarkup: function() {
        return {__html: this.props.content};
    },
    render: function() {
        return (
            <div dangerouslySetInnerHTML={this.createMarkup()} />
        );
    }
});



module.exports = HtmlDiv;