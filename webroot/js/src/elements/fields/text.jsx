import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var TextField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        var divClass = '';
        var inputClass = '';
        if(field.section) {
            divClass += 'section';
        }
        
        //Make full width
        if(field.fullWidth) {
            inputClass += 'full-width';
        }
        else {
            inputClass += 'standard-width-input';
        }
        
        return (
            <div className={divClass}>
                <FormsyText
                    className={inputClass}
                    defaultValue={field.defaultValue}
                    floatingLabelText={field.label}
                    hintText={field.instructions}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    onFocus={field.onFocus}
                    required={required}
                    style={field.style}
                    value={field.value}
                />
            </div>
        );
    }
});

module.exports = TextField;