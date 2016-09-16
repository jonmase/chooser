import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var FilterableIcon = React.createClass({
    render: function() {
        var icon = 'filter_list';
        
        return (
            <FontIcon className="material-icons" title="Filterable">{icon}</FontIcon>
        );
    }
});

module.exports = FilterableIcon;