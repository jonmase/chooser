var React = require('react');

var Formsy = require('formsy-react');
var FormsyText = require('formsy-material-ui/lib/FormsyText');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var FormsySelect = require('formsy-material-ui/lib/FormsySelect');

var FlatButton = require('material-ui/lib/flat-button');
var IconButton = require('material-ui/lib/icon-button');

var Dialog = require('material-ui/lib/dialog');
var MenuItem = require('material-ui/lib/menus/menu-item');

var CommonFields = require('./common-fields.jsx');
var ListFields = require('./list-fields.jsx');
var NumberFields = require('./number-fields.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var AddField = React.createClass({
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
            type: null,
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

    typeSelectChange: function (event, value) {
        console.log("Field type changed to " + value);
        this.setState({
            type: value,
        });
    },

    render: function() {
        var fieldTypes = [
            {
                type: 'text',
                label: 'Simple Text',
            },
            {
                type: 'wysiwyg',
                label: 'Rich Text',
            },
            {
                type: 'list',
                label: 'Option List',
            },
            {
                type: 'number',
                label: 'Number',
            },
            {
                type: 'email',
                label: 'Email',
            },
            {
                type: 'url',
                label: 'URL',
            },
        ];
        
        var typeMenuItems = fieldTypes.map(function(field) {
            return (
                <MenuItem value={field.type} key={field.type} primaryText={field.label} />
            );
        });
    
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
                    autoScrollBodyContent={true}
                >
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.props.handlers.submit}
                        noValidate
                    >
                        <FormsySelect
                            name="type"
                            required
                            floatingLabelText="Field type"
                            onChange={this.typeSelectChange}
                        >
                            {typeMenuItems}
                        </FormsySelect>                        
                        <CommonFields
                            state={this.props.state}
                            type={this.state.type}
                        />
                        <ListFields
                            state={this.props.state}
                            type={this.state.type}
                        />
                        <NumberFields
                            state={this.props.state}
                            type={this.state.type}
                        />
                        <div style={{textAlign: 'right'}}>
                            {actions}
                        </div>
                    </Formsy.Form>
                </Dialog>
            </span>
        );
    }
});

module.exports = AddField;