import React from 'react';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import TextField from '../fields/text.jsx';
import MultilineTextField from '../fields/multiline-text.jsx';

var CommonFields = React.createClass({


    render: function() {
        var toggles = [];
        if(this.props.allowRequired) {
            toggles.push(<FormsyToggle
                defaultToggled={false}
                key="required"
                label="Required"
                labelPosition="right"
                name="required"
            />);
        }
        toggles.push(<FormsyToggle
            defaultToggled={true}
            key="show_to_students"
            label="Show this field to students"
            labelPosition="right"
            name="show_to_students"
        />);
        toggles.push(<FormsyToggle
            defaultToggled={true}
            key="in_user_defined_form"
            label="Include in form for student-defined options (where available)"
            labelPosition="right"
            name="in_user_defined_form"
        />);
        toggles.push(<FormsyToggle
            defaultToggled={true}
            key="sortable"
            label="Allow sorting by this field"
            labelPosition="right"
            name="sortable"
        />);

        if(this.props.allowFiltering) {
            var defaultValue = false;
            
            //Only list type is filterable by default
            if(this.props.state.addType === 'list') {
                defaultValue = true;
            }
            
            toggles.push(<FormsyToggle
                defaultToggled={defaultValue}
                key="filterable"
                label="Allow filtering by this field"
                labelPosition="right"
                name="filterable"
            />);
        }
        
        return (
            <div style={{display: this.props.state.addType?'block':'none'}}>
                <TextField
                    field={{
                        label: "Label",
                        instructions: "Enter field label",
                        name: "label",
                        section: false,
                        required: true,
                    }}
                />
                <MultilineTextField
                    field={{
                        label: "Instructions",
                        instructions: "Enter instructions for completing this field",
                        name: "instructions",
                        section: true,
                    }}
                />
                {toggles.map(function(toggle) {
                    return (
                        <div>
                            {toggle}
                        </div>
                    );
                })}
            </div>
        );
    }
});

module.exports = CommonFields;