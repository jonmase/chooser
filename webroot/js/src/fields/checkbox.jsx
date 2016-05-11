import React from 'react';

import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';

var CheckboxField = React.createClass({
    render: function() {
        var checkboxes = this.props.options.map(function(option) {
            return (
                <FormsyCheckbox 
                    name={this.props.name + '.' + option.value}
                    key={option.value} 
                    label={option.label} 
                    onChange={this.props.onChange}
                />
            );
        }, this);
    
        var required=this.props.required?true:false;
        return (
            <div>
                <label>
                    {this.props.label}<br />
                    <span className="sublabel">{this.props.sublabel}</span>
                </label>
                {checkboxes}
            </div>                        
        );
    }
});

module.exports = CheckboxField;