var React = require('react');
var Formsy = require('formsy-react');
var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var RaisedButton = require('material-ui/lib/raised-button');
var Card  = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText  = require('material-ui/lib/card/card-text');
//var CardActions  = require('material-ui/lib/card/card-actions');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var RolesSettingsForm = React.createClass({
    //the key passed through context must be called "muiTheme"
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },

    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },

    submitForm: function (model) {
        // Submit your validated form
        //document.forms["roles_settings_form"].submit();
        
        console.log("Model: ", model);
    },

    render: function() {
        var defaultRoles = this.props.defaultRoles;
    
        var roleNodes = this.props.roleOptions.map(function(role) {
            var defaultChecked = false;
            if(defaultRoles.indexOf(role) > -1) {
                defaultChecked = true;
            }
        
            return (
                <FormsyCheckbox
                    key={role}
                    name={role}
                    label={role.charAt(0).toUpperCase() + role.substring(1)}
                    defaultChecked={defaultChecked}
                />
            );
        });

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
                        action="./link"
                        onValidSubmit={this.submitForm}
                    >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div>Default role(s) for new 'Instructors' (i.e. maintainers and contributors in WebLearn):</div>
                                {roleNodes}
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <FormsyCheckbox
                                    name="notify"
                                    label={<span><span>Notify users by email when they are given additional roles</span><br /><span>(default setting that can be overridden when additional roles are given)</span></span>}
                                    defaultChecked={false}
                                />
                            </div>
                        </div>
                        <RaisedButton 
                            label="Save" 
                            primary={true} 
                            type="submit"
                        />
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = RolesSettingsForm;