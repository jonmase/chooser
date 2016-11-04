import React from 'react';

import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import MenuItem from 'material-ui/MenuItem';

var DropdownField = React.createClass({
    handleChange: function(event, value, index) {
        //If this.props.onChange is a function, call it, adding the field name to the callback parameters
        if(typeof(this.props.onChange) === 'function') {
            this.props.onChange(event, value, index, this.props.field.name);
        }
    },

    render: function() {
        var field = this.props.field;

        var menuItems = field.options.map(function(option) {
            return (
                <MenuItem 
                    key={option.value} 
                    primaryText={option.label} 
                    value={option.value} 
                />
            );
        });
    
        var required=field.required?true:false;
        
        return (
            <div className={field.section?'section':''}>
                <FormsySelect
                    disabled={field.disabled}
                    floatingLabelText={field.label}
                    name={field.name}
                    onChange={this.handleChange}
                    style={field.style}
                    required={required}
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