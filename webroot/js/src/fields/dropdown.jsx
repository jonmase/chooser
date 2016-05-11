import React from 'react';

import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import MenuItem from 'material-ui/MenuItem';

var DropdownField = React.createClass({
    render: function() {
        var menuItems = this.props.options.map(function(option) {
            return (
                <MenuItem value={option.value} key={option.value} primaryText={option.label} />
            );
        });
    
        var required=this.props.required?true:false;
        return (
            <FormsySelect
                name={this.props.name}
                required={required}
                floatingLabelText={this.props.label}
                onChange={this.props.onChange}
            >
                {menuItems}
            </FormsySelect>                        
        );
    }
});

module.exports = DropdownField;