var React = require('react');
var TextField = require('material-ui/lib/text-field');
var Toggle = require('material-ui/lib/toggle');
var Formsy = require('formsy-react');
var FormsyText = require('formsy-material-ui/lib/FormsyText');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var NewChoiceForm = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },

    getInitialState: function () {
        return {
            canSubmit: false
        };
    },

    enableButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableButton: function () {
        this.setState({
            canSubmit: false
        });
    },

    submitForm: function (model) {
        // Submit your validated form
        document.forms["new_choice_form"].submit();
        //console.log("Model: ", model);
    },

    render: function() {
        return (
            <Formsy.Form
                id="new_choice_form"
                method="POST"
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.submitForm}
                noValidate
            >
                <FormsyText 
                    name="name"
                    hintText="Enter Choice name" 
                    floatingLabelText="Choice name (required)"
                    validations="minLength:1"
                    validationError="Please give your Choice a name"
                    required
                />
                <FormsyToggle
                    label="Allow indirect access to this Choice (need to expand on what this means)"
                    defaultToggled={true}
                    labelPosition="right"
                    name="indirect_access"
                />
                <RaisedButton 
                    label="Create" 
                    primary={true} 
                    type="submit"
                    disabled={!this.state.canSubmit}
                />
            </Formsy.Form>
        );
    }
});

module.exports = NewChoiceForm;