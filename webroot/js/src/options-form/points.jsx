var React = require('react');
var NumberField = require('../fields/numeric.jsx');

var PointsField = React.createClass({
    render: function() {
        return (
            <NumberField
                label="Points"
                hint="Enter a number"
                name="points"
            />
        );
    }
});

module.exports = PointsField;