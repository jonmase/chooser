import React from 'react';
import NumericField from '../fields/numeric.jsx';

var MinPlacesField = React.createClass({
    render: function() {
        return (
            <NumericField
                field={{
                    label: "Minimum places",
                    hint: "Enter a number",
                    name: "min_places",
                }}
            />
        );
    }
});

module.exports = MinPlacesField;