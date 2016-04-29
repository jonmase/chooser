var React = require('react');
var NumberField = require('../fields/numeric.jsx');

var MinPlacesField = React.createClass({
    render: function() {
        return (
            <NumberField
                label="Minimum places"
                hint="Enter a number"
                name="min_places"
            />
        );
    }
});

module.exports = MinPlacesField;