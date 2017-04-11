import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var SortableIcon = React.createClass({
    render: function() {
        var icon = 'sort';
        
        return (
            <FontIcon className="material-icons" title="Sortable" style={this.props.style}>{icon}</FontIcon>
        );
    }
});

module.exports = SortableIcon;