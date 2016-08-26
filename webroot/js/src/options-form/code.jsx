import React from 'react';
import TextField from '../fields/text.jsx';

var CodeField = React.createClass({
    render: function() {
        return (
            <TextField
                field={{
                    instructions: "Enter text",
                    label: "Code",
                    name: "code",
                    required: true,
                    section: false,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = CodeField;