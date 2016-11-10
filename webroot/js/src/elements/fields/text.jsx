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
        if(field.fullWidth) {
            inputClass += 'full-width';
        }
        
        return (
            <div className={divClass}>
                <FormsyText
                    className={inputClass}
                    defaultValue={field.defaultValue}
                    floatingLabelText={field.label}
                    hintText={field.instructions}
                    name={field.name}
                    required={required}
                    style={field.style}
                    value={field.value}
                />
            </div>
        );
    }
});

module.exports = TextField;