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
                    onChange: this.props.onChange,
                    value: this.props.value,
                }}
            />
        );
    }
});

module.exports = DescriptionField;