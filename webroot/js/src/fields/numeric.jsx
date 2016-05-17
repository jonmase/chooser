import React from 'react';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

Formsy.addValidationRule('numberMin', (values, value, minValue) => {
    value = parseInt(value);
    //If value is not a number, don't invalidate it based on this rule
    //Will be caught by isNumber or isInt rules anyway
    if(isNaN(value)) {
        return true;
    }
    return value >= minValue;
});

Formsy.addValidationRule('numberMax', (values, value, maxValue) => {
    value = parseInt(value);
    //If value is not a number, don't invalidate it based on this rule
    //Will be caught by isNumber or isInt rules anyway
    if(isNaN(value)) {
        return true;
    }
    return value <= maxValue;
});

var NumericField = React.createClass({
    render: function() {
        var field = this.props.field;
        var required=field.required?true:false;
        
        var validations = {
            isNumeric: true,
        };

        var validationErrors = {
            isNumeric: "Please enter a number",
        };

        if(typeof(field.extra) !== "undefined") {
            if(typeof(field.extra.integer) !== "undefined") {
                validations.isInt = true;
                validationErrors.isInt = "Please enter an integer";
            }
            if(typeof(field.extra.number_min) !== "undefined") {
                validations.numberMin = field.extra.number_min;
                validationErrors.numberMin = "The minimum value is " + field.extra.number_min;
            }
            if(typeof(field.extra.number_max) !== "undefined") {
                validations.numberMax = field.extra.number_max;
                validationErrors.numberMax = "The maximum value is " + field.extra.number_max;
            }
        }
       
        return (
            <div className={field.section?'section':''}>
                <FormsyText
                    floatingLabelText={field.label}
                    hintText={field.instructions}
                    name={field.name}
                    required={required}
                    validations={validations}
                    validationErrors={validationErrors}
                />
            </div>
        );
    }
});

module.exports = NumericField;