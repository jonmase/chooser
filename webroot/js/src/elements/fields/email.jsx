import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var EmailField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        var instructions = field.instructions;
        if(!instructions) {
            instructions = "name@provider.com";
        }
        
        return (
            <div className={field.section?'section':''}>
                <FormsyText
                    className="standard-width-input"
                    defaultValue={field.defaultValue}
                    floatingLabelText={field.label}
                    hintText={instructions}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    onFocus={field.onFocus}
                    required={required}
                    style={field.style}
                    type="email"
                    validations="isEmail"
                    validationError="Please enter a valid email address"
                    value={field.value}
                />
            </div>
        );
    }
});

module.exports = EmailField;