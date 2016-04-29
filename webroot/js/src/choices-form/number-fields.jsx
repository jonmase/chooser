var React = require('react');

var FilteringToggle = require('./filtering-toggle.jsx');
var NumericField = require('../fields/numeric.jsx');

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