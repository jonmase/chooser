import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var TextField = React.createClass({
    render: function() {
        var required=this.props.field.required?true:false;
        return (
            <div className={this.props.field.section?'section':''}>
                <FormsyText
                    floatingLabelText={this.props.field.label}
                    hintText={this.props.field.instructions}
                    name={this.props.field.name}
                    required={required}
                />
            </div>
        );
    }
});

module.exports = TextField;