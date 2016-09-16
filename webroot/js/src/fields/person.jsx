import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

import TextField from '../fields/text.jsx';
import EmailField from '../fields/email.jsx';
import FieldLabel from '../elements/label.jsx';

var PersonField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        var xs = 12;
        var sm = 6;
        var md = 4;
        var lg = 3;
        var colClasses = 'col-xs-' + xs + ' col-sm-' + sm + ' col-md-' + md + ' col-lg-' + lg
        
        return (
            <div className={field.section?'section':''}>
                <FieldLabel
                    label={field.label}
                    instructions={field.instructions}
                />
                <div className="row">
                    <div className={colClasses}>
                        <TextField
                            field={{
                                instructions: 'Enter Title, e.g. Dr, Prof, etc',
                                label: 'Title',
                                name: field.name + '_title',
                                required: false,
                            }}
                        />
                        <TextField
                            field={{
                                instructions: 'Enter First Name(s)',
                                label: 'First Name(s)',
                                name: field.name + '_given_name',
                                required: required,
                            }}
                        />
                        <TextField
                            field={{
                                instructions: 'Enter Last Name',
                                label: 'Last Name',
                                name: field.name + '_last_name',
                                required: required,
                            }}
                        />
                    </div>
                    <div className={colClasses}>
                        <EmailField
                            field={{
                                //instructions: 'Enter Email',
                                label: 'Email',
                                name: field.name + '_email',
                                required: false,
                            }}
                        />
                        <TextField
                            field={{
                                instructions: 'Enter Department',
                                label: 'Department',
                                name: field.name + '_department',
                                required: false,
                            }}
                        />
                        <TextField
                            field={{
                                instructions: 'Enter College',
                                label: 'College',
                                name: field.name + '_college',
                                required: false,
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = PersonField;