import React from 'react';

import FormsyRadioGroup from 'formsy-material-ui/lib/FormsyRadioGroup';
import FormsyRadio from 'formsy-material-ui/lib/FormsyRadio';

var RadioField = React.createClass({
    render: function() {
        var radios = this.props.options.map(function(option) {
            return (
                <FormsyRadio value={option.value} key={option.value} label={option.label} />
            );
        });
    
        var required=this.props.required?true:false;
        return (
            <div>
                <label>
                    {this.props.label}<br />
                    <span className="sublabel">{this.props.sublabel}</span>
                </label>
                <FormsyRadioGroup 
                    name={this.props.name}
                    required={required}
                    floatingLabelText={this.props.label}
                    onChange={this.props.onChange}
                >
                    {radios}
                </FormsyRadioGroup>                        
            </div>
        );
    }
});

module.exports = RadioField;