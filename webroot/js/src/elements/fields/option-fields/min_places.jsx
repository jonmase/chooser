import React from 'react';
import NumberField from '../number.jsx';

var MinPlacesField = React.createClass({
    render: function() {
        return (
            <NumberField
                field={{
                    instructions: "Enter a number",
                    label: "Minimum places*",
                    name: "min_places",
                    onChange: this.props.onChange,
                    required: true,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = MinPlacesField;