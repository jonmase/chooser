import React from 'react';
import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';

var horizontalStyle = {
    width: 'auto', 
    display: 'inline-block', 
    marginRight: '35px',
};

var RoleCheckboxes = React.createClass({
    render: function() {
        var nameBase = this.props.nameBase;
        var onChange = this.props.onChange;
        var rolesChecked = this.props.rolesChecked;
        
        var style = {};
        if(this.props.arrange === 'horizontal') {
            style = horizontalStyle;
        }
        
        var roleNodes = this.props.roles.map(function(role) {
            var disabled = false;
            var checked = rolesChecked[role.id];
            if(role.id !== 'admin' && rolesChecked.admin) {
                disabled = true;
                checked = true;
            }
        
            return (
                <FormsyCheckbox
                    disabled={disabled || this.props.disableAll}
                    key={role.id}
                    name={nameBase + '.' + role.id}
                    //label={role.id.charAt(0).toUpperCase() + role.id.substring(1)}
                    label={role.title + ' - ' + role.description}
                    onChange={onChange}
                    style={style}
                    value={checked}
                />
            );
        }, this);

        return (
            <span>
                {roleNodes}
            </span>
        );
    }
});

module.exports = RoleCheckboxes;