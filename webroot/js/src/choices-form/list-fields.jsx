import React from 'react';

import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import MenuItem from 'material-ui/MenuItem';

import FilteringToggle from './filtering-toggle.jsx';
import MultilineTextField from '../fields/multiline-text.jsx';

var CommonFields = React.createClass({
    render: function() {
        var listTypes = [
            {
                type: 'radio',
                label: 'Radio buttons (select one)',
            },
            {
                type: 'checkbox',
                label: 'Checkboxes (select multiple)',
            },
            {
                type: 'dropdown',
                label: 'Dropdown (select one)',
            },
            {
                type: 'multidropdown',
                label: 'Dropdown (select multiple)',
            },
        ];

        var typeMenuItems = listTypes.map(function(type) {
            return (
                <MenuItem value={type.type} key={type.type} primaryText={type.label} />
            );
        });
    
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
                <FormsySelect
                    name="list_type"
                    required
                    floatingLabelText="List type"
                    onChange={this.typeSelectChange}
                >
                    {typeMenuItems}
                </FormsySelect>                        
                <MultilineTextField
                    name="list_options"
                    label="Options"
                    hint="Enter one option per line, in the order you want them to appear"
                    required
                />
            </div>
        );
    }
});

module.exports = CommonFields;