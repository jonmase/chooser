import React from 'react';
import NumericField from '../fields/numeric.jsx';

var MinPlacesField = React.createClass({
    render: function() {
        return (
            <NumericField
                field={{
                    hint: "Enter a number",
                    label: "Minimum places*",
                    name: "min_places",
                    value: this.props.value,
                    required: true,
                }}
            />
        );
    }
});

module.exports = MinPlacesField;