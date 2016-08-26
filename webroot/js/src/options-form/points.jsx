import React from 'react';
import NumericField from '../fields/numeric.jsx';

var PointsField = React.createClass({
    render: function() {
        return (
            <NumericField
                field={{
                    hint: "Enter a number",
                    label: "Points",
                    name: "points",
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = PointsField;