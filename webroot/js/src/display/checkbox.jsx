import React from 'react';

var TextDisplay = React.createClass({
    render: function() {
        var field = this.props.field;
        
        
        return (
            <p>
                <strong>{field.label}: </strong>
                {field.options.map(function(option) {
                    if(field.value && field.value[option.value]) {
                        return option.label + "; ";
                    }
                })}
            </p>
        );
    }
});

module.exports = TextDisplay;