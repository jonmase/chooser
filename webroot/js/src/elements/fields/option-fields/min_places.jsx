import React from 'react';
import NumberField from '../number.jsx';

var MinPlacesField = React.createClass({
    render: function() {
        return (
            <NumberField
                field={{
                    defaultValue: this.props.value,
                    instructions: "Enter a number",
                    label: "Minimum places*",
                    name: "min_places",
                    onChange: this.props.onChange,
                    required: true,
                }}
            />
        );
    }
});

module.exports = MinPlacesField;