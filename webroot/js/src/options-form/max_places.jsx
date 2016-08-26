import React from 'react';
import NumericField from '../fields/numeric.jsx';

var MaxPlacesField = React.createClass({
    render: function() {
        return (
            <NumericField
                field={{
                    hint: "Enter a number",
                    label: "Maximum places",
                    name: "max_places",
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = MaxPlacesField;