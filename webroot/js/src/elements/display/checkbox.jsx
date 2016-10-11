import React from 'react';

var CheckboxDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {this.props.options.map(function(option) {
                    if(this.props.value && this.props.value[option.value]) {
                        return option.label + "; ";
                    }
                }, this)}
            </span>
        );
    }
});

module.exports = CheckboxDisplay;