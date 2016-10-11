import React from 'react';

var UrlDisplay = React.createClass({
    render: function() {
        if(this.props.value && this.props.value.substr(0,4) !== "http") {
            var url = "http://" + this.props.value;
        }
        else {
            var url = this.props.value;
        }
        
        return (
            <a href={url} target="_blank">{this.props.value}</a>
        );
    }
});

module.exports = UrlDisplay;