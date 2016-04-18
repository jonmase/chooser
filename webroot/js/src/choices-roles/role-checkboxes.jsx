var React = require('react');
var Formsy = require('formsy-react');
var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var horizontalStyle = {
    width: 'auto', 
    display: 'inline-block', 
    marginRight: '35px',
};

var RoleCheckboxes = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },

    render: function() {
        var nameBase = this.props.nameBase;
        var onChange = this.props.onChange;
        var roleStates = this.props.roleStates;
        
        var style = {};
        if(this.props.arrange === 'horizontal') {
            style = horizontalStyle;
        }
        
        var roleNodes = this.props.roleOptions.map(function(role) {
            return (
                <FormsyCheckbox
                    key={role}
                    name={nameBase + '.' + role}
                    label={role.charAt(0).toUpperCase() + role.substring(1)}
                    defaultChecked={roleStates[role]}
                    onChange={onChange}
                    style={style}
                />
            );
        });

        return (
            <span>
                {roleNodes}
            </span>
        );
    }
});

module.exports = RoleCheckboxes;