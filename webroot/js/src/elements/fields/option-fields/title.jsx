import React from 'react';
import TextField from '../text.jsx';

var TitleField = React.createClass({
    render: function() {
        return (
            <TextField
                field={{
                    fullWidth: true,
                    instructions: "Enter text",
                    label: "Title*",
                    name: "title",
                    onChange: this.props.onChange,
                    required: true,
                    section: false,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = TitleField;