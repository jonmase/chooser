import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var CategoryIcon = React.createClass({
    render: function() {
        var icon = 'view_module';
        //var icon = 'bubble_chart';
        //var icon = 'group_work';
        //var icon = 'layers';
        //var icon = 'style';
        
        return (
            <FontIcon className="material-icons" title="Use as Categories">{icon}</FontIcon>
        );
    }
});

module.exports = CategoryIcon;