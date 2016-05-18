import React from 'react';

import FormsyRadioGroup from 'formsy-material-ui/lib/FormsyRadioGroup';
import FormsyRadio from 'formsy-material-ui/lib/FormsyRadio';

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
                <label>
                    {field.label}<br />
                    <span className="sublabel">{field.instructions}</span>
                </label>
                <FormsyRadioGroup 
                    name={field.name}
                    required={required}
                    floatingLabelText={field.label}
                    onChange={this.props.onChange}
                >
                    {radios}
                </FormsyRadioGroup>                        
            </div>
        );
    }
});

module.exports = RadioField;