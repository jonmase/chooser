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
        var roleStates = this.props.roleStates;
        
        var style = {};
        if(this.props.arrange === 'horizontal') {
            style = horizontalStyle;
        }
        
        var roleNodes = this.props.roles.map(function(role) {
            return (
                <FormsyCheckbox
                    key={role.id}
                    name={nameBase + '.' + role.id}
                    //label={role.id.charAt(0).toUpperCase() + role.id.substring(1)}
                    label={role.title + ' - ' + role.description}
                    defaultChecked={roleStates[role.id]}
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