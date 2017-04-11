import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var ShowToStudentsIcon = React.createClass({
    render: function() {
        var icon = 'visibility';
        
        return (
            <FontIcon className="material-icons" title="Show to Students">{icon}</FontIcon>
        );
    }
});

module.exports = ShowToStudentsIcon;