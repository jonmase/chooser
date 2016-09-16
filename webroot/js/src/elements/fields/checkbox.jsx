import React from 'react';

import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';

import FieldLabel from './label.jsx';

var CheckboxField = React.createClass({
    render: function() {
        var field = this.props.field;

        var checkboxes = field.options.map(function(option) {
            var defaultChecked = false;
            if(typeof(field.value) !== "undefined" && typeof(field.value[option.value]) !== "undefined") {
                defaultChecked = !!field.value[option.value];
            }
            
            return (
                <FormsyCheckbox 
                    name={field.name + '.' + option.value}
                    key={option.value} 
                    label={option.label} 
                    onChange={this.props.onChange}
                    defaultChecked={defaultChecked}
                />
            );
        }, this);
    
        var required=field.required?true:false;
        
        return (
            <div className={field.section?'section':''}>
                <FieldLabel
                    label={field.label}
                    instructions={field.instructions}
                />
                {checkboxes}
            </div>                        
        );
    }
});

module.exports = CheckboxField;