import React from 'react';

import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import MenuItem from 'material-ui/MenuItem';

import FilteringToggle from './filtering-toggle.jsx';
import MultilineTextField from '../fields/multiline-text.jsx';
import DropdownField from '../fields/dropdown.jsx';

var CommonFields = React.createClass({
    render: function() {
        var listTypes = [
            {
                value: 'radio',
                label: 'Radio buttons (select one)',
            },
            {
                value: 'checkbox',
                label: 'Checkboxes (select multiple)',
            },
            {
                value: 'dropdown',
                label: 'Dropdown (select one)',
            },
            /*{
                value: 'multidropdown',
                label: 'Dropdown (select multiple)',
            },*/
        ];

        return (
            <div>
                <div className="section">
                    <FilteringToggle default={true} />
                    <FormsyToggle
                        defaultToggled={false}
                        label="Use as category (for creating rules)"
                        labelPosition="right"
                        name="rule_category"
                    />
                </div>
                <DropdownField
                    field={{
                        label: "Option list type",
                        name: "list_type",
                        options: listTypes,
                        required: true,
                    }}
                    //onChange={this.typeSelectChange}
                />
                <MultilineTextField
                    field={{
                        instructions: "Enter one option per line, in the order you want them to appear",
                        label: "Options",
                        name: "list_options",
                        required: true,
                        section: false,
                    }}
                />
            </div>
        );
    }
});

module.exports = CommonFields;