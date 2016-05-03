import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import MaterialTextField from 'material-ui/TextField';

var TextField = React.createClass({
    render: function() {
        var required=this.props.required?true:false;
        //var rows=this.props.rows?this.props.rows:2;
        //var maxRows=this.props.maxRows?this.props.maxRows:false;
        
        return (
            <div className={this.props.section?'section':''}>
                <FormsyText
                    floatingLabelText={this.props.label}
                    //floatingLabelFixed={true}
                    hintText={this.props.hint}
                    name={this.props.name}
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

module.exports = TextField;