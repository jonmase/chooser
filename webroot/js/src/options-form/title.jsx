var React = require('react');
var TextField = require('../fields/text.jsx');

var TitleField = React.createClass({
    render: function() {
        return (
            <TextField
                label="Title"
                hint="Enter text"
                name="title"
                required={true}
            />
        );
    }
});

module.exports = TitleField;