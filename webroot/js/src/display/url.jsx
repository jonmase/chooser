import React from 'react';

var UrlDisplay = React.createClass({
    render: function() {
        var field = this.props.field;

        if(field.value && field.value.substr(0,4) !== "http") {
            field.url = "http://" + field.value;
        }
        else {
            field.url = field.value;
        }
        
        return (
            <p>
                <strong>{field.label}: </strong>
                <a href={field.url} target="_blank">{field.value}</a>
            </p>
        );
    }
});

module.exports = UrlDisplay;