import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var RequiredIcon = React.createClass({
    render: function() {
        //var icon = 'done';
        //var icon = 'star_border';
        //var icon = 'star';
        var icon = 'error_outline';
        
        return (
            <FontIcon className="material-icons" title="Required" style={this.props.style}>{icon}</FontIcon>
        );
    }
});

module.exports = RequiredIcon;