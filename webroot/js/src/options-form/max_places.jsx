var React = require('react');
var NumberField = require('../fields/numeric.jsx');

var MaxPlacesField = React.createClass({
    render: function() {
        return (
            <NumberField
                label="Maximum places"
                hint="Enter a number"
                name="max_places"
            />
        );
    }
});

module.exports = MaxPlacesField;