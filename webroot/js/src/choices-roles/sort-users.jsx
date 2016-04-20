var React = require('react');
//var Formsy = require('formsy-react');
//var FormsySelect = require('formsy-material-ui/lib/FormsySelect');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconButton = require('material-ui/lib/icon-button');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var UserSort = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },
    
    nameBase: "filterRoles",
    
    render: function() {
        return (
            <IconMenu
                iconButtonElement={<IconButton iconClassName="material-icons" tooltip="Sort Order">sort</IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                value={this.props.state.sortUsersField}
                onChange={this.props.handlers.change}
            >
                <MenuItem value={'username'} primaryText="Username" />
                <MenuItem value={'firstname'} primaryText="First Name" />
                <MenuItem value={'lastname'} primaryText="Last Name" />
            </IconMenu>            
            /*<div>
                <Formsy.Form
                    id="user_sort_form"
                    method="POST"
                    noValidate
                    onChange={this.props.handlers.change}
                >
                    <span style={this.props.titleStyle}>Sort By:</span> 
                    <FormsySelect
                        name='sort'
                        value={this.props.state.sortUsersField}
                    >
                        <MenuItem value={'username'} primaryText="Username" />
                        <MenuItem value={'firstname'} primaryText="First Name" />
                        <MenuItem value={'lastname'} primaryText="Last Name" />
                    </FormsySelect>
                </Formsy.Form>
            </div>*/
        );
    }
});

module.exports = UserSort;