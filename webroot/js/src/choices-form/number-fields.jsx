import React from 'react';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FilteringToggle from './filtering-toggle.jsx';
import NumericField from '../fields/numeric.jsx';

var CommonFields = React.createClass({
    render: function() {
        return (
            <div>
                <div>
                    <FilteringToggle default={false} />
                    <FormsyToggle
                        label="Integer only"
                        defaultToggled={false}
                        labelPosition="right"
                        name="integer"
                    />
                </div>
                <div>
                    <NumericField
                        field={{
                            label: "Minimum value",
                            hint: "Enter minimum",
                            name: "number_min",
                        }}
                    />
                </div>
                <div className="section">
                    <NumericField
                        field={{
                            label: "Maximum value",
                            hint: "Enter maximum",
                            name: "number_max",
                        }}
                    />
                </div>
            </div>
        );
    }
});

module.exports = CommonFields;