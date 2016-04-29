import React from 'react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

var FilteringToggle = React.createClass({
    render: function() {
        return (
            <FormsyToggle
                label="Allow filtering by this field"
                defaultToggled={this.props.default}
                labelPosition="right"
                name="filterable"
            />
        );
    }
});

module.exports = FilteringToggle;