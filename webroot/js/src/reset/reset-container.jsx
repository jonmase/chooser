import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

var ResetContainer = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            saveButtonEnabled: true,
            saveButtonLabel: 'Reset',
        };
    },
    componentDidMount: function() {
    },
    
    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },

    handleResetClick: function() {
    
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit && this.state.saveButtonEnabled}
                label={this.state.saveButtonLabel}
                onTouchTap={this.handleResetClick}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Reset Choice"} />}
        />;
        
        return (
            <Container topbar={topbar} title={false}>
                <p>Resetting the Choice will archive the current schedule and the associated results. You will still be able to view archived the schedule and results. Any additional permissions given to users, the options form and all options will be kept.</p>
                <p>You can also do some other 'tidying up' at this point, according to the settings you choose below. </p>
                <Formsy.Form
                    id="reset_form"
                    method="POST"
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.handleSubmit}
                    noValidate={true}
                    ref="reset"
                >
                    <FormsyToggle
                        defaultToggled={false}
                        label="Unpublish all Options? (Options will have to be published again before they are visible to viewers)"
                        labelPosition="right"
                        name="unpublish"
                    />
                    <FormsyToggle
                        defaultToggled={true}
                        label="Keep Choice Settings? (The Choice Settings, including instructions, preference settings, etc., will be kept, but the dates will be reset)"
                        labelPosition="right"
                        name="settings"
                    />
                    <FormsyToggle
                        defaultToggled={true}
                        label="Keep Rules?"
                        labelPosition="right"
                        name="rules"
                    />
                </Formsy.Form>
            </Container>
        );
    }
});

module.exports = ResetContainer;