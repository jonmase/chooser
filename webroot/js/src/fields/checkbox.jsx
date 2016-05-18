import React from 'react';

import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';

var CheckboxField = React.createClass({
    render: function() {
        var field = this.props.field;

        var checkboxes = field.options.map(function(option) {
            return (
                <FormsyCheckbox 
                    name={field.name + '.' + option.value}
                    key={option.value} 
                    label={option.label} 
                    onChange={this.props.onChange}
                />
            );
        }, this);
    
        var required=field.required?true:false;
        
        return (
            <div className={field.section?'section':''}>
                <label>
                    {field.label}<br />
                    <span className="sublabel">{field.instructions}</span>
                </label>
                {checkboxes}
            </div>                        
        );
    }
});

module.exports = CheckboxField;