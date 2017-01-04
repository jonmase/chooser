import React from 'react';
import NumberField from '../number.jsx';

var MaxPlacesField = React.createClass({
    render: function() {
        return (
            <NumberField
                field={{
                    instructions: "Enter a number",
                    label: "Maximum places*",
                    name: "max_places",
                    onChange: this.props.onChange,
                    required: true,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = MaxPlacesField;