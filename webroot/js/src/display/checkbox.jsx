import React from 'react';

var TextDisplay = React.createClass({
    render: function() {
        var field = this.props.field;
        
        
        return (
            <p>
                <strong>{field.label}: </strong>
                {field.value?Object.keys(field.value).sort().map(function(key) {
                    if(field.value[key]) {
                        return key + "; ";
                    }
                }):""}
            </p>
        );
    }
});

module.exports = TextDisplay;