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
                    onBlur: this.props.onBlur,
                    onChange: this.props.onChange,
                    onFocus: this.props.onFocus,
                    required: true,
                    section: false,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = TitleField;