import React from 'react';
import TextField from '../fields/text.jsx';

var CodeField = React.createClass({
    render: function() {
        return (
            <TextField
                label="Code"
                hint="Enter text"
                name="code"
                required={true}
            />
        );
    }
});

module.exports = CodeField;