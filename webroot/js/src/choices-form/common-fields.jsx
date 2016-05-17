import React from 'react';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import TextField from '../fields/text.jsx';
import MultilineTextField from '../fields/multiline-text.jsx';

var CommonFields = React.createClass({
    render: function() {
        return (
            <div style={{display: this.props.type?'block':'none'}}>
                <TextField
                    field={{
                        label: "Label",
                        instructions: "Enter field label",
                        name: "label",
                        section: false,
                        required: true,
                    }}
                />
                {/*<TextField
                    label="Label"
                    hint="Enter field label"
                    name="label"
                    section={false}
                    //required
                />*/}
                {/*<Textarea
                    name="instructions"
                    label="Instructions"
                    sublabel="Enter instructions for completing this field"
                    rows={2}
                    section={true}
                />*/}
                <MultilineTextField
                    field={{
                        label: "Instructions",
                        instructions: "Enter instructions for completing this field",
                        name: "instructions",
                        section: true,
                    }}
                />
                <FormsyToggle
                    label="Required"
                    defaultToggled={false}
                    labelPosition="right"
                    name="required"
                />
                <FormsyToggle
                    label="Show this field to students"
                    defaultToggled={true}
                    labelPosition="right"
                    name="show_to_students"
                />
                <FormsyToggle
                    label="Include in form for student-defined options (where available)"
                    defaultToggled={true}
                    labelPosition="right"
                    name="in_user_defined_form"
                />
                <FormsyToggle
                    label="Allow sorting by this field"
                    defaultToggled={true}
                    labelPosition="right"
                    name="sortable"
                />
            </div>
        );
    }
});

module.exports = CommonFields;