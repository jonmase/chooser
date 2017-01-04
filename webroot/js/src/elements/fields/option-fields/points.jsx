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
                    onChange: this.props.onChange,
                    required: true,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = PointsField;