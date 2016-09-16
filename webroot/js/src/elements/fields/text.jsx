import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var TextField = React.createClass({
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
                    value={field.value}
                />
            </div>
        );
    }
});

module.exports = TextField;