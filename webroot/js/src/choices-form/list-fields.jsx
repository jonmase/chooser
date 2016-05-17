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
                        label="Use as category (for creating rules)"
                        defaultToggled={false}
                        labelPosition="right"
                        name="rule_category"
                    />
                </div>
                <DropdownField
                    name="list_type"
                    options={listTypes}
                    required={true}
                    label="Option list type"
                    //onChange={this.typeSelectChange}
                />
                <MultilineTextField
                    field={{
                        name: "list_options",
                        label: "Options",
                        instructions: "Enter one option per line, in the order you want them to appear",
                        required: true,
                        section: false,
                    }}
                />
            </div>
        );
    }
});

module.exports = CommonFields;