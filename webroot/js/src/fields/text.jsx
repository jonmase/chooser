import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var TextField = React.createClass({
    render: function() {
        var required=this.props.required?true:false;
        return (
            <div className={this.props.section?'section':''}>
                <FormsyText
                    floatingLabelText={this.props.label}
                    hintText={this.props.hint}
                    name={this.props.name}
                    required={required}
                />
            </div>
        );
    }
});

module.exports = TextField;