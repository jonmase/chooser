import React from 'react';

import MultilineTextField from '../elements/fields/multiline-text.jsx';
import DropdownField from '../elements/fields/dropdown.jsx';

var ListFields = React.createClass({
    render: function() {
        var values = this.props.values?this.props.values:{};

        var listTypes = [
            {
                label: 'Radio buttons (select one)',
                value: 'radio',
            },
            {
                label: 'Checkboxes (select multiple)',
                value: 'checkbox',
            },
            {
                label: 'Dropdown (select one)',
                value: 'dropdown',
            },
            /*{
                label: 'Dropdown (select multiple)',
                value: 'multidropdown',
            },*/
        ];

        return (
            <div>
                <DropdownField
                    field={{
                        label: "Option list type",
                        name: "list_type",
                        options: listTypes,
                        required: true,
                        value: values.list_type,
                    }}
                />
                <MultilineTextField
                    field={{
                        instructions: "Enter one option per line, in the order you want them to appear",
                        label: "Options",
                        name: "list_options",
                        required: true,
                        section: false,
                        value: values.list_options,
                    }}
                />
            </div>
        );
    }
});

module.exports = ListFields;