var React = require('react');
var Formsy = require('formsy-react');
var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var FormsyText = require('formsy-material-ui/lib/FormsyText');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');
var FlatButton = require('material-ui/lib/flat-button');
var Snackbar = require('material-ui/lib/snackbar');
var Dialog = require('material-ui/lib/dialog');
//var Card = require('material-ui/lib/card/card');
//var CardHeader = require('material-ui/lib/card/card-header');
//var CardText = require('material-ui/lib/card/card-text');
//var CardActions  = require('material-ui/lib/card/card-actions');
var RoleCheckboxes = require('./role-checkboxes.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var AddUser = React.createClass({
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
            canSubmit: false,
            dialogOpen: false,
            userButtonDisabled: false,
            //snackbarOpen: false,
            //snackbarMessage: null,
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

    //Submit the user form
    handleSubmit: function (settings) {
        alert('submitted user form');
        /*this.setState({
            settingsButtonDisabled: true
        });

        console.log("Saving settings for Choice " + this.props.choice.id + ": ", settings);
        
        //Save the settings
        var url = '../add_user/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: settings,
            success: function(data) {
                console.log(data.response);
                this.setState({
                    settingsButtonDisabled: false,
                    snackbarOpen: true,
                    snackbarMessage: data.response,
                });
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    settingsButtonDisabled: false,
                    snackbarOpen: true,
                    snackbarMessage: 'Save error (' + err.toString() + ')',
                });
                console.error(url, status, err.toString());
            }.bind(this)
        });*/
    },
    
    handleDialogOpen: function() {
        this.setState({
            dialogOpen: true,
        });
    },
    
    handleDialogClose: function() {
        this.setState({
            dialogOpen: false,
        });
    },
    
    /*handleRequestClose: function() {
        this.setState({
            snackbarOpen: false,
            snackbarMessage: null,
        });
    },*/
  
    render: function() {
        var actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleDialogClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
                onTouchTap={this.handleSubmit}
            />,
        ];
        
        return (
            <div>
                <RaisedButton 
                    label="Add User" 
                    primary={true} 
                    disabled={this.state.userButtonDisabled}
                    onTouchTap={this.handleDialogOpen}
                />
                <Dialog
                    title="Add User with additional roles"
                    actions={actions}
                    modal={true}
                    open={this.state.dialogOpen}
                >
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableButton}
                        onInvalid={this.disableButton}
                        noValidate
                    >
                        <FormsyText 
                            name="username"
                            hintText="Email address or SSO username" 
                            floatingLabelText="Email/Username (required)"
                            validations="minLength:1"
                            validationError="Please enter the email address or Oxford SSO username for the user you wish to add"
                            required
                        />

                        <div>
                            <div>Which additional roles should this user have (this will override the default role(s) that they would be given when they first access the Choice):</div>
                            <RoleCheckboxes defaultRoles={this.props.choice.instructor_default_roles} roleOptions={this.props.roleOptions} />
                        </div>
                        <FormsyToggle
                                label="Notify this user of their additional roles by email"
                                defaultToggled={this.props.choice.notify_additional_permissions}
                                labelPosition="right"
                                name="notify"
                            />
                    </Formsy.Form>
                </Dialog>
            </div>
        );
    }
});

module.exports = AddUser;