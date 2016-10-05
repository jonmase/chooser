import React from 'react';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import NumberField from '../elements/fields/number.jsx';

var NumberFields = React.createClass({
    render: function() {
        var values = this.props.values?this.props.values:{};
        
        var integer = false;
        if(typeof(values.integer) !== 'undefined' && values.integer !== 'false' && values.integer) {
            integer = true;
        }

        return (
            <div>
                <div>
                    <FormsyToggle
                        defaultToggled={integer}
                        label="Integer only"
                        labelPosition="right"
                        name="integer"
                    />
                </div>
                <div>
                    <NumberField
                        field={{
                            hint: "Enter minimum",
                            label: "Minimum value",
                            name: "number_min",
                            value: values.number_min,
                        }}
                    />
                </div>
                <div className="section">
                    <NumberField
                        field={{
                            hint: "Enter maximum",
                            label: "Maximum value",
                            name: "number_max",
                            value: values.number_max,
                        }}
                    />
                </div>
            </div>
        );
    }
});

module.exports = NumberFields;