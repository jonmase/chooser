var React = require('react');
var Formsy = require('formsy-react');
var FormsySelect = require('formsy-material-ui/lib/FormsySelect');
var MenuItem = require('material-ui/lib/menus/menu-item');

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
            <div>
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
            </div>
        );
    }
});

module.exports = UserSort;