var React = require('react');
var Formsy = require('formsy-react');
var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');
var Snackbar = require('material-ui/lib/snackbar');
var Card  = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText  = require('material-ui/lib/card/card-text');
//var CardActions  = require('material-ui/lib/card/card-actions');
var RoleCheckboxes = require('./role-checkboxes.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var RolesSettingsForm = React.createClass({
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
            settingsButtonDisabled: false,
            snackbarOpen: false,
            snackbarMessage: '',
        };
    },

    //Submit the setting forms
    submitForm: function (settings) {
        this.setState({
            settingsButtonDisabled: true
        });

        console.log("Saving settings for Choice " + this.props.choice.id + ": ", settings);
        
        //Save the settings
        var url = '../role_settings/' + this.props.choice.id;
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
        });  
    },

    handleRequestClose: function() {
        this.setState({
            snackbarOpen: false,
            snackbarMessage: '',
        });
    },
  
    render: function() {
        return (
            <Card 
                //initiallyExpanded={false}
            >
                <CardHeader
                    title="Default Settings"
                    subtitle="Change the default role settings for this Choice"
                    //actAsExpander={true}
                    //showExpandableButton={true}
                />
                <CardText 
                    //expandable={true}
                >
                    <Formsy.Form
                        id="roles_settings_form"
                        method="POST"
                        onValidSubmit={this.submitForm}
                    >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div>Default role(s) for new 'Instructors' (i.e. maintainers and contributors in WebLearn):</div>
                                <RoleCheckboxes defaultRoles={this.props.choice.instructor_default_roles} roleOptions={this.props.roleOptions} />
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <FormsyToggle
                                    label={<span><span>Notify users by email when they are given additional roles</span><br /><span>(default setting that can be overridden when additional roles are given)</span></span>}
                                    defaultToggled={this.props.choice.notify_additional_permissions}
                                    labelPosition="right"
                                    name="notify"
                                />
                            </div>
                        </div>
                        <RaisedButton 
                            label="Save" 
                            primary={true} 
                            type="submit"
                            disabled={this.state.settingsButtonDisabled}
                            className="no-bottom-margin"
                        />
                        <Snackbar
                            open={this.state.snackbarOpen}
                            message={this.state.snackbarMessage}
                            autoHideDuration={3000}
                            onRequestClose={this.handleRequestClose}
                        />
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = RolesSettingsForm;