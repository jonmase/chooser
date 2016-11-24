import React from 'react';
import Formsy from 'formsy-react';
import FormsyRadioGroup from 'formsy-material-ui/lib/FormsyRadioGroup';
import FormsyRadio from 'formsy-material-ui/lib/FormsyRadio';
import RaisedButton from 'material-ui/RaisedButton';

var style = {
    marginBottom: 30,
};

var LinkChoiceForm = React.createClass({
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
        var radioNodes = this.props.choices.map(function(choice) {
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
                <h3 className="no-top-margin">Select existing Choice</h3>
                <div className="section">
                    <FormsyRadioGroup 
                        name="choice"
                        required
                    >
                        {radioNodes}
                    </FormsyRadioGroup>
                </div>
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