import React from 'react';

import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import MenuItem from 'material-ui/MenuItem';

import FilteringToggle from './filtering-toggle.jsx';
import Textarea from '../fields/textarea.jsx';

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
                label: 'Dropdown list (select one)',
            },
            {
                type: 'multidropdown',
                label: 'Dropdown list (select multiple)',
            },
        ];

        var typeMenuItems = listTypes.map(function(type) {
            return (
                <MenuItem value={type.type} key={type.type} primaryText={type.label} />
            );
        });
    
        return (
            <div style={{display: (this.props.type === 'list')?'block':'none'}}>
                <div>
                    <FilteringToggle default={true} />
                    <FormsyToggle
                        label="Use as category (for creating rules)"
                        defaultToggled={false}
                        labelPosition="right"
                        name="rule_category"
                    />
                </div>
                <div className="section">
                    <FormsySelect
                        name="type"
                        required
                        floatingLabelText="List type"
                        onChange={this.typeSelectChange}
                    >
                        {typeMenuItems}
                    </FormsySelect>                        
                </div>
                <Textarea
                    name="options"
                    label="Options"
                    sublabel="Enter one option per line, in the order you want them to appear"
                    rows={3}
                    section={true}
                />
            </div>
        );
    }
});

module.exports = CommonFields;