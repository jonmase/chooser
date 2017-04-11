import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {grey500} from 'material-ui/styles/colors';

var HideFromStudentsIcon = React.createClass({
    render: function() {
        var icon = 'visibility_off';
        var style = Object.assign({}, {color: grey500}, this.props.style);
        
        return (
            <FontIcon className="material-icons" title="Hide from Students" style={style}>{icon}</FontIcon>
        );
    }
});

module.exports = HideFromStudentsIcon;