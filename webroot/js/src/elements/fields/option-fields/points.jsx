import React from 'react';
import NumberField from '../number.jsx';

var PointsField = React.createClass({
    render: function() {
        return (
            <NumberField
                field={{
                    defaultValue: this.props.value,
                    hint: "Enter a number",
                    label: "Points*",
                    name: "points",
                    onChange: this.props.onChange,
                    required: true,
                }}
            />
        );
    }
});

module.exports = PointsField;