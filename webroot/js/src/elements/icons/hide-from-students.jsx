import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {grey500} from 'material-ui/styles/colors';

var HideFromStudentsIcon = React.createClass({
    render: function() {
        var icon = 'visibility_off';
        
        return (
            <FontIcon className="material-icons" title="Hide from Students" style={{color: grey500}}>{icon}</FontIcon>
        );
    }
});

module.exports = HideFromStudentsIcon;