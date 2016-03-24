var React = require('react');
var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton  = require('material-ui/lib/flat-button');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var styles = {
    roleContainer: {
        whiteSpace: 'normal',
        display: 'inline-block',
    },
    roleText: {
        lineHeight: '48px',
        fontSize: '14px',
        verticalAlign: '-2px',
    },
    roleRemoveButton: {
        marginLeft: '-10px',
    },
    roleRemoveIcon: {
        //fontSize: '20px',
    },
};
    
var UsersRole = React.createClass({
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
        var closeButton;
        
        if(this.props.role !== 'admin' || !this.props.user.current) {
            closeButton = <IconButton 
                style={styles.roleRemoveButton} 
                iconStyle={styles.roleRemoveIcon} 
                linkButton={true} 
                href="javascript:void(0)"
            >
                <FontIcon className="material-icons">
                    close
                </FontIcon>
            </IconButton>;
        }
        
        return (
            <span key={this.props.user.username + '_' + this.props.role} style={styles.roleContainer}>
                <span style={styles.roleText}>
                    {this.props.role.toUpperCase()}
                </span>
                {closeButton}
            </span>
        );
        /*return (
            <FlatButton
                key={user.username + '_' + role}
                label={role}
                labelPosition="before"
                linkButton={true}
                href="javascript:void(0)"
                //secondary={true}
                icon={<FontIcon className="material-icons" >close</FontIcon>}
            />
        );*/
    }
});

module.exports = UsersRole;