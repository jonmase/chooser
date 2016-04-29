import React from 'react';
import TextField from '../fields/text.jsx';

var TitleField = React.createClass({
    render: function() {
        return (
            <TextField
                label="Title"
                hint="Enter text"
                name="title"
                required={true}
            />
        );
    }
});

module.exports = TitleField;