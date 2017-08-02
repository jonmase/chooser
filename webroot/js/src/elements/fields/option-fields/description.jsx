import React from 'react';
import Wysiwyg from '../wysiwyg.jsx';

var DescriptionField = React.createClass({
    render: function() {
        return (
            <Wysiwyg
                field={{
                    instructions: "Enter the description of this option. Select text to format it or create links. Use the + icon to add images, links or tables.",
                    label: "Description",
                    name: "description",
                    onBlur: this.props.onBlur,
                    onChange: this.props.onChange,
                    onFocus: this.props.onFocus,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = DescriptionField;