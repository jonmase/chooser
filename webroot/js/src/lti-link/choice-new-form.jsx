import React from 'react';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';
import RaisedButton from 'material-ui/RaisedButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from '../theme.jsx';

var NewChoiceForm = React.createClass({
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
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <Formsy.Form
                    id="new_choice_form"
                    method="POST"
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    onValidSubmit={this.submitForm}
                    noValidate
                >
                    <div className="section">
                        <FormsyText 
                            name="name"
                            hintText="Enter Choice name" 
                            floatingLabelText="Choice name (required)"
                            validations="minLength:1"
                            validationError="Please give your Choice a name"
                            required
                        />
                    </div>
                    <div className="section">
                        <FormsyToggle
                            label="Allow indirect access to this Choice (need to expand on what this means)"
                            defaultToggled={true}
                            labelPosition="right"
                            name="indirect_access"
                        />
                    </div>
                    <RaisedButton 
                        label="Create" 
                        primary={true} 
                        type="submit"
                        disabled={!this.state.canSubmit}
                    />
                </Formsy.Form>
            </MuiThemeProvider>
        );
    }
});

module.exports = NewChoiceForm;