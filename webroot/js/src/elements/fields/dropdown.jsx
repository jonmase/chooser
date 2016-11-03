import React from 'react';

import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import MenuItem from 'material-ui/MenuItem';

var DropdownField = React.createClass({
    render: function() {
        var field = this.props.field;

        var menuItems = field.options.map(function(option) {
            return (
                <MenuItem value={option.value} key={option.value} primaryText={option.label} />
            );
        });
    
        var required=field.required?true:false;
        
        return (
            <div className={field.section?'section':''}>
                <FormsySelect
                    name={field.name}
                    required={required}
                    floatingLabelText={field.label}
                    onChange={this.props.onChange}
                    style={field.style}
                    value={field.value}
                >
                    {menuItems}
                </FormsySelect>                        
                {/*
                //TODO: work out a better way of showing instructions for this
                <div>
                    <span className="sublabel">{field.instructions}</span>
                </div>
                */}
            </div>                        
        );
    }
});

module.exports = DropdownField;