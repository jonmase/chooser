import React from 'react';
import TextField from '../fields/text.jsx';

var TitleField = React.createClass({
    render: function() {
        return (
            <TextField
                field={{
                    instructions: "Enter text",
                    label: "Title*",
                    name: "title",
                    required: true,
                    section: false,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = TitleField;