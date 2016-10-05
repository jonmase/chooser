import React from 'react';

var UrlDisplay = React.createClass({
    render: function() {
        if(this.props.field.value && this.props.field.value.substr(0,4) !== "http") {
            this.props.field.url = "http://" + this.props.field.value;
        }
        else {
            this.props.field.url = this.props.field.value;
        }
        
        return (
            <a href={this.props.field.url} target="_blank">{this.props.field.value}</a>
        );
    }
});

module.exports = UrlDisplay;