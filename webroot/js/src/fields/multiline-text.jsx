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
                    floatingLabelText={field.label}
                    //floatingLabelFixed={true}
                    hintText={field.instructions}
                    name={field.name}
                    required={required}
                    multiLine={true}
                    //rows={rows}
                    //maxRows={maxRows}
                    fullWidth={true}
                />
            </div>
        );
    }
});

module.exports = MultilineTextField;