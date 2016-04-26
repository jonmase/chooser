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
                        {/*<div className="row">*/}
                            <p className="no-top-margin">Please note that 'Instructors' means anyone who has maintain or contribute permissions on a WebLearn site from which this Choice is linked.</p>
                            {/*<div className="col-xs-12 col-sm-6">*/}
                                {/*<p>
                                    Default permissions for 'Instructors' (i.e. maintainers and contributors in WebLearn):<br />
                                    <span className="sublabel">You can give users further permissions in the "Additional Permissions" section below.</span>
                                </p>*/}
                                {/*<RoleCheckboxes nameBase="defaultRoles" roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />*/}
                                <FormsyCheckbox
                                    name="defaultRoles.editor"
                                    label="Allow Instructors to create/edit their own options and profile (in most situations, you would want this ticked)"
                                    defaultChecked={this.props.state.defaultRoles['editor']}
                                />
                                <FormsyCheckbox
                                    name="defaultRoles.reviewer"
                                    label="Allow Instructors to view all the students selections (normally they would only see who has selected their own options)"
                                    defaultChecked={this.props.state.defaultRoles['reviewer']}
                                />
                            {/*</div>
                            <div className="col-xs-12 col-sm-6">*/}
                                <FormsyToggle
                                    label={<span><span>Notify users by email when they are given additional roles</span><br /><span className="sublabel">Default setting that can be overridden when additional roles are given</span></span>}
                                    defaultToggled={this.props.state.notify}
                                    labelPosition="right"
                                    name="notify"
                                />
                            {/*</div>
                        </div>*/}
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