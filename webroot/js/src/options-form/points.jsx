import React from 'react';
import NumericField from '../fields/numeric.jsx';

var PointsField = React.createClass({
    render: function() {
        return (
            <NumericField
                field={{
                    label: "Points",
                    hint: "Enter a number",
                    name: "points",
                }}
            />
        );
    }
});

module.exports = PointsField;