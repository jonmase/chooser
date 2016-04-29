var React = require('react');
var TextField = require('../fields/text.jsx');

var CodeField = React.createClass({
    render: function() {
        return (
            <TextField
                label="Code"
                hint="Enter text"
                name="code"
                required={true}
            />
        );
    }
});

module.exports = CodeField;