import React from 'react';

import FormsyRadioGroup from 'formsy-material-ui/lib/FormsyRadioGroup';
import FormsyRadio from 'formsy-material-ui/lib/FormsyRadio';

import FieldLabel from './label.jsx';

var RadioField = React.createClass({
    render: function() {
        var field = this.props.field;

        var radios = field.options.map(function(option) {
            return (
                <FormsyRadio value={option.value} key={option.value} label={option.label} />
            );
        });
    
        var required=field.required?true:false;
        
        return (
            <div className={field.section?'section':''}>
                <FieldLabel
                    instructions={field.instructions}
                    label={field.label}
                />
                <FormsyRadioGroup 
                    defaultSelected={field.defaultValue}
                    floatingLabelText={field.label}
                    name={field.name}
                    onChange={field.onChange}
                    required={required}
                    value={field.value}
                >
                    {radios}
                </FormsyRadioGroup>                        
            </div>
        );
    }
});

module.exports = RadioField;