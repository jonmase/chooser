import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var TextField = React.createClass({
    render: function() {
        var required=this.props.required?true:false;
        return (
            <FormsyText
                floatingLabelText={this.props.label}
                hintText={this.props.hint}
                name={this.props.name}
                required={required}
            />
        );
    }
});

module.exports = TextField;