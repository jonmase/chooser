import React from 'react';

import FilteringToggle from './filtering-toggle.jsx';
import NumericField from '../fields/numeric.jsx';

var CommonFields = React.createClass({
    render: function() {
        return (
            <div style={{display: (this.props.type === 'number')?'block':'none'}}>
                <div>
                    <FilteringToggle default={false} />
                </div>
                <div>
                    <NumericField
                        label="Minimum value"
                        hint="Enter minimum"
                        name="number_minimum"
                    />
                </div>
                <div className="section">
                    <NumericField
                        label="Maximum value"
                        hint="Enter maximum"
                        name="number_maximum"
                    />
                </div>
            </div>
        );
    }
});

module.exports = CommonFields;