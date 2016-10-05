import React from 'react';
import NumberField from '../number.jsx';

var PointsField = React.createClass({
    render: function() {
        return (
            <NumberField
                field={{
                    hint: "Enter a number",
                    label: "Points*",
                    name: "points",
                    value: this.props.value,
                    required: true,
                }}
            />
        );
    }
});

module.exports = PointsField;