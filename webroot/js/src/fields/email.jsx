import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var EmailField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        return (
            <div className={field.section?'section':''}>
                <FormsyText
                    floatingLabelText={field.label}
                    hintText={field.instructions}
                    name={field.name}
                    required={required}
                    validations="isEmail"
                    validationError="Please enter a valid email address"
                />
            </div>
        );
    }
});

module.exports = EmailField;