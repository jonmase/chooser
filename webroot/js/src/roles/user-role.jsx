import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

var styles = {
    roleContainer: {
        whiteSpace: 'normal',
        display: 'inline-block',
        height: '32px',
        marginRight: '15px',
    },
    roleText: {
        lineHeight: '32px',
        fontSize: '14px',
        verticalAlign: '-2px',
    },
    roleRemoveButton: {
        marginLeft: '-2px',
        padding: '4px',
        height: '32px',
        width: '32px',
    },
    roleRemoveIcon: {
        //fontSize: '20px',
    },
};
    
var UsersRole = React.createClass({
    render: function() {
        var closeButton;
        
        if(this.props.role.id !== 'admin' || !this.props.user.current) {
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
            <span key={this.props.user.username + '_' + this.props.role.id} style={styles.roleContainer}>
                <span style={styles.roleText}>
                    {this.props.role.toUpperCase()}
                </span>
                {/*{closeButton}*/}
            </span>
        );
    }
});

module.exports = UsersRole;