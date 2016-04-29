import React from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

var NumericField = React.createClass({
    render: function() {
        var numericError = "Please enter a number";
        var required=this.props.required?true:false;
        return (
            <FormsyText
                floatingLabelText={this.props.label}
                hintText={this.props.hint}
                name={this.props.name}
                required={required}
                validations="isNumeric"
                validationError={numericError}
            />
        );
    }
});

module.exports = NumericField;