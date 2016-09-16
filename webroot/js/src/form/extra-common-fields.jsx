import React from 'react';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import TextField from '../elements/fields/text.jsx';
import MultilineTextField from '../elements/fields/multiline-text.jsx';

var CommonFields = React.createClass({
    render: function() {
        var values = this.props.values?this.props.values:{};
    
        var toggles = [];
        var toggleKeys = [];
        
        var requirableFields = ['text', 'list', 'number', 'email', 'url', 'date', 'datetime', 'person'];
        if(requirableFields.indexOf(this.props.type) > -1) {
            toggles.push(<FormsyToggle
                defaultToggled={(typeof(values.required) !== 'undefined')?values.required:false}
                label="Required"
                labelPosition="right"
                name="required"
            />);
            toggleKeys.push("required");
        }
        toggles.push(<FormsyToggle
            defaultToggled={(typeof(values.show_to_students) !== 'undefined')?values.show_to_students:true}
            label="Show this field to students"
            labelPosition="right"
            name="show_to_students"
        />);
        toggleKeys.push("show_to_students");
        
        toggles.push(<FormsyToggle
            defaultToggled={(typeof(values.in_user_defined_form) !== 'undefined')?values.in_user_defined_form:true}
            key="in_user_defined_form"
            label="Include in form for student-defined options (where available)"
            labelPosition="right"
            name="in_user_defined_form"
        />);
        toggleKeys.push("in_user_defined_form");
        
        toggles.push(<FormsyToggle
            defaultToggled={(typeof(values.sortable) !== 'undefined')?values.sortable:true}
            label="Allow sorting by this field"
            labelPosition="right"
            name="sortable"
        />);
        toggleKeys.push("sortable");

        var filterableFields = ['list', 'number', 'date', 'datetime', 'person'];
        if(filterableFields.indexOf(this.props.type) > -1) {
            var defaultValue = false;
            if((typeof(values.filterable) !== 'undefined')) {
                defaultValue = values.filterable;
            }
            else {
                //Only list type is filterable by default
                if(this.props.type === 'list') {
                    defaultValue = true;
                }
            }
            
            toggles.push(<FormsyToggle
                defaultToggled={defaultValue}
                label="Allow filtering by this field"
                labelPosition="right"
                name="filterable"
            />);
            toggleKeys.push("filterable");
        }
        
        var categoryFields = ['list'];
        if(categoryFields.indexOf(this.props.type) > -1) {
            toggles.push(<FormsyToggle
                defaultToggled={(typeof(values.rule_category) !== 'undefined')?values.rule_category:false}
                label="Use as category (for creating rules)"
                labelPosition="right"
                name="rule_category"
            />);
            toggleKeys.push("rule_category");
        }

        return (
            <div style={{display: this.props.type?'block':'none'}}>
                <TextField
                    field={{
                        label: "Label",
                        instructions: "Enter field label",
                        name: "label",
                        section: false,
                        required: true,
                        value: values.label,
                    }}
                />
                <MultilineTextField
                    field={{
                        label: "Instructions",
                        instructions: "Enter instructions for completing this field",
                        name: "instructions",
                        section: true,
                        value: values.instructions,
                    }}
                />
                <div className={(this.props.type !== 'number')?'section':''}>
                    {toggles.map(function(toggle, index) {
                        return (
                            <div key={toggleKeys[index]}>
                                {toggle}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = CommonFields;