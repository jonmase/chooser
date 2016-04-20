var React = require('react');
var Formsy = require('formsy-react');
var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');
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

    handleChange: function(currentValues, isChanged) {
        if(typeof(currentValues.notify) !== 'undefined' && isChanged) {
            this.props.handlers.change();
        }
    },
    
    handleSubmit: function(data) {
        this.props.handlers.submit(data);
    },
  
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={false}
            >
                <CardHeader
                    title="Default Settings"
                    subtitle="Change the default role settings for this Choice"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                >
                    <Formsy.Form
                        id="roles_settings_form"
                        method="POST"
                        onValidSubmit={this.handleSubmit}
                        onChange={this.handleChange}
                    >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div>Default role(s) for new 'Instructors' (i.e. maintainers and contributors in WebLearn):</div>
                                <RoleCheckboxes nameBase="defaultRoles" roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <FormsyToggle
                                    label={<span><span>Notify users by email when they are given additional roles</span><br /><span className="sublabel">Default setting that can be overridden when additional roles are given</span></span>}
                                    defaultToggled={this.props.state.notify}
                                    labelPosition="right"
                                    name="notify"
                                />
                            </div>
                        </div>
                        <RaisedButton 
                            label={this.props.state.settingsButton.label} 
                            primary={true} 
                            type="submit"
                            disabled={this.props.state.settingsButton.disabled}
                        />
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = RolesSettingsForm;