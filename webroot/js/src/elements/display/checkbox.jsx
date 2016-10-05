import React from 'react';

var CheckboxDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {this.props.field.options.map(function(option) {
                    if(this.props.field.value && this.props.field.value[option.value]) {
                        return option.label + "; ";
                    }
                }, this)}
            </span>
        );
    }
});

module.exports = CheckboxDisplay;