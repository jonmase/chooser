var React = require('react');
var TextField = require('material-ui/lib/text-field');
var Toggle = require('material-ui/lib/toggle');
var Formsy = require('formsy-react');
var FormsyRadioGroup = require('formsy-material-ui/lib/FormsyRadioGroup');
var FormsyRadio = require('formsy-material-ui/lib/FormsyRadio');
var RaisedButton = require('material-ui/lib/raised-button');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var style = {
    marginBottom: 30,
};

var LinkChoiceForm = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
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
        document.forms["link_choice_form"].submit();
        //console.log("Model: ", model);
    },

    render: function() {
        var radioNodes = this.props.data.map(function(choice) {
            return (
                <FormsyRadio
                    key={choice.Choices.id}
                    value={choice.Choices.id}
                    label={choice.Choices.name}
                />
            );
        });

        return (
            <Formsy.Form
                id="link_choice_form"
                method="POST"
                action="link"
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.submitForm}
            >
                <FormsyRadioGroup 
                    name="choice"
                    required
                >
                    {radioNodes}
                </FormsyRadioGroup>
                <RaisedButton 
                    label="Select" 
                    primary={true} 
                    type="submit"
                    disabled={!this.state.canSubmit}
                />
            </Formsy.Form>
        );
    }
});

module.exports = LinkChoiceForm;