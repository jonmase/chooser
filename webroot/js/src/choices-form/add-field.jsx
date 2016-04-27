var React = require('react');
var Formsy = require('formsy-react');
var FormsyText = require('formsy-material-ui/lib/FormsyText');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');
var FlatButton = require('material-ui/lib/flat-button');
var IconButton = require('material-ui/lib/icon-button');
var Dialog = require('material-ui/lib/dialog');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var ContentAdd = require('material-ui/lib/svg-icons/content/add');

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

    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="submit"
                label="Submit"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        
        return (
            <span>
                <IconButton
                    tooltip="Add Field"
                    onTouchTap={this.props.handlers.dialogOpen}
                    iconClassName="material-icons"
                >
                    add
                </IconButton>         
                <Dialog
                    title="Add Extra Field"
                    open={this.props.state.extraDialogOpen}
                    onRequestClose={this.props.handlers.dialogClose}
                >
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.props.handlers.submit}
                        noValidate
                    >
                        
                    
                        <div style={{textAlign: 'right'}}>
                            {actions}
                        </div>
                    </Formsy.Form>
                </Dialog>
            </span>
        );
    }
});

module.exports = AddUser;