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
    handleSubmit: function (user) {
        this.props.onUserSubmit(user);
    },
    
    handleDialogOpen: function() {
        this.props.onUserDialogOpen();
    },
    
    handleDialogClose: function() {
        this.props.onUserDialogClose();
    },
    
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
                    onTouchTap={this.handleDialogOpen}
                />
                <Dialog
                    title="Add User with additional roles"
                    actions={actions}
                    modal={true}
                    open={this.props.state.userDialogOpen}
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
                            <RoleCheckboxes roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />
                        </div>
                        <FormsyToggle
                            label="Notify this user of their additional roles by email"
                            defaultToggled={this.props.state.notify}
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