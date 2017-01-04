import React from 'react';
import NumberField from '../number.jsx';

var MaxPlacesField = React.createClass({
    render: function() {
        return (
            <NumberField
                field={{
                    defaultValue: this.props.value,
                    instructions: "Enter a number",
                    label: "Maximum places*",
                    name: "max_places",
                    onChange: this.props.onChange,
                    required: true,
                }}
            />
        );
    }
});

module.exports = MaxPlacesField;