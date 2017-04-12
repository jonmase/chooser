import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

var ResetContainer = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            confirmDialogOpen: false,
            confirmButtonEnabled: true,
            confirmButtonLabel: 'Confirm',
            rules: true,
            settings: true,
            snackbar: {
                open: false,
                message: '',
            },
            unpublish: false,
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

    handleConfirmDialogClose: function() {
        this.setState({
            confirmDialogOpen: false,
        });
    },
    
    handleResetClick: function() {
        this.setState({
            confirmDialogOpen: true,
        });
    },
    
    handleToggle: function(event, value) {
        var stateData = {};
        stateData[event.target.name] = value;
        
        this.setState(stateData);
    },
    
    handleConfirm: function() {
        this.refs.reset.submit();
    },
    
    //Submit the form
    handleSubmit: function (data) {
        this.setState({
            confirmButtonEnabled: false,
            confirmButtonLabel: 'Resetting',
        });
        
        //Save the settings
        var url = 'reset';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                //Redirect back to the settings view page
                window.location.href = 'view';
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    confirmButtonEnabled: true,
                    confirmButtonLabel: 'Retry',
                });
                console.error(url, status, err.toString());
                
                this.handleSnackbarOpen('Save error (' + err.toString() + ')');
            }.bind(this)
        }); 
    },

    handleSnackbarOpen: function(message) {
        this.setState({
            snackbar: {
                open: true,
                message: message,
            },
        });
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit}
                label="Reset"
                onTouchTap={this.handleResetClick}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Reset Choice"} />}
        />;
        
        var confirmActions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleConfirmDialogClose}
            />,
            <FlatButton
                key="submit"
                label={this.state.confirmButtonLabel}
                onTouchTap={this.handleConfirm}
                primary={true}
                type="submit"
            />,
        ];
        
        var confirmDialog = 
            <Dialog
                actions={confirmActions}
                onRequestClose={this.handleConfirmDialogClose}
                open={this.state.confirmDialogOpen}
                title="Confirm Reset"
            >
                <p>Are you sure you want to reset this Choice? When you click Confirm, the following will happen:</p>
                <ul>
                    <li>The current schedule and associated results will be archived. You will still be able to view these later.</li>
                    {/*<li>Options will {this.state.unpublish?'':'not '}be unpublished</li>*/}
                    <li>The Choice Settings will be {this.state.settings?'kept':'reset'}</li>
                    <li>The Rules will be {this.state.rules?'kept':'reset'}</li>
                </ul>
            </Dialog>

        var snackbar = <Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={3000}
            onRequestClose={this.handleSnackbarClose}
        />

        return (
            <Container topbar={topbar} title={false}>
                <p style={{marginTop: '0px'}}>Resetting the Choice will archive the current schedule and the associated results. You will still be able to view archived the schedule and results. Any additional permissions given to users, the options form and all options will be kept.</p>
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
                    {/*<FormsyToggle
                        //defaultToggled={false}
                        label="Unpublish all Options? (Options will have to be published again before they are visible to viewers)"
                        labelPosition="right"
                        name="unpublish"
                        onChange={this.handleToggle}
                        value={this.state.unpublish}
                    />*/}
                    <FormsyToggle
                        //defaultToggled={true}
                        label="Keep Choice Settings? (The Choice Settings, including instructions, preference settings, etc., will be kept, but the dates will be reset)"
                        labelPosition="right"
                        name="settings"
                        onChange={this.handleToggle}
                        value={this.state.settings}
                    />
                    <FormsyToggle
                        //defaultToggled={true}
                        label="Keep Rules?"
                        labelPosition="right"
                        name="rules"
                        onChange={this.handleToggle}
                        value={this.state.rules}
                    />
                </Formsy.Form>
                {confirmDialog}
                {snackbar}
            </Container>
        );
    }
});

module.exports = ResetContainer;