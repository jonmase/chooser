import React from 'react';
import Wysiwyg from '../wysiwyg.jsx';

var DescriptionField = React.createClass({
    render: function() {
        return (
            <Wysiwyg
                field={{
                    defaultValue: this.props.value,
                    instructions: "Enter the description of this option. Select text to format it or create links. Use the + icon to add images, links or tables.",
                    label: "Description",
                    name: "description",
                    onChange: this.props.onChange,
                }}
            />
        );
    }
});

module.exports = DescriptionField;