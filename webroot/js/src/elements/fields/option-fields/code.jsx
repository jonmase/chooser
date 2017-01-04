import React from 'react';
import TextField from '../text.jsx';

var CodeField = React.createClass({
    render: function() {
        return (
            <TextField
                field={{
                    defaultValue: this.props.value,
                    instructions: "Enter text",
                    label: "Code*",
                    name: "code",
                    onChange: this.props.onChange,
                    required: true,
                    section: false,
                }}
            />
        );
    }
});

module.exports = CodeField;