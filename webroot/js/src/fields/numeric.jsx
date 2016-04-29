var React = require('react');
var FormsyText = require('formsy-material-ui/lib/FormsyText');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var NumericField = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },
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