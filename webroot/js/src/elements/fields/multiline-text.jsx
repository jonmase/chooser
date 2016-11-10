import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import MaterialTextField from 'material-ui/TextField';

var MultilineTextField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        //var rows=this.props.rows?this.props.rows:2;
        //var maxRows=this.props.maxRows?this.props.maxRows:false;
        
        return (
            <div className={field.section?'section':''}>
                <FormsyText
                    defaultValue={field.defaultValue}
                    //floatingLabelFixed={true}
                    floatingLabelText={field.label}
                    fullWidth={true}
                    hintText={field.instructions}
                    //maxRows={maxRows}
                    multiLine={true}
                    name={field.name}
                    onChange={field.onChange}
                    required={required}
                    //rows={rows}
                    value={field.value}
                />
            </div>
        );
    }
});

module.exports = MultilineTextField;