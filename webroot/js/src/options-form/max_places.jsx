import React from 'react';
import NumericField from '../fields/numeric.jsx';

var MaxPlacesField = React.createClass({
    render: function() {
        return (
            <NumericField
                field={{
                    label: "Maximum places",
                    hint: "Enter a number",
                    name: "max_places",
                }}
            />
        );
    }
});

module.exports = MaxPlacesField;