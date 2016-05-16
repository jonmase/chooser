import React from 'react';
import TextField from '../fields/text.jsx';

var CodeField = React.createClass({
    render: function() {
        return (
            <TextField
                field={{
                    label: "Code",
                    instructions: "Enter text",
                    name: "code",
                    section: false,
                    required: true,
                }}
            />
            /*<TextField
                label="Code"
                hint="Enter text"
                name="code"
                required={true}
            />*/
        );
    }
});

module.exports = CodeField;